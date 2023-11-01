import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  AppBar,
  Button,
  Dialog,
  Stack,
  Toolbar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';

import { ChartForm, DEFAULT_FORM } from '@/constants/chart';
import Transition from '@/components/Transition';
import DateRangeDialog from '@/components/DateRangeDialog';

interface FormDialogProps {
  isOpen: boolean;
  form: ChartForm;
  onClose: () => void;
  onConfirm: (data: ChartForm) => void;
}

function FormDialog(props: FormDialogProps) {
  const { isOpen, form, onClose, onConfirm } = props;
  const { control, reset, handleSubmit, setValue } = useForm<ChartForm>({
    defaultValues: DEFAULT_FORM,
  });
  const [openDate, setOpenDate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset();

      Object.entries(form).forEach(([key, value]) => {
        setValue(key as keyof ChartForm, value);
      });
    }
  }, [form, isOpen, reset, setValue]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className="py-1" position="sticky" color="secondary">
        <Toolbar>
          <CloseIcon className="mr-2" aria-hidden onClick={onClose} />
          <p className="text-xl">圖表篩選條件</p>
        </Toolbar>
      </AppBar>
      <form
        className="flex flex-col flex-1 p-4"
        onSubmit={handleSubmit(onConfirm)}
      >
        <div className="flex-1">
          <Controller
            name="date"
            control={control}
            rules={{ required: '請輸入日期' }}
            render={({ field: { value }, fieldState: { error } }) => (
              <>
                {openDate && (
                  <DateRangeDialog
                    value={value}
                    onClose={() => setOpenDate(false)}
                    onChange={(e) => {
                      const [start, end] = e;
                      if (start !== null && end !== null) {
                        setValue('date', [start, end]);
                      }
                    }}
                  />
                )}
                <FormControl
                  error={!!error}
                  margin="normal"
                  fullWidth
                  onClick={() => setOpenDate(true)}
                >
                  <InputLabel htmlFor="date">日期</InputLabel>
                  <OutlinedInput
                    id="date"
                    label="日期"
                    value={`${
                      value[0] === null ? null : format(value[0], 'yyyy/MM/dd')
                    } - ${
                      value[1] === null ? null : format(value[1], 'yyyy/MM/dd')
                    }`}
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
        </div>
        <Stack
          direction="row"
          spacing={2}
          className="sticky bottom-4 left-0 h-12 flex"
        >
          <Button
            type="submit"
            className="h-full"
            variant="contained"
            color="secondary"
            fullWidth
          >
            確認
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default FormDialog;
export type { FormDialogProps };
