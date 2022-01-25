import { useContext, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Firestore } from 'firebase/firestore/lite';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FirebaseContext } from '@/context/firebase';
import { addRecordApi, updateRecordApi, getCategoryListApi, getRecordApi } from '@/api/home';

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

  const onConfirm = async (db: Firestore, data: RecordForm) => {
    setIsOpenLoading(true);
    const request = {
      ...data,
      createdBy: user.displayName ?? '',
    };
    await (form ? updateRecordApi(db, request) : addRecordApi(db, request));
    setCurrent(new Date(data.date));
    setIsOpenLoading(false);
    onClose();
    setTimeout(() => {
      setSnackbarState({ open: true, message: `${form ? '編輯' : '新增'}成功` });
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
          if (firebase) onConfirm(firebase, data);
        }}
        onClose={onClose}
      />
    </>
  );
}

export default Home;
