/* eslint-disable import/prefer-default-export */
import { useContext } from 'react';
import { Firestore } from 'firebase/firestore/lite';
import { FirebaseContext } from '@/context/firebase';

export const useFirebase = (): Firestore => {
  const firebase = useContext(FirebaseContext);

  if (firebase === null) {
    throw new Error('firebase went wrong');
  }

  return firebase;
};
