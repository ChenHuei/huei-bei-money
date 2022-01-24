import { useContext, useEffect, useState } from 'react';
import { collection, Firestore, getDocs } from 'firebase/firestore/lite';
import { format } from 'date-fns';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FirebaseContext } from '@/context/firebase';

import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog, { Category } from './FormDialog';

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(new Date());
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const firebase = useContext(FirebaseContext);

  const getCurrentListApi = async (db: Firestore, time: Date): Promise<Record[]> => {
    const snapshot = await getDocs(collection(db, 'history', format(time, 'yyyyMM'), 'record'));
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Record[];
  };

  const getCategoryListApi = async (db: Firestore): Promise<Category[]> => {
    const snapshot = await getDocs(collection(db, 'category'));
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Category[];
  };

  useEffect(() => {
    if (firebase) {
      Promise.all([getCurrentListApi(firebase, current), getCategoryListApi(firebase)]).then(
        ([data, categoryData]) => {
          setList(data);
          setCategoryList(categoryData);
        },
      );
    }
  }, [firebase, current]);

  return (
    <main className="relative flex flex-col min-w-full min-h-screen">
      <Header current={current} onChange={setCurrent} />
      <div className="flex-1 p-4 bg-primaryLighter">
        <RecordList list={list} />
      </div>
      <div className="fixed bottom-8 right-8">
        <Fab color="primary" aria-label="add" onClick={() => setIsOpen(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={isOpen}
        categoryList={categoryList}
        onConfirm={(data) => {
          console.log('data', data);
        }}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}

export default Home;
