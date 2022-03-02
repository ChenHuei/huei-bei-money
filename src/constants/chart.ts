import { DateRange } from '@mui/lab';
import { endOfMonth, startOfMonth } from 'date-fns';

export interface ChartForm {
  date: DateRange<Date>;
}

export const DEFAULT_FORM: ChartForm = {
  date: [startOfMonth(new Date()), endOfMonth(new Date())],
};
