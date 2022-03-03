import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addMonths, differenceInMonths, format } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { ChartForm, DEFAULT_FORM } from '@/constants/chart';
import { getHomeRecordApi } from '@/api/home';
import { Record } from '@/views/MainLayout/Home/RecordList';
import { differentInMonthOrYear } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

import { CATEGORY_COLOR } from '@/constants/color';
import { MainLayoutOutletProps } from '../MainLayout';
import FormDialog from './FormDialog';
import Circle from '../Home/Header/Circle';

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart() {
  const { firebase, user } = useOutletContext<MainLayoutOutletProps>();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ChartForm>(DEFAULT_FORM);
  const [list, setList] = useState<Record[]>([]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onConfirm = useCallback(
    (data: ChartForm): void => {
      setForm(data);
      onClose();
    },
    [onClose],
  );

  const init = useCallback(
    async (data: ChartForm) => {
      const [startDate, endDate] = data.date;
      const recordList = differentInMonthOrYear(startDate, endDate)
        ? await Promise.all(
            [...Array(Math.abs(differenceInMonths(startDate, endDate))).keys()].map((element) =>
              getHomeRecordApi(firebase, addMonths(startDate, element)),
            ),
          )
        : await getHomeRecordApi(firebase, startDate);

      setList(recordList.flat().filter((item) => item.createdBy === user.displayName));
    },
    [firebase, user],
  );

  const data = useMemo(
    () =>
      list.reduce(
        (acc, item) => {
          const { categoryName, price } = item;
          const { labels, datasets } = acc;

          if (labels?.includes(categoryName)) {
            const index = labels.findIndex((element: string) => element === categoryName);
            datasets[0].data[index] += price;
          } else {
            labels?.push(categoryName);
            datasets[0].data.push(price);
            (datasets[0].backgroundColor as string[]).push(CATEGORY_COLOR[categoryName]);
          }
          return acc;
        },
        {
          labels: [],
          datasets: [
            {
              label: 'Cost Chart',
              data: [],
              backgroundColor: [],
              hoverOffset: 4,
            },
          ],
        } as ChartData<'doughnut', number[], string>,
      ),
    [list],
  );

  useEffect(() => {
    init(form);
  }, [form, init]);

  return (
    <div>
      <header className="flex justify-center items-end p-4 pt-6 bg-primaryDarker">
        <div className="flex flex-1 flex-col justify-center items-center">
          <div
            className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-pink shadow-md"
            aria-hidden
            onClick={() => setIsOpen(true)}
          >
            <Circle bg="primaryDarker">
              <Circle bg="primary">
                <Circle bg="white">
                  <EventNoteIcon className="w-full h-full text-primaryDarker" />
                </Circle>
              </Circle>
            </Circle>
          </div>

          <p className="mt-2 font-medium text-white tracking-wider">
            <span>{format(form.date[0], 'yyyy/MM/dd')}</span>
            <span className="px-2">-</span>
            <span>{format(form.date[1], 'yyyy/MM/dd')}</span>
          </p>
        </div>
      </header>
      <div className="p-4 pt-8">
        {list.length === 0 ? (
          <div className="flex flex-1 justify-center items-center text-3xl text-white">empty</div>
        ) : (
          <Doughnut
            data={data}
            plugins={[ChartDataLabels]}
            options={{
              plugins: {
                datalabels: {
                  color: 'white',
                  formatter(value) {
                    return formatCurrency(value);
                  },
                },
              },
            }}
          />
        )}
      </div>
      <FormDialog isOpen={isOpen} form={form} onClose={onClose} onConfirm={onConfirm} />
    </div>
  );
}

export default Chart;
