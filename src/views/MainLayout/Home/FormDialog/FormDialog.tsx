/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';

import Transition from '@/components/Transition';
import DateDialog from '@/components/DateDialog';
import AlertDialog from './AlertDialog';
import Calculator from './Calculator';
import { Record } from '../RecordList';

interface CategoryDetail {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  sort: number;
  subCategory: CategoryDetail[];
}

type RecordForm = Omit<Record, 'id'> & { id?: string };

interface FormDialogProps {
  isOpen: boolean;
  form?: RecordForm;
  categoryList: Category[];
  onConfirm: (data: RecordForm) => void;
  onDelete: (data: RecordForm) => void;
  onClose: () => void;
}

function FormDialog(props: FormDialogProps) {
  const { isOpen, form, categoryList, onConfirm, onDelete, onClose } = props;
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { control, reset, handleSubmit, watch, setValue, getValues } = useForm<RecordForm>({
    defaultValues: {
      date: new Date().getTime(),
      categoryId: '',
      subCategoryId: '',
      categoryName: '',
      subCategoryName: '',
      price: 0,
      description: '',
    },
  });

  const currentCategoryId = watch('categoryId', '');

  const currentCategory = useMemo(
    () => categoryList.find((item) => item.id === currentCategoryId),
    [categoryList, currentCategoryId],
  );

  useEffect(() => {
    if (currentCategory) {
      setValue('categoryName', currentCategory.name);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (isOpen) {
      reset();

      if (form) {
        Object.entries(form).forEach(([key, value]) => {
          setValue(key as keyof RecordForm, value);
        });
      }
    }
  }, [isOpen]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      {openAlert && (
        <AlertDialog
          title={`確定要刪除 ${format(getValues('date'), 'yyyy/MM/dd')} 這一筆紀錄嗎 ?`}
          onConfirm={() => onDelete(getValues())}
          onClose={() => setOpenAlert(false)}
        />
      )}
      <AppBar position="sticky" color="secondary">
        <Toolbar>
          <CloseIcon className="mr-2" aria-hidden onClick={onClose} />
          <p className="text-xl">{form ? 'Edit' : 'Create'} Record</p>
        </Toolbar>
      </AppBar>
      <form className="flex flex-col flex-1 p-4" onSubmit={handleSubmit(onConfirm)}>
        <div className="flex-1">
          <Controller
            name="date"
            control={control}
            rules={{ required: '請輸入日期' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                {openDate && (
                  <DateDialog
                    value={new Date(value)}
                    views={['year', 'month', 'day']}
                    onClose={() => setOpenDate(false)}
                    onChange={(e) => setValue('date', e.getTime())}
                  />
                )}
                <FormControl
                  error={!!error}
                  margin="normal"
                  fullWidth
                  onClick={() => setOpenDate(true)}
                >
                  <InputLabel htmlFor="date">Date</InputLabel>
                  <OutlinedInput
                    id="date"
                    label="date"
                    value={format(new Date(value), 'yyyy/MM/dd')}
                    startAdornment={
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </>
            )}
          />
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: '請輸入主類別' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="categoryId"
                label="主類別"
                margin="normal"
                value={value}
                error={!!error}
                fullWidth
                select
                onChange={(e) => {
                  setValue('categoryId', e.target.value);
                  setValue('subCategoryId', '');
                }}
              >
                {categoryList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="subCategoryId"
            control={control}
            rules={{ required: '請輸入子類別' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="subCategoryId"
                label="子類別"
                margin="normal"
                value={value}
                error={!!error}
                fullWidth
                select
                onChange={(e) => {
                  const { value: val } = e.target;

                  setValue('subCategoryId', val);
                  const currentSubCategory = (currentCategory as Category).subCategory.find(
                    (item) => item.id === val,
                  );
                  if (currentSubCategory) {
                    setValue('subCategoryName', currentSubCategory.name);
                  }
                }}
              >
                {currentCategory ? (
                  currentCategory.subCategory.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>請先選擇主類別</MenuItem>
                )}
              </TextField>
            )}
          />
          <Controller
            name="price"
            control={control}
            rules={{
              validate: () => Number(getValues('price')) !== 0,
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                <Dialog open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
                  <Calculator
                    price={value}
                    onConfirm={(val) => {
                      setValue('price', val);
                      setOpen(false);
                    }}
                  />
                </Dialog>
                <FormControl
                  error={!!error}
                  margin="normal"
                  fullWidth
                  onClick={() => setOpen(true)}
                >
                  <InputLabel htmlFor="price">金額</InputLabel>
                  <OutlinedInput
                    id="price"
                    label="price"
                    value={value}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    onChange={(e) => setValue('price', parseInt(e.target.value, 10))}
                  />
                </FormControl>
              </>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                id="description"
                label="描述"
                margin="normal"
                value={value}
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('description', e.target.value)
                }
              />
            )}
          />
        </div>
        <Stack direction="row" spacing={2} className="sticky bottom-0 left-0 h-12 flex">
          {form !== undefined && (
            <Button
              className="h-full"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setOpenAlert(true)}
            >
              刪除
            </Button>
          )}
          <Button type="submit" className="h-full" variant="contained" color="secondary" fullWidth>
            {form === undefined ? '新增' : '儲存'}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default FormDialog;
export type { FormDialogProps, Category, RecordForm };
