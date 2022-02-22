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
  const [filterUser, setFilterUser] = useState<string[]>(
    [user.displayName ?? ''].filter((item) => item !== ''),
  );

  const total = useMemo(
    () =>
      list
        .filter((item) => filterUser.includes(item.createdBy))
        .reduce(
          (acc, item) => acc + (item.categoryId === INCOME_CATEGORY_ID ? 1 : -1) * item.price,
          0,
        ),
    [list, filterUser],
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

  const onCreate = async (db: Firestore, data: RecordForm) => {
    try {
      setIsOpenLoading(true);

      await addRecordApi(db, data);

      setCurrentDate(new Date(data.date));
      setSnackbarState({ open: true, message: '新增成功' });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  };

  const onUpdate = async (db: Firestore, data: RecordForm, originData: RecordForm) => {
    try {
      const { date: originDate, id } = originData;
      setIsOpenLoading(true);

      if (differentInMonthOrYear(originDate, data.date)) {
        await Promise.all([removeRecordApi(db, originDate, id as string), addRecordApi(db, data)]);
      } else {
        await updateRecordApi(db, data);
      }

      setCurrentDate(new Date(data.date));
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
      <Header
        current={currentDate}
        total={total}
        filter={filterUser}
        setFilter={setFilterUser}
        onChange={setCurrentDate}
      />
      <div className="flex-1 p-4 pb-16">
        <RecordList
          user={user}
          list={list}
          onClick={(data) => {
            setOpenFormDialog(true);
            setForm(data);
          }}
        />
      </div>
      <div className="fixed bottom-14 right-0 flex justify-end p-4">
        <Fab color="primary" aria-label="add" onClick={() => setOpenFormDialog(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={openFormDialog}
        form={form}
        userName={user.displayName ?? ''}
        categoryList={categoryList}
        onConfirm={(data) => {
          if (form) {
            onUpdate(firebase, data, form);
          } else {
            onCreate(firebase, data);
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
