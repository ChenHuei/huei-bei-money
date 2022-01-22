import { useContext, useEffect, useState } from "react";
import { collection, Firestore, getDocs } from "firebase/firestore/lite";
import { format } from "date-fns";
import { Dialog, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { FirebaseContext } from "@/context/firebase";

import Transition from "@/components/Transition";
import Header from "./Header";
import RecordList, { Record } from "./RecordList";
import CategoryList, { Category } from "./CategoryList";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(new Date());
  const [list, setList] = useState<Record[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const firebase = useContext(FirebaseContext);

  const getCurrentListApi = async (
    db: Firestore,
    time: Date
  ): Promise<Record[]> => {
    const snapshot = await getDocs(
      collection(db, "history", format(time, "yyyyMM"), "record")
    );
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Record[];
  };

  const getCategoryListApi = async (db: Firestore): Promise<Category[]> => {
    const snapshot = await getDocs(collection(db, "category"));
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Category[];
  };

  useEffect(() => {
    if (firebase) {
      Promise.all([
        getCurrentListApi(firebase, current),
        getCategoryListApi(firebase),
      ]).then(([data, categoryData]) => {
        setList(data);
        setCategoryList(categoryData);
      });
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

      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => setIsOpen(false)}
        TransitionComponent={Transition}
      >
        <div className="flex p-4 text-white bg-primaryDarker">
          <div className="mr-2" aria-hidden onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </div>
          <p>Create Record</p>
        </div>
        <div className="flex">
          <CategoryList list={categoryList} />
        </div>
      </Dialog>
    </main>
  );
}

export default Home;
