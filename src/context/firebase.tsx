/* eslint-disable react/destructuring-assignment */
import { createContext, PropsWithChildren, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore/lite';

const FirebaseContext = createContext<Firestore | null>(null);

export default function FirebaseProvider(props: PropsWithChildren<{}>) {
  const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  });

  const firebase = useMemo(() => getFirestore(app), [app]);

  return (
    <FirebaseContext.Provider value={firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

export { FirebaseContext };
