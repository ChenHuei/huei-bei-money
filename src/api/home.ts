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

/**
 * record
 *
 * 以 yyyyMM 為 key 的記憶體快取，減少 Firestore 讀取量：
 * - 讀取時 TTL 內直接回傳快取（家人新增的資料最多延遲 RECORD_CACHE_TTL 才看到）
 * - 新增／編輯／刪除成功後直接寫入快取，mutation 後的重新讀取不會再打到 Firestore
 */
const RECORD_CACHE_TTL = 5 * 60 * 1000;

const recordCache = new Map<string, { data: Record[]; fetchedAt: number }>();

const monthKey = (time: Date | number) => format(time, 'yyyyMM');

const sortRecords = (list: Record[]) =>
  [...list].sort((a, b) => b.date - a.date);

const updateRecordCache = (
  time: Date | number,
  updater: (list: Record[]) => Record[]
) => {
  const cached = recordCache.get(monthKey(time));
  if (cached) {
    // 保留原本的 fetchedAt：快取過期後 mutation 不會延長壽命，
    // 下次讀取仍會重新抓，避免蓋掉其他人在這段期間寫入的資料
    recordCache.set(monthKey(time), {
      data: sortRecords(updater(cached.data)),
      fetchedAt: cached.fetchedAt,
    });
  }
};

export const getHomeRecordApi = async (
  db: Firestore,
  time: Date | number
): Promise<Record[]> => {
  const cached = recordCache.get(monthKey(time));
  if (cached && Date.now() - cached.fetchedAt < RECORD_CACHE_TTL) {
    return cached.data;
  }

  const snapshot = await getDocs(
    collection(db, 'history', monthKey(time), 'record')
  );
  const data = sortRecords(
    snapshot.docs.map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        } as Record)
    )
  );
  recordCache.set(monthKey(time), { data, fetchedAt: Date.now() });
  return data;
};

export const addHomeRecordApi = async (
  db: Firestore,
  data: Record
): Promise<DocumentReference<DocumentData>> => {
  const { id, ...other } = data;
  const ref = await addDoc(
    collection(db, 'history', monthKey(data.date), 'record'),
    other
  );
  updateRecordCache(data.date, (list) => [...list, { ...other, id: ref.id }]);
  return ref;
};

export const updateHomeRecordApi = async (
  db: Firestore,
  data: Record
): Promise<void> => {
  const { id, ...other } = data;
  await updateDoc(
    doc(db, 'history', monthKey(data.date), 'record', id as string),
    {
      ...other,
    }
  );
  updateRecordCache(data.date, (list) =>
    list.map((item) => (item.id === id ? data : item))
  );
};

export const removeHomeRecordApi = async (
  db: Firestore,
  date: number | Date,
  id: string
): Promise<void> => {
  await deleteDoc(doc(db, 'history', monthKey(date), 'record', id));
  updateRecordCache(date, (list) => list.filter((item) => item.id !== id));
};

/**
 * category
 *
 * 分類幾乎不會變動，用 localStorage 快取（CATEGORY_CACHE_TTL 內不重新讀取），
 * 換裝置或過期後才會再打到 Firestore。
 */
const CATEGORY_CACHE_KEY = 'huei-bei-money:category-list';
const CATEGORY_CACHE_TTL = 24 * 60 * 60 * 1000;

export const getCategoryListApi = async (
  db: Firestore
): Promise<Category[]> => {
  try {
    const raw = localStorage.getItem(CATEGORY_CACHE_KEY);
    if (raw !== null) {
      const { data, fetchedAt } = JSON.parse(raw) as {
        data: Category[];
        fetchedAt: number;
      };
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        Date.now() - fetchedAt < CATEGORY_CACHE_TTL
      ) {
        return data;
      }
    }
  } catch {
    localStorage.removeItem(CATEGORY_CACHE_KEY);
  }

  const snapshot = await getDocs(collection(db, 'category'));
  const data = snapshot.docs
    .map(
      (item) =>
        ({
          id: item.id,
          ...item.data(),
        } as Category)
    )
    .sort((a, b) => a.sort - b.sort);

  try {
    localStorage.setItem(
      CATEGORY_CACHE_KEY,
      JSON.stringify({ data, fetchedAt: Date.now() })
    );
  } catch {
    // localStorage 不可用（例如隱私模式）時直接略過快取
  }

  return data;
};
