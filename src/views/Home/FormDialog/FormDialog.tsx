/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useMemo, useEffect } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Transition from '@/components/Transition';
import Calculator from './Calculator';
import { Category } from './CategoryList';
import { Record } from '../RecordList';

interface FormDialogProps {
  isOpen: boolean;
  categoryList: Category[];
  onConfirm: (data: Omit<Record, 'id' | 'updatedTime'>) => void;
  onClose: () => void;
}

function FormDialog(props: FormDialogProps) {
  const { isOpen, categoryList, onConfirm, onClose } = props;
  const [open, setOpen] = useState(false);
  const { control, reset, handleSubmit, watch, setValue, getValues } = useForm<
    Omit<Record, 'id' | 'updatedTime'>
  >({
    defaultValues: {
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
    if (isOpen) reset();
  }, [isOpen]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <AppBar position="sticky" color="secondary">
        <Toolbar>
          <CloseIcon className="mr-2" aria-hidden onClick={onClose} />
          <p>Create Record</p>
        </Toolbar>
      </AppBar>
      <form className="flex flex-col flex-1 p-4" onSubmit={handleSubmit(onConfirm)}>
        <div className="flex-1">
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
                onChange={(e) => setValue('subCategoryId', e.target.value)}
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
        <div className="sticky bottom-0 left-0 h-12">
          <Button type="submit" className="h-full" variant="contained" color="secondary" fullWidth>
            submit
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default FormDialog;
export type { FormDialogProps };
