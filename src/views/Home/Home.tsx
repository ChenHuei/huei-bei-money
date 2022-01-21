import { useContext, useEffect, useState } from "react";
import { collection, Firestore, getDocs } from "firebase/firestore/lite";
import { format } from "date-fns";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { FirebaseContext } from "@/context/firebase";

import Header from "./Header";
import List, { HistoryItem } from "./List";

function Home() {
  const [current, setCurrent] = useState<Date>(new Date());
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const firebase = useContext(FirebaseContext);

  const getCurrentHistoryApi = async (db: Firestore, time: Date) => {
    const snapshot = await getDocs(
      collection(db, "history", format(time, "yyyyMM"), "record")
    );
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as HistoryItem[];

    setHistoryList(data);
  };

  useEffect(() => {
    if (firebase) getCurrentHistoryApi(firebase, current);
  }, [firebase, current]);

  return (
    <main className="relative flex flex-col min-w-full min-h-screen">
      <Header current={current} onChange={setCurrent} />
      <div className="flex-1 p-4 bg-primaryLighter">
        <List list={historyList} />
      </div>
      <div className="fixed bottom-8 right-8">
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
    </main>
  );
}

export default Home;
export type { HistoryItem };
