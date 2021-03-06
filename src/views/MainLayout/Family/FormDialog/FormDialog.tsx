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
import EventIcon from '@mui/icons-material/Event';

import { CATEGORY_LIST, FamilyCategory } from '@/constants/family';
import AlertDialog from '@/components/AlertDialog';
import Calculator from '@/components/Calculator';
import Transition from '@/components/Transition';
import DateDialog from '@/components/DateDialog';

import { FamilyRecord } from '../RecordList';

interface FamilyCalculator {
  open: boolean;
  target: '' | 'huei' | 'bei' | 'family';
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
  const [openDate, setOpenDate] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [calculator, setCalculator] = useState<FamilyCalculator>({
    open: false,
    target: '',
    price: 0,
  });
  const { control, handleSubmit, reset, getValues, setValue } = useForm<FamilyRecord>({
    defaultValues: {
      id: '',
      date: new Date().getTime(),
      type: '',
      title: '',
      huei: 0,
      bei: 0,
      family: 0,
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
        title={`??????????????? ${getValues('title')} ?????????????????? ?`}
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
          <p className="text-xl">{form !== undefined ? '??????' : '??????'}??????</p>
        </Toolbar>
      </AppBar>
      <form className="flex flex-col flex-1 p-4" onSubmit={handleSubmit(onConfirm)}>
        <div className="flex-1">
          <Controller
            name="date"
            control={control}
            rules={{ required: '???????????????' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                {openDate && (
                  <DateDialog
                    value={new Date(value)}
                    views={['year', 'month', 'day']}
                    onClose={() => setOpenDate(false)}
                    onChange={(e) => {
                      const date = e.getTime();
                      setValue('date', date);
                      setValue(
                        'title',
                        getValues('type') === FamilyCategory.savings ? format(date, 'yyyy/MM') : '',
                      );
                    }}
                  />
                )}
                <FormControl
                  error={!!error}
                  margin="normal"
                  fullWidth
                  onClick={() => setOpenDate(true)}
                >
                  <InputLabel htmlFor="date">??????</InputLabel>
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
            name="type"
            control={control}
            rules={{ required: '???????????????' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="type"
                label="??????"
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
                    val === FamilyCategory.savings ? format(getValues('date'), 'yyyy/MM') : '',
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
            rules={{ required: '???????????????' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <TextField
                id="title"
                label="??????"
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
                <InputLabel htmlFor="huei">Huei ??????</InputLabel>
                <OutlinedInput
                  id="huei"
                  label="Huei ??????"
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
                <InputLabel htmlFor="bei">Bei ??????</InputLabel>
                <OutlinedInput
                  id="bei"
                  label="Bei ??????"
                  type="number"
                  value={value}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  onChange={(e) => setValue('bei', parseInt(e.target.value, 10))}
                />
              </FormControl>
            )}
          />
          <Controller
            name="family"
            control={control}
            render={({ field: { value }, fieldState: { error } }) => (
              <FormControl
                error={!!error}
                margin="normal"
                fullWidth
                onClick={() =>
                  setCalculator({
                    open: true,
                    target: 'family',
                    price: value,
                  })
                }
              >
                <InputLabel htmlFor="family">Family ??????</InputLabel>
                <OutlinedInput
                  id="family"
                  label="Family ??????"
                  type="number"
                  value={value}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  onChange={(e) => setValue('family', parseInt(e.target.value, 10))}
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
              ??????
            </Button>
          )}
          <Button type="submit" className="h-full" variant="contained" color="secondary" fullWidth>
            {form === undefined ? '??????' : '??????'}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default FormDialog;
export type { FormDialogProps };
