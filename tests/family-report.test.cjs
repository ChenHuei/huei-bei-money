const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {}, require: (name) => name === 'date-fns' ? require(name) : { FamilyCategory: { savings: 'savings', expend: 'expend' } } };
vm.runInNewContext(ts.transpileModule(readFileSync('src/utils/familyReport.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const { getFamilyMonthReport: report } = context.exports;
const date = (month, day = 1) => new Date(2026, month - 1, day);
const row = (id, month, day, type, huei = 0, bei = 0, family = 0) => ({ id, date: date(month, day).getTime(), title: id, type, huei, bei, family });
const now = date(9, 17);

test('personal advance is deducted immediately, then offset by full savings', () => {
  const records = [row('deposit', 8, 1, 'savings', 60000), row('advance', 7, 20, 'expend', 5000), row('opening', 7, 1, 'savings', 0, 0, 100000)];
  const july = report(records, date(7), now);
  assert.equal(july.balance, 95000);
  assert.equal(july.advances.huei, 5000);
  assert.equal(july.estimatedBankBalance, 100000);
  const august = report(records, date(8), now);
  assert.equal(august.opening, 95000);
  assert.equal(august.savings, 60000);
  assert.equal(august.balance, 155000);
  assert.equal(august.advances.huei, 0);
  assert.equal(august.estimatedBankBalance, 155000);
});

test('month boundaries are inclusive at start, exclusive at next month', () => {
  const records = [row('september', 9, 1, 'expend', 0, 0, 900), row('august', 8, 1, 'savings', 100), row('july', 7, 31, 'savings', 200)];
  const result = report(records, date(8), now);
  assert.equal(result.opening, 200);
  assert.equal(result.balance, 300);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].record.id, 'august');
});

test('empty months carry balance and outstanding advances forward', () => {
  const records = [row('advance', 7, 15, 'expend', 100, 200), row('opening', 7, 1, 'savings', 0, 0, 1000)];
  const result = report(records, date(8), now);
  assert.equal(result.opening, 700);
  assert.equal(result.balance, 700);
  assert.equal(result.change, 0);
  assert.equal(result.rows.length, 0);
  assert.equal(result.estimatedBankBalance, 1000);
});

test('partial offset is per person; Family payments never create personal debt', () => {
  const records = [row('deposit', 8, 3, 'savings', 2000, 9000), row('mixed', 8, 2, 'expend', 5000, 1000, 3000), row('opening', 8, 1, 'savings', 0, 0, 20000)];
  const result = report(records, date(8), now);
  assert.equal(result.advances.huei, 3000);
  assert.equal(result.advances.bei, 0);
  assert.equal(result.balance, 22000);
  assert.equal(result.estimatedBankBalance, 25000);
  assert.deepEqual(Array.from(result.rows, (item) => item.balance), [20000, 11000, 22000]);
});

test('current month excludes future transactions and keeps input unchanged', () => {
  const records = [row('future', 9, 18, 'expend', 500), row('today', 9, 17, 'savings', 1000)];
  const before = JSON.stringify(records);
  const result = report(records, date(9), now);
  assert.equal(result.balance, 1000);
  assert.equal(result.rows.length, 1);
  assert.equal(JSON.stringify(records), before);
});

test('editing or deleting historical records recalculates subsequent balances', () => {
  const original = row('opening', 7, 1, 'savings', 1000);
  assert.equal(report([original], date(8), now).balance, 1000);
  assert.equal(report([{ ...original, huei: 2000 }], date(8), now).balance, 2000);
  assert.equal(report([], date(8), now).balance, 0);
});
