import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  addFamilyRecordApi,
  getFamilyRecordApi,
  removeFamilyRecordApi,
  updateFamilyRecordApi,
} from '@/api/family';

import { MainLayoutOutletProps } from '../MainLayout';
import RecordList, { FamilyRecord } from './RecordList';
import FormDialog from './FormDialog';
import Header from './Header';

function Family() {
  const { setSnackbarState, setIsOpenLoading, firebase } =
    useOutletContext<MainLayoutOutletProps>();
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [form, setForm] = useState<FamilyRecord | undefined>(undefined);
  const [list, setList] = useState<FamilyRecord[]>([]);

  const onClose = useCallback(() => {
    setForm(undefined);
    setOpenFormDialog(false);
  }, []);

  const init = useCallback(async () => {
    try {
      onClose();
      setIsOpenLoading(true);

      await getFamilyRecordApi(firebase).then((data) => {
        setList(data);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsOpenLoading(false);
    }
  }, [firebase, onClose, setIsOpenLoading]);

  const onConfirm = useCallback(
    async (data: FamilyRecord) => {
      try {
        setIsOpenLoading(true);
        if (form) {
          await updateFamilyRecordApi(firebase, data);
          setSnackbarState({ open: true, message: '編輯成功' });
        } else {
          await addFamilyRecordApi(firebase, data);
          setSnackbarState({ open: true, message: '新增成功' });
        }
        await init();
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, form, init, setIsOpenLoading, setSnackbarState],
  );

  const onDelete = useCallback(
    async (data: FamilyRecord) => {
      try {
        setIsOpenLoading(true);
        await removeFamilyRecordApi(firebase, data.id as string);
        setSnackbarState({ open: true, message: '刪除成功' });
        await init();
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpenLoading(false);
      }
    },
    [firebase, init, setIsOpenLoading, setSnackbarState],
  );

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <Header list={list} />
      <div className="flex-1 p-4 pb-16">
        <RecordList
          list={list}
          onClick={(data) => {
            setForm(data);
            setOpenFormDialog(true);
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
        onConfirm={onConfirm}
        onDelete={onDelete}
        onClose={onClose}
      />
    </>
  );
}

export default Family;
