import { format } from 'date-fns';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite';

import { Record } from '@/views/MainLayout/Home/RecordList';
import { Category } from '@/views/MainLayout/Home/FormDialog';

/** record */
export const getHomeRecordApi = async (db: Firestore, time: Date | number): Promise<Record[]> => {
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

export const addHomeRecordApi = (
  db: Firestore,
  data: Record,
): Promise<DocumentReference<DocumentData>> => {
  const { id, ...other } = data;
  return addDoc(collection(db, 'history', format(data.date, 'yyyyMM'), 'record'), other);
};

export const updateHomeRecordApi = (db: Firestore, data: Record): Promise<void> => {
  const { id, ...other } = data;
  return updateDoc(doc(db, 'history', format(data.date, 'yyyyMM'), 'record', id as string), {
    ...other,
  });
};

export const removeHomeRecordApi = (
  db: Firestore,
  date: number | Date,
  id: string,
): Promise<void> => deleteDoc(doc(db, 'history', format(date, 'yyyyMM'), 'record', id as string));

/** category */
export const getCategoryListApi = async (db: Firestore): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, 'category'));
  return snapshot.docs
    .map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        } as Category),
    )
    .sort((a, b) => a.sort - b.sort);
};
