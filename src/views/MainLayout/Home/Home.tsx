/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from 'firebase/auth';
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

  const total = useMemo(() => list.reduce((acc, item) => acc + item.price, 0), [list]);

  const init = (db: Firestore, date: Date) =>
    Promise.all([getRecordApi(db, date), getCategoryListApi(db)]).then(([data, categoryData]) => {
      setList(data);
      setCategoryList(categoryData);
    });

  const onClose = () => {
    setForm(undefined);
    setOpenFormDialog(false);
  };

  const onConfirm = async (
    db: Firestore,
    data: RecordForm,
    form: RecordForm | undefined,
    user: User,
  ) => {
    try {
      const { price, categoryName } = data;
      const request = {
        ...data,
        price: price * (categoryName === '收' ? 1 : -1),
        createdBy: user.displayName ?? '',
      };
      const isEditFlow = form !== undefined;

      setIsOpenLoading(true);
      if (isEditFlow) {
        if (differentInMonthOrYear(form.date, data.date)) {
          await Promise.all([
            removeRecordApi(db, form.date, form.id as string),
            addRecordApi(db, request),
          ]);
        } else {
          await updateRecordApi(db, request);
        }
      } else {
        await addRecordApi(db, request);
      }

      setCurrentDate(new Date(data.date));
      onClose();
      setSnackbarState({ open: true, message: `${isEditFlow ? '編輯' : '新增'}成功` });
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
      removeRecordApi(db, date, id as string);
      onClose();
      setSnackbarState({ open: true, message: '刪除成功' });
      setTimeout(() => {
        getRecordApi(db, date).then((data) => setList(data));
      }, 166);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  };

  useEffect(() => {
    if (categoryList.length) {
      getRecordApi(firebase, currentDate).then((data) => setList(data));
    }
  }, [currentDate]);

  useEffect(() => {
    init(firebase, currentDate);
  }, []);

  return (
    <>
      <Header current={currentDate} total={total} onChange={setCurrentDate} />
      <div className="flex-1 p-4">
        <RecordList
          user={user}
          list={list}
          onClick={(data) => {
            setOpenFormDialog(true);
            setForm(data);
          }}
        />
      </div>
      <div className="fixed bottom-20 right-8">
        <Fab color="primary" aria-label="add" onClick={() => setOpenFormDialog(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={openFormDialog}
        form={form}
        categoryList={categoryList}
        onConfirm={(data) => {
          onConfirm(firebase, data, form, user);
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
