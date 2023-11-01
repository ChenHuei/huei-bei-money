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

import { FamilyRecord } from '@/views/MainLayout/Family/RecordList';

export const getFamilyRecordApi = async (
  db: Firestore
): Promise<FamilyRecord[]> => {
  const snapshot = await getDocs(collection(db, 'family'));
  return snapshot.docs
    .map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        }) as FamilyRecord
    )
    .sort((a, b) => b.date - a.date);
};

export const addFamilyRecordApi = (
  db: Firestore,
  data: FamilyRecord
): Promise<DocumentReference<DocumentData>> => {
  const { id, ...other } = data;
  return addDoc(collection(db, 'family'), other);
};

export const updateFamilyRecordApi = (
  db: Firestore,
  data: FamilyRecord
): Promise<void> => {
  const { id, ...other } = data;
  return updateDoc(doc(db, 'family', id), {
    ...other,
  });
};

export const removeFamilyRecordApi = (
  db: Firestore,
  id: string
): Promise<void> => deleteDoc(doc(db, 'family', id));
