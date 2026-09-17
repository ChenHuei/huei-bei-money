const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { format } = require('date-fns');

const january = new Date(2026, 0, 15).getTime();
const february = new Date(2026, 1, 15).getTime();
const original = { id: 'record-1', date: january, price: 100 };
const edited = { ...original, date: february, price: 200 };

function setup(commit) {
  const writes = [];
  const updates = [];
  const firestore = {
    collection: (_, ...segments) => segments.join('/'),
    doc: (_, ...segments) => segments.join('/'),
    getDocs: async (path) => ({
      docs: path.includes('202601')
        ? [{ id: original.id, data: () => ({ ...original }) }]
        : [],
    }),
    updateDoc: async (...args) => updates.push(args),
    writeBatch: () => ({
      delete: (path) => writes.push({ type: 'delete', path }),
      set: (path, data) => writes.push({ type: 'set', path, data }),
      commit,
    }),
  };
  const source = ts.transpileModule(
    readFileSync('src/api/home.ts', 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } }
  ).outputText;
  const context = {
    exports: {},
    require: (name) => {
      if (name === 'date-fns') return { format };
      if (name === 'firebase/firestore/lite') return firestore;
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(source, context);
  return { api: context.exports, writes, updates };
}

const normalize = (value) => JSON.parse(JSON.stringify(value));

test('cross-month edit commits both writes before updating either cache', async () => {
  let finish;
  let commits = 0;
  const { api, writes } = setup(() => {
    commits += 1;
    return new Promise((resolve) => { finish = resolve; });
  });
  await api.getHomeRecordApi({}, january);
  await api.getHomeRecordApi({}, february);
  const pending = api.updateHomeRecordApi({}, edited, january);
  assert.equal(commits, 1);
  assert.deepEqual(normalize(writes), [
    { type: 'delete', path: 'history/202601/record/record-1' },
    { type: 'set', path: 'history/202602/record/record-1', data: { date: february, price: 200 } },
  ]);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, january)), [original]);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, february)), []);
  finish();
  await pending;
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, january)), []);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, february)), [edited]);
});

test('failed batch preserves both caches and propagates the error', async () => {
  const failure = new Error('commit failed');
  const { api } = setup(async () => { throw failure; });
  await api.getHomeRecordApi({}, january);
  await api.getHomeRecordApi({}, february);
  await assert.rejects(api.updateHomeRecordApi({}, edited, january), failure);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, january)), [original]);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, february)), []);
});

test('same-month edit updates the existing document without a batch', async () => {
  const { api, updates } = setup(() => { throw new Error('Unexpected batch'); });
  await api.getHomeRecordApi({}, january);
  const data = { ...original, price: 300 };
  await api.updateHomeRecordApi({}, data, january);
  assert.deepEqual(normalize(updates), [
    ['history/202601/record/record-1', { date: january, price: 300 }],
  ]);
  assert.deepEqual(normalize(await api.getHomeRecordApi({}, january)), [data]);
});
