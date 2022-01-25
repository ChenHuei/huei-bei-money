/* eslint-disable @typescript-eslint/no-shadow */
import { useContext, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore/lite';
import { format } from 'date-fns';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FirebaseContext } from '@/context/firebase';
import {
  addRecordApi,
  updateRecordApi,
  getCategoryListApi,
  getRecordApi,
  removeRecordApi,
} from '@/api/home';

import { MainLayoutOutletProps } from '../MainLayout';
import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog, { Category, RecordForm } from './FormDialog';

function Home() {
  const { setSnackbarState, setIsOpenLoading, user } = useOutletContext<MainLayoutOutletProps>();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(new Date());
  const [form, setForm] = useState<RecordForm | undefined>(undefined);
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const firebase = useContext(FirebaseContext);

  const total = useMemo(() => list.reduce((acc, item) => acc + item.price, 0), [list]);

  const init = (db: Firestore, date: Date) =>
    Promise.all([getRecordApi(db, date), getCategoryListApi(db)]).then(([data, categoryData]) => {
      setList(data);
      setCategoryList(categoryData);
    });

  const onClose = () => {
    setForm(undefined);
    setIsOpen(false);
  };

  const onCreateConfirm = async (db: Firestore, data: RecordForm, user: User) => {
    setIsOpenLoading(true);
    await addRecordApi(db, {
      ...data,
      createdBy: user.displayName ?? '',
    });
    setCurrent(new Date(data.date));
    setIsOpenLoading(false);
    onClose();
    setTimeout(() => {
      setSnackbarState({ open: true, message: '新增成功' });
    }, 166);
  };

  const onUpdateConfirm = async (db: Firestore, data: RecordForm, user: User) => {
    setIsOpenLoading(true);

    if (format((form as RecordForm).date, 'yyyyMM') !== format(data.date, 'yyyyMM')) {
      await removeRecordApi(db, form as RecordForm);
      await addRecordApi(db, {
        ...data,
        createdBy: user.displayName ?? '',
      });
    } else {
      await updateRecordApi(db, {
        ...data,
        createdBy: user.displayName ?? '',
      });
    }
    setCurrent(new Date(data.date));
    setIsOpenLoading(false);
    onClose();
    setTimeout(() => {
      setSnackbarState({ open: true, message: '編輯成功' });
    }, 166);
  };

  useEffect(() => {
    if (firebase && categoryList.length) {
      getRecordApi(firebase, current).then((data) => setList(data));
    }
  }, [firebase, current]);

  useEffect(() => {
    if (firebase) {
      init(firebase, current);
    }
  }, [firebase]);

  return (
    <>
      <Header current={current} total={total} onChange={setCurrent} />
      <div className="flex-1 p-4">
        <RecordList
          list={list}
          onClick={(data) => {
            setIsOpen(true);
            setForm(data);
          }}
        />
      </div>
      <div className="fixed bottom-20 right-8">
        <Fab color="primary" aria-label="add" onClick={() => setIsOpen(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={isOpen}
        form={form}
        categoryList={categoryList}
        onConfirm={(data) => {
          if (firebase) {
            if (form) {
              onUpdateConfirm(firebase, data, user);
            } else {
              onCreateConfirm(firebase, data, user);
            }
          }
        }}
        onClose={onClose}
      />
    </>
  );
}

export default Home;
