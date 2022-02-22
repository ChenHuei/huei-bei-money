/* eslint-disable react/require-default-props */
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CATEGORY_LIST, FamilyCategory } from '@/constants/family';
import AlertDialog from '@/components/AlertDialog';
import Calculator from '@/components/Calculator';
import Transition from '@/components/Transition';

import { FamilyRecord } from '../RecordList';

interface FamilyCalculator {
  open: boolean;
  target: '' | 'huei' | 'bei';
  price: number;
}

interface FormDialogProps {
  isOpen: boolean;
  form?: FamilyRecord;
  onConfirm: (data: FamilyRecord) => void;
  onDelete: (data: FamilyRecord) => void;
  onClose: () => void;
}

function FormDialog(props: FormDialogProps) {
  const { isOpen, form, onConfirm, onDelete, onClose } = props;
  const [openAlert, setOpenAlert] = useState(false);
  const [calculator, setCalculator] = useState<FamilyCalculator>({
    open: false,
    target: '',
    price: 0,
  });
  const { control, handleSubmit, reset, getValues, setValue } = useForm<FamilyRecord>({
    defaultValues: {
      id: '',
      type: '',
      title: '',
      huei: 0,
      bei: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();

      if (form) {
        Object.entries(form).forEach(([key, value]) => {
          setValue(key as keyof FamilyRecord, value);
        });
      }
    }
  }, [form, isOpen, reset, setValue]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <AlertDialog
        isOpen={openAlert}
        title={`確定要刪除 ${getValues('title')} 這一筆紀錄嗎 ?`}
        onConfirm={() => onDelete(getValues())}
        onClose={() => setOpenAlert(false)}
      />
      <Dialog
        open={calculator.open}
        onClose={() => setCalculator({ open: false, target: '', price: 0 })}
        TransitionComponent={Transition}
      >
        <Calculator
          price={calculator.price}
          onConfirm={(val) => {
            if (calculator.target !== '') setValue(calculator.target, val);
            setCalculator({ open: false, target: '', price: 0 });
          }}
        />
      </Dialog>
      <AppBar className="py-1" position="sticky" color="secondary">
        <Toolbar>
          <CloseIcon className="mr-2" aria-hidden onClick={onClose} />
          <p className="text-xl">{form !== undefined ? '編輯' : '新增'}紀錄</p>
        </Toolbar>
      </AppBar>
      <form className="flex flex-col flex-1 p-4" onSubmit={handleSubmit(onConfirm)}>
        <div className="flex-1">
          <Controller
            name="type"
            control={control}
            rules={{ required: '請輸入類別' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="type"
                label="類別"
                margin="normal"
                value={value}
                error={!!error}
                fullWidth
                select
                onChange={(e) => {
                  const { value: val } = e.target;

                  setValue('type', val as FamilyCategory);
                  setValue(
                    'title',
                    val === FamilyCategory.savings ? format(new Date(), 'yyyy/MM') : '',
                  );
                }}
              >
                {CATEGORY_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="title"
            control={control}
            rules={{ required: '請輸入標題' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="title"
                label="標題"
                margin="normal"
                value={value}
                error={!!error}
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue('title', e.target.value);
                }}
              />
            )}
          />
          <Controller
            name="huei"
            control={control}
            rules={{
              validate: () => Number(getValues('huei')) !== 0,
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <FormControl
                error={!!error}
                margin="normal"
                fullWidth
                onClick={() =>
                  setCalculator({
                    open: true,
                    target: 'huei',
                    price: value,
                  })
                }
              >
                <InputLabel htmlFor="huei">Huei 金額</InputLabel>
                <OutlinedInput
                  id="huei"
                  label="Huei 金額"
                  type="number"
                  value={value}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  onChange={(e) => setValue('huei', parseInt(e.target.value, 10))}
                />
              </FormControl>
            )}
          />
          <Controller
            name="bei"
            control={control}
            rules={{
              validate: () => Number(getValues('bei')) !== 0,
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <FormControl
                error={!!error}
                margin="normal"
                fullWidth
                onClick={() =>
                  setCalculator({
                    open: true,
                    target: 'bei',
                    price: value,
                  })
                }
              >
                <InputLabel htmlFor="bei">Bei 金額</InputLabel>
                <OutlinedInput
                  id="bei"
                  label="Bei 金額"
                  type="number"
                  value={value}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  onChange={(e) => setValue('bei', parseInt(e.target.value, 10))}
                />
              </FormControl>
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
export type { FormDialogProps };
