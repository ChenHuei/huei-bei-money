import { addMonths, startOfMonth } from 'date-fns';
import { FamilyCategory } from '@/constants/family';
import { FamilyRecord } from '@/views/MainLayout/Family/RecordList';

export interface FamilyReportRow {
  record: FamilyRecord;
  amount: number;
  balance: number;
}

export const getFamilyMonthReport = (
  records: FamilyRecord[],
  month: Date,
  now: Date = new Date()
) => {
  const start = startOfMonth(month).getTime();
  const end = addMonths(start, 1).getTime();
  let opening = 0;
  let balance = 0;
  let savings = 0;
  let expenses = 0;
  const advances = { huei: 0, bei: 0 };
  const rows: FamilyReportRow[] = [];

  // Reverse the API's newest-first order before a stable chronological sort.
  [...records]
    .reverse()
    .sort((a, b) => a.date - b.date)
    .forEach((record) => {
      if (record.date >= end || record.date > now.getTime()) return;
      const isSavings = record.type === FamilyCategory.savings;
      const total = record.huei + record.bei + record.family;
      const amount = total * (isSavings ? 1 : -1);
      balance += amount;
      (['huei', 'bei'] as const).forEach((user) => {
        advances[user] = Math.max(
          0,
          advances[user] + record[user] * (isSavings ? -1 : 1)
        );
      });
      if (record.date < start) {
        opening = balance;
      } else {
        if (isSavings) savings += total;
        else expenses += total;
        rows.push({ record, amount, balance });
      }
    });

  return {
    opening,
    balance,
    savings,
    expenses,
    advances,
    rows,
    change: savings - expenses,
    estimatedBankBalance: balance + advances.huei + advances.bei,
  };
};
