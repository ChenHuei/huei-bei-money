/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import { format } from 'date-fns';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FilterListIcon from '@mui/icons-material/FilterList';

import { formatCurrency } from '@/utils/currency';

import DateDialog from '@/components/DateDialog';
import Circle from './Circle';
import FilterDialog from './FilterDialog';

interface HeaderProps {
  current: Date;
  total: number;
  filter: string[];
  onChange: (e: Date) => void;
  setFilter: (e: string[]) => void;
}

function Header(props: HeaderProps) {
  const { current, total, filter, onChange, setFilter } = props;
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  return (
    <>
      {isOpenDate && (
        <DateDialog
          value={current}
          views={['year', 'month']}
          onClose={() => setIsOpenDate(false)}
          onChange={onChange}
        />
      )}

      <FilterDialog
        open={isOpenFilter}
        value={filter}
        onChange={setFilter}
        onClose={() => setIsOpenFilter(false)}
      />

      <header className="relative flex justify-center items-end p-4 pt-6 bg-primaryDarker">
        <div className="text-white">
          <p>{format(current, 'yyyy')}</p>
          <p className="text-5xl font-bold">{format(current, 'MM')}</p>
        </div>

        <div className="flex flex-1 flex-col justify-center items-center">
          <div
            className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-pink shadow-md"
            aria-hidden
            onClick={() => setIsOpenDate(true)}
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
            <span>{formatCurrency(total)}</span>
            <span> / </span>
            <span>{filter.join(', ')}</span>
          </p>
        </div>
        <div className="text-white" aria-hidden onClick={() => setIsOpenFilter(true)}>
          <FilterListIcon />
        </div>
      </header>
    </>
  );
}

export default Header;
export type { HeaderProps };
