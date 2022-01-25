import { format } from 'date-fns';
import { addDoc, collection, Firestore, getDocs } from 'firebase/firestore/lite';

import { Record } from '@/views/MainLayout/Home/RecordList';
import { Category } from '@/views/MainLayout/Home/FormDialog';

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

export const addRecordApi = (db: Firestore, data: Omit<Record, 'id'>) =>
  addDoc(collection(db, 'history', format(data.date, 'yyyyMM'), 'record'), {
    ...data,
    createdBy: 'huei',
  });

export const getCategoryListApi = async (db: Firestore): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, 'category'));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Category[];
};
