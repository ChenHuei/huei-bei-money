/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  addHomeRecordApi,
  updateHomeRecordApi,
  getHomeRecordApi,
  removeHomeRecordApi,
} from '@/api/home';
import { differentInMonthOrYear } from '@/utils/date';
import { INCOME_CATEGORY_ID } from '@/constants/home';

import { MainLayoutOutletProps } from '../MainLayout';
import Header from './Header';
import RecordList, { Record } from './RecordList';
import FormDialog from './FormDialog';

function Home() {
  const { setSnackbarState, setIsOpenLoading, user, categoryList, firebase } =
    useOutletContext<MainLayoutOutletProps>();
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [form, setForm] = useState<Record | undefined>(undefined);
  const [list, setList] = useState<Record[]>([]);
  const [filterUser, setFilterUser] = useState<string[]>(
    [user.displayName ?? ''].filter((item) => item !== ''),
  );

  const total = useMemo(
    () =>
      list
        .filter((item) => filterUser.includes(item.createdBy))
        .reduce(
          (acc, item) => acc + (item.categoryId === INCOME_CATEGORY_ID ? 1 : -1) * item.price,
          0,
        ),
    [list, filterUser],
  );

  const onClose = useCallback(() => {
    setForm(undefined);
    setOpenFormDialog(false);
  }, []);

  const init = useCallback(
    async (date: number | Date) => {
      try {
        onClose();
        setIsOpenLoading(true);
        const data = await getHomeRecordApi(firebase, date);
        setList(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, onClose, setIsOpenLoading],
  );

  const onCreate = useCallback(
    async (data: Record) => {
      try {
        setIsOpenLoading(true);

        await addHomeRecordApi(firebase, data);

        setCurrentDate(new Date(data.date));
        setSnackbarState({ open: true, message: '新增成功' });
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, setIsOpenLoading, setSnackbarState],
  );

  const onUpdate = useCallback(
    async (data: Record, originData: Record) => {
      try {
        const { date: originDate, id } = originData;
        setIsOpenLoading(true);

        if (differentInMonthOrYear(originDate, data.date)) {
          await Promise.all([
            removeHomeRecordApi(firebase, originDate, id as string),
            addHomeRecordApi(firebase, data),
          ]);
        } else {
          await updateHomeRecordApi(firebase, data);
        }

        setCurrentDate(new Date(data.date));
        setSnackbarState({ open: true, message: '編輯成功' });
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, setIsOpenLoading, setSnackbarState],
  );

  const onDelete = useCallback(
    async (data: Record) => {
      try {
        const { date, id } = data;
        setIsOpenLoading(true);

        await removeHomeRecordApi(firebase, date, id as string);

        setCurrentDate(new Date(date));
        setSnackbarState({ open: true, message: '刪除成功' });
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, setIsOpenLoading, setSnackbarState],
  );

  useEffect(() => {
    init(currentDate);
  }, [currentDate, init]);

  return (
    <>
      <Header
        current={currentDate}
        total={total}
        filter={filterUser}
        setFilter={setFilterUser}
        onChange={setCurrentDate}
      />
      <div className="flex-1 p-4 pb-16">
        <RecordList
          user={user}
          list={list}
          onClick={(data) => {
            setOpenFormDialog(true);
            setForm(data);
          }}
        />
      </div>
      <div className="fixed bottom-20 right-0 flex justify-end p-4">
        <Fab color="primary" aria-label="add" onClick={() => setOpenFormDialog(true)}>
          <AddIcon />
        </Fab>
      </div>

      <FormDialog
        isOpen={openFormDialog}
        form={form}
        userName={user.displayName ?? ''}
        categoryList={categoryList}
        onConfirm={(data) => {
          if (form) {
            onUpdate(data, form);
          } else {
            onCreate(data);
          }
        }}
        onDelete={onDelete}
        onClose={onClose}
      />
    </>
  );
}

export default Home;
