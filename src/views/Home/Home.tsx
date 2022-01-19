import { useContext, useEffect, useState } from "react";
import { collection, Firestore, getDocs } from "firebase/firestore/lite";
import { format } from "date-fns";

import { FirebaseContext } from "@/context/firebase";

import Header from "./Header";
import List, { HistoryItem } from "./List";

function Home() {
  const [current, setCurrent] = useState<Date>(new Date());
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const firebase = useContext(FirebaseContext);

  const getCurrentHistoryApi = async (db: Firestore) => {
    const snapshot = await getDocs(
      collection(db, "history", format(current, "yyyyMM"), "record")
    );
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as HistoryItem[];

    setHistoryList(data);
  };

  useEffect(() => {
    if (firebase) getCurrentHistoryApi(firebase);
  }, [firebase]);

  return (
    <main className="flex flex-col min-w-full min-h-screen">
      <Header current={current} onChange={setCurrent} />
      <div className="flex-1 bg-primaryLighter">
        <List list={historyList} />
      </div>
    </main>
  );
}

export default Home;
export type { HistoryItem };
