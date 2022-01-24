import { useContext, useEffect, useState } from 'react';
import { Firestore } from 'firebase/firestore/lite';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FirebaseContext } from '@/context/firebase';
import { addRecordApi, getCategoryListApi, getRecordApi } from '@/api/home';

import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog, { Category } from './FormDialog';

interface HomeProps {
  setSnackbarState: Function;
  setLoadingState: Function;
}

function Home(props: HomeProps) {
  const { setSnackbarState, setLoadingState } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(new Date());
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const firebase = useContext(FirebaseContext);

  const init = (db: Firestore, date: Date) =>
    Promise.all([getRecordApi(db, date), getCategoryListApi(db)]).then(([data, categoryData]) => {
      setList(data);
      setCategoryList(categoryData);
    });

  useEffect(() => {
    if (firebase) {
      init(firebase, current);
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
        onConfirm={async (data) => {
          if (firebase) {
            setLoadingState({ open: true });
            await addRecordApi(firebase, {
              ...data,
              createdBy: 'huei',
            });
            await init(firebase, new Date(data.date));
            setIsOpen(false);
            setLoadingState({ open: false });
            setTimeout(() => {
              setSnackbarState({ open: true, message: '新增成功' });
            }, 166);
          }
        }}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}

export default Home;
export type { HomeProps };
