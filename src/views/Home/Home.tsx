import { useContext, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Firestore } from 'firebase/firestore/lite';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FirebaseContext } from '@/context/firebase';
import { addRecordApi, getCategoryListApi, getRecordApi } from '@/api/home';

import { OutletProps } from '@/App';

import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog, { Category } from './FormDialog';

function Home() {
  const { setSnackbarState, setIsOpenLoading } = useOutletContext<OutletProps>();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(new Date());
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const firebase = useContext(FirebaseContext);

  const total = useMemo(() => list.reduce((acc, item) => acc + item.price, 0), [list]);

  const init = (db: Firestore, date: Date) =>
    Promise.all([getRecordApi(db, date), getCategoryListApi(db)]).then(([data, categoryData]) => {
      setList(data);
      setCategoryList(categoryData);
    });

  const onClose = () => setIsOpen(false);

  const onConfirm = async (db: Firestore, data: Omit<Record, 'id'>) => {
    setIsOpenLoading(true);
    await addRecordApi(db, {
      ...data,
      createdBy: 'huei',
    });
    setCurrent(new Date(data.date));
    setIsOpenLoading(false);
    onClose();
    setTimeout(() => {
      setSnackbarState({ open: true, message: '新增成功' });
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
        <RecordList list={list} />
      </div>
      <div className="fixed bottom-20 right-8">
        <Fab color="primary" aria-label="add" onClick={() => setIsOpen(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={isOpen}
        categoryList={categoryList}
        onConfirm={async (data) => {
          if (firebase) onConfirm(firebase, data);
        }}
        onClose={onClose}
      />
    </>
  );
}

export default Home;
