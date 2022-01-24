/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';

import { Dialog, Button } from '@mui/material';
import { DatePickerView } from '@mui/lab/DatePicker/shared';
import { LocalizationProvider, StaticDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface DateDialogProps {
  value: Date | null;
  views: DatePickerView[];
  onClose: () => void;
  onChange: (date: Date) => void;
}

function DateDialog(props: DateDialogProps) {
  const { value, views, onClose, onChange } = props;
  const [innerValue, setInnerValue] = useState<Date | null>(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <Dialog open onClose={() => onClose()}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="mobile"
          views={views}
          openTo="month"
          minDate={new Date(2021, 1, 1)}
          maxDate={new Date(2031, 1, 1)}
          value={innerValue}
          onChange={setInnerValue}
          renderInput={() => <></>}
        />
      </LocalizationProvider>
      <div className="flex justify-end px-6 py-4">
        <Button color="secondary" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (innerValue !== null) onChange(innerValue);
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
}

export default DateDialog;
export type { DateDialogProps };
