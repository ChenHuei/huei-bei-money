const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

// Render component props with lightweight hook stubs; no browser or Firebase writes.
function loadComponent(path, props, values = {}) {
  const states = [];
  let cursor = 0;
  const jsx = (type, props) => ({ type, props });
  const context = {
    exports: {},
    require: (name) => {
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'react') return {
        useState: (initial) => {
          const index = cursor++;
          if (!(index in states)) states[index] = initial;
          return [states[index], (value) => { states[index] = value; }];
        },
        useEffect: () => {},
        useMemo: (fn) => fn(),
      };
      if (name === 'react-hook-form') return {
        Controller: 'Controller',
        useForm: () => ({
          getValues: (key) => key ? values[key] : values,
          watch: (key) => values[key],
          handleSubmit: (fn) => fn,
        }),
      };
      if (name === '@mui/material') return new Proxy({}, { get: (_, key) => key });
      if (name === 'mathjs' || name === 'date-fns') return require(name);
      if (name === '@/constants/home') return { USER_LIST: [] };
      if (name === '@/constants/family') return { CATEGORY_LIST: [], FamilyCategory: {} };
      return { default: name };
    },
  };
  vm.runInNewContext(ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, context);
  return () => {
    cursor = 0;
    return context.exports.default(props);
  };
}

function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}

for (const expression of ['0/0', '1/0', '1+', '1.2.3']) {
  test(`calculator blocks ${expression} and allows correction`, () => {
    const confirmed = [];
    const render = loadComponent('src/components/Calculator/Calculator.tsx', {
      price: expression,
      onConfirm: (value) => confirmed.push(value),
    });
    const click = (label) => nodes(render()).find((node) =>
      node.props?.children === label && node.props.onClick
    ).props.onClick();
    click('OK');
    assert.deepEqual(confirmed, []);
    assert.ok(nodes(render()).some((node) => node.props?.role === 'alert'));
    click('C');
    click(2);
    click('OK');
    assert.deepEqual(confirmed, [2]);
  });
}

test('delete uses the persisted date and id despite unsaved edits', () => {
  const original = { id: 'original', date: new Date(2026, 0, 15).getTime() };
  const dirty = { ...original, date: new Date(2026, 1, 15).getTime() };
  let deleted;
  const render = loadComponent('src/views/MainLayout/Home/FormDialog/FormDialog.tsx', {
    isOpen: true, form: original, categoryList: [],
    onDelete: (record) => { deleted = record; },
  }, dirty);
  const alert = nodes(render()).find((node) => node.type === '@/components/AlertDialog');
  assert.match(alert.props.title, /2026\/01\/15/);
  alert.props.onConfirm();
  assert.equal(deleted, original);
});

for (const kind of ['Home', 'Family']) {
  test(`${kind} validates all amount fields`, () => {
    const render = loadComponent(`src/views/MainLayout/${kind}/FormDialog/FormDialog.tsx`, {
      isOpen: false, categoryList: [],
    }, { date: Date.now() });
    const fields = kind === 'Home' ? ['price'] : ['huei', 'bei', 'family'];
    for (const field of fields) {
      const controller = nodes(render()).find((node) => node.props?.name === field);
      const validate = controller.props.rules.validate;
      for (const invalid of [NaN, Infinity, -Infinity]) assert.equal(validate(invalid), false);
      assert.equal(validate(100), true);
      assert.equal(validate(-100), true);
      assert.equal(validate(0), kind === 'Family');
    }
  });
}
