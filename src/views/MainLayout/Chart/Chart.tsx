import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import { getFamilyRecordApi } from '@/api/family';
import { FamilyCategory } from '@/constants/family';
import { formatCurrency } from '@/utils/currency';
import { getFamilyMonthReport } from '@/utils/familyReport';
import { FamilyRecord } from '../Family/RecordList';
import { MainLayoutOutletProps } from '../MainLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

function Chart() {
  const { firebase } = useOutletContext<MainLayoutOutletProps>();
  const [now, setNow] = useState(() => new Date());
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [records, setRecords] = useState<FamilyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const chartRef = useRef<ChartJS<'line'>>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getFamilyRecordApi(firebase)
      .then((data) => {
        if (active) {
          setRecords(data);
          setNow(new Date());
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [firebase, reload]);

  const report = useMemo(
    () => getFamilyMonthReport(records, month, now),
    [records, month, now]
  );
  const current = isSameMonth(month, now);
  const months = useMemo(() => {
    const end = month > startOfMonth(now) ? startOfMonth(now) : month;
    return Array.from({ length: 12 }, (_, index) => addMonths(end, index - 11));
  }, [month, now]);
  const trend = useMemo(
    () =>
      months.map((date) => getFamilyMonthReport(records, date, now).balance),
    [records, months, now]
  );
  const rows = useMemo(() => {
    const result = report.rows.filter(
      ({ record }) => filter === 'all' || record.type === filter
    );
    return sort === 'amount'
      ? result.sort(
          (a, b) =>
            b.record.huei +
            b.record.bei +
            b.record.family -
            a.record.huei -
            a.record.bei -
            a.record.family
        )
      : result;
  }, [report, filter, sort]);
  const cutoff = current
    ? `截至 ${format(now, 'yyyy/MM/dd')}`
    : `${format(month, 'yyyy/MM')} 月底`;

  return (
    <div className="w-full max-w-3xl mx-auto pb-8">
      <header className="bg-primaryDarker text-white p-4">
        <h1 className="text-xl text-center mb-4">家庭月報</h1>
        <div className="flex items-center justify-center gap-2">
          <IconButton
            aria-label="上一個月"
            color="inherit"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <ChevronLeftIcon />
          </IconButton>
          <span className="text-lg tabular-nums" aria-live="polite">
            {format(month, 'yyyy/MM')}
          </span>
          <IconButton
            aria-label="下一個月"
            color="inherit"
            disabled={current}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      </header>
      {loading && (
        <div className="p-8 text-center" role="status">
          <CircularProgress />
          <p>載入家庭紀錄中</p>
        </div>
      )}
      {!loading && error && (
        <Alert
          severity="error"
          action={<Button onClick={() => setReload(reload + 1)}>重試</Button>}
        >
          無法載入家庭月報，請再試一次。
        </Alert>
      )}
      {!loading && !error && (
        <div className="p-4 space-y-4">
          <section className="bg-white rounded-xl p-5 text-center shadow-sm">
            <h2>{current ? '目前' : '月底'}家庭基金淨額</h2>
            <p className="text-3xl font-bold text-primaryDarker my-2">
              {formatCurrency(report.balance)}
            </p>
            <p className="text-sm text-gray-600">{cutoff}</p>
            <p
              className={`mt-2 ${report.change > 0 ? 'text-green-700' : ''} ${
                report.change < 0 ? 'text-red-600' : ''
              }`}
            >
              比上月底{report.change < 0 ? '減少' : '增加'}{' '}
              {formatCurrency(Math.abs(report.change))}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-5 text-sm">
              {(
                [
                  ['月初結餘', report.opening],
                  ['本月儲蓄', report.savings],
                  ['本月支出', report.expenses],
                ] as const
              ).map(([label, amount]) => (
                <div key={label}>
                  <p className="text-gray-600">{label}</p>
                  <p className="font-bold mt-1 break-words">
                    {formatCurrency(amount)}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">每月基金淨額</h2>
              <span className="text-sm text-gray-600">單位：萬元</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              選定月份及前 11 個月；點選折線上的月份查看明細。當月為目前淨額。
            </p>
            <div style={{ height: 220 }}>
              <Line
                ref={chartRef}
                data={{
                  labels: months.map(
                    (date) =>
                      `${format(date, 'yy/MM')}${
                        isSameMonth(date, now) ? '（目前）' : ''
                      }`
                  ),
                  datasets: [
                    {
                      label: '基金淨額',
                      data: trend,
                      borderColor: '#406882',
                      backgroundColor: '#406882',
                      pointRadius: 5,
                      pointHitRadius: 16,
                      tension: 0.15,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => formatCurrency(context.parsed.y),
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => Number(value) / 10000,
                      },
                    },
                  },
                }}
                onClick={(event) => {
                  if (!chartRef.current) return;
                  const [point] = getElementsAtEvent(chartRef.current, event);
                  if (point) setMonth(months[point.index]);
                }}
              />
            </div>
          </section>
          <section className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold mb-3">
              {format(month, 'yyyy/MM')} 收支明細
            </h2>
            <div className="flex flex-wrap gap-3 justify-between mb-4">
              <ToggleButtonGroup
                size="small"
                exclusive
                value={filter}
                aria-label="收支篩選"
                onChange={(_, value) => {
                  if (value) setFilter(value);
                }}
              >
                <ToggleButton value="all">全部</ToggleButton>
                <ToggleButton value={FamilyCategory.savings}>儲蓄</ToggleButton>
                <ToggleButton value={FamilyCategory.expend}>支出</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                select
                size="small"
                label="排序"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <MenuItem value="date">日期由早到晚</MenuItem>
                <MenuItem value="amount">金額由大到小</MenuItem>
              </TextField>
            </div>
            {rows.length === 0 && (
              <p className="py-6 text-center text-gray-600">
                {report.rows.length === 0
                  ? '本月尚無收支紀錄，結餘承接上月。'
                  : '沒有符合篩選的紀錄。'}
              </p>
            )}
            {rows.map(({ record, amount, balance }) => (
              <details key={record.id} className="border-t py-3">
                <summary className="cursor-pointer">
                  <span className="text-sm text-gray-600 mr-2">
                    {format(record.date, 'MM/dd')}
                  </span>
                  <span>{record.title}</span>
                  <span className="float-right font-bold">
                    {amount > 0 ? '+' : ''}
                    {formatCurrency(amount)}
                  </span>
                  <div className="flex flex-wrap justify-between gap-2 text-sm mt-1 text-gray-600">
                    <span>
                      {record.type === FamilyCategory.savings
                        ? '儲蓄'
                        : [
                            record.huei !== 0 && 'Huei 代墊',
                            record.bei !== 0 && 'Bei 代墊',
                            record.family !== 0 && '基金付款',
                          ]
                            .filter(Boolean)
                            .join('／')}
                    </span>
                    <span>交易後淨額 {formatCurrency(balance)}</span>
                  </div>
                </summary>
                <div className="text-sm mt-3 space-y-1 bg-gray-50 p-3 rounded">
                  <p>Huei：{formatCurrency(record.huei)}</p>
                  <p>Bei：{formatCurrency(record.bei)}</p>
                  <p>Family：{formatCurrency(record.family)}</p>
                </div>
              </details>
            ))}
            <p className="text-xs text-gray-600 mt-4">
              點選紀錄展開金額拆分；新增與編輯請前往家庭基金。交易後淨額依交易時間計算，不受篩選或排序影響。
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default Chart;
