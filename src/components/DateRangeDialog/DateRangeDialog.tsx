/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { Dialog, Button } from '@mui/material';
import {
  DateRange,
  LocalizationProvider,
  StaticDateRangePicker,
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface DateDialogProps {
  value: DateRange<Date>;
  onClose: () => void;
  onChange: (date: DateRange<Date>) => void;
}

function DateRangeDialog(props: DateDialogProps) {
  const { value, onClose, onChange } = props;
  const [innerValue, setInnerValue] = useState<DateRange<Date>>(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <Dialog open onClose={() => onClose()}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
          startText="開始日期"
          endText="結束日期"
          value={value}
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

export default DateRangeDialog;
export type { DateDialogProps };
