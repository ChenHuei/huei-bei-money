import { format } from 'date-fns';
import { addDoc, collection, doc, Firestore, getDocs, updateDoc } from 'firebase/firestore/lite';

import { Record } from '@/views/MainLayout/Home/RecordList';
import { Category, RecordForm } from '@/views/MainLayout/Home/FormDialog';

export const getRecordApi = async (db: Firestore, time: Date): Promise<Record[]> => {
  const snapshot = await getDocs(collection(db, 'history', format(time, 'yyyyMM'), 'record'));
  return snapshot.docs
    .map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        } as Record),
    )
    .sort((a, b) => b.date - a.date);
};

export const addRecordApi = (db: Firestore, data: RecordForm) =>
  addDoc(collection(db, 'history', format(data.date, 'yyyyMM'), 'record'), {
    ...data,
  });

export const updateRecordApi = (db: Firestore, data: RecordForm) =>
  updateDoc(doc(db, 'history', format(data.date, 'yyyyMM'), 'record', data.id as string), {
    ...data,
  });

export const getCategoryListApi = async (db: Firestore): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, 'category'));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Category[];
};
