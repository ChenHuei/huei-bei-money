/* eslint-disable import/prefer-default-export */
import { format } from 'date-fns';

export const differentInMonthOrYear = (date1: number | Date, date2: number | Date) =>
  format(date1, 'yyyyMM') !== format(date2, 'yyyyMM');
