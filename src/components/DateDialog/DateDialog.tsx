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
          openTo={views[views.length - 1]}
          minDate={new Date(2019, 12, 1)}
          maxDate={new Date(2031, 11, 31)}
          value={innerValue}
          onChange={setInnerValue}
          renderInput={() => <></>}
        />
      </LocalizationProvider>
      <div className="flex justify-end px-6 py-4">
        <Button color="secondary" onClick={() => onClose()}>
          取消
        </Button>
        <Button
          onClick={() => {
            if (innerValue !== null) onChange(innerValue);
            onClose();
          }}
        >
          確認
        </Button>
      </div>
    </Dialog>
  );
}

export default DateDialog;
export type { DateDialogProps };
