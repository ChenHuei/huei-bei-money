/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Firestore } from 'firebase/firestore/lite';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  addRecordApi,
  updateRecordApi,
  getCategoryListApi,
  getRecordApi,
  removeRecordApi,
} from '@/api/home';
import { differentInMonthOrYear } from '@/utils/date';

import { useFirebase } from '@/hooks/useFirebase';
import { INCOME_CATEGORY_ID } from '@/constants/home';
import { MainLayoutOutletProps } from '../MainLayout';
import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog, { Category, RecordForm } from './FormDialog';

function Home() {
  const firebase = useFirebase();
  const { setSnackbarState, setIsOpenLoading, user } = useOutletContext<MainLayoutOutletProps>();
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [form, setForm] = useState<RecordForm | undefined>(undefined);
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const total = useMemo(
    () =>
      list
        .filter((item) => item.createdBy === user.displayName)
        .reduce(
          (acc, item) => acc + (item.categoryId === INCOME_CATEGORY_ID ? 1 : -1) * item.price,
          0,
        ),
    [list, user],
  );

  const onClose = useCallback(() => {
    setForm(undefined);
    setOpenFormDialog(false);
  }, []);

  const init = useCallback(async (db: Firestore, date: number | Date) => {
    try {
      setIsOpenLoading(true);

      await Promise.all([
        getRecordApi(db, date),
        ...(categoryList.length === 0 ? [getCategoryListApi(db)] : []),
      ]).then(([data, categoryData]) => {
        setList(data);
        setCategoryList(categoryData);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  }, []);

  const onCreate = async (db: Firestore, data: RecordForm, userName: string) => {
    try {
      const { date } = data;
      setIsOpenLoading(true);

      await addRecordApi(db, {
        ...data,
        createdBy: userName,
      });

      setCurrentDate(new Date(date));
      setSnackbarState({ open: true, message: '新增成功' });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  };

  const onUpdate = async (
    db: Firestore,
    data: RecordForm,
    originData: RecordForm,
    userName: string,
  ) => {
    try {
      const { date: originDate, id } = originData;
      const { date } = data;
      const request = {
        ...data,
        createdBy: userName,
      };
      setIsOpenLoading(true);

      if (differentInMonthOrYear(originDate, date)) {
        await Promise.all([
          removeRecordApi(db, originDate, id as string),
          addRecordApi(db, request),
        ]);
      } else {
        await updateRecordApi(db, request);
      }

      setCurrentDate(new Date(date));
      setSnackbarState({ open: true, message: '編輯成功' });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  };

  const onDelete = async (db: Firestore, data: RecordForm) => {
    try {
      const { date, id } = data;
      setIsOpenLoading(true);

      await removeRecordApi(db, date, id as string);
      setSnackbarState({ open: true, message: '刪除成功' });
      onClose();
      init(db, date);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  };

  useEffect(() => {
    init(firebase, currentDate);
  }, [currentDate]);

  return (
    <>
      <Header current={currentDate} total={total} onChange={setCurrentDate} />
      <div className="flex-1 px-6 py-4">
        <RecordList
          user={user}
          list={list}
          onClick={(data) => {
            setOpenFormDialog(true);
            setForm(data);
          }}
        />
      </div>
      <div className="sticky bottom-0 right-0 flex justify-end p-4">
        <Fab color="primary" aria-label="add" onClick={() => setOpenFormDialog(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={openFormDialog}
        form={form}
        categoryList={categoryList}
        onConfirm={(data) => {
          const userName = user.displayName ?? '';
          if (form) {
            onUpdate(firebase, data, form, userName);
          } else {
            onCreate(firebase, data, userName);
          }
        }}
        onDelete={(data) => {
          onDelete(firebase, data);
        }}
        onClose={onClose}
      />
    </>
  );
}

export default Home;
