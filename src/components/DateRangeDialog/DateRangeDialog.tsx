/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { LocalizationProvider, StaticDateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { ChartForm } from '@/constants/chart';
import { PickObj } from '@/utils/interface';

interface DateDialogProps {
  value: PickObj<ChartForm, 'date'>;
  onClose: () => void;
  onChange: (date: PickObj<ChartForm, 'date'>) => void;
}

function DateRangeDialog(props: DateDialogProps) {
  const { value, onClose, onChange } = props;
  const [innerValue, setInnerValue] = useState<PickObj<ChartForm, 'date'>>(value);

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
