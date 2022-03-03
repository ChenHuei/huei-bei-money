import { endOfMonth, startOfMonth } from 'date-fns';

export interface ChartForm {
  date: [Date, Date];
}

export const DEFAULT_FORM: ChartForm = {
  date: [startOfMonth(new Date()), endOfMonth(new Date())],
};
