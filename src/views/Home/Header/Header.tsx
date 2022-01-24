/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import { format } from 'date-fns';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { formatCurrency } from '@/utils/currency';

import DateDialog from '@/components/DateDialog';
import Circle from './Circle';

interface HeaderProps {
  current: Date;
  onChange: (e: Date) => void;
}

function Header(props: HeaderProps) {
  const { current, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <DateDialog
          value={current}
          views={['year', 'month']}
          onClose={() => setIsOpen(false)}
          onChange={onChange}
        />
      )}

      <header className="relative flex justify-center items-end px-4 py-2 bg-primaryDarker">
        <div className="absolute left-4 bottom-2 text-white">
          <p>{format(current, 'yyyy')}</p>
          <p className="text-5xl font-bold">{format(current, 'MM')}</p>
        </div>

        <div className="flex flex-1 flex-col justify-center items-center">
          <div
            className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-pink shadow-md"
            aria-hidden
            onClick={() => setIsOpen(true)}
          >
            <Circle bg="primaryDarker">
              <Circle bg="primary">
                <Circle bg="white">
                  <EventNoteIcon className="w-full h-full" />
                </Circle>
              </Circle>
            </Circle>
          </div>

          <p className="mt-2 font-medium text-white">
            本月 <span>{formatCurrency(0)}</span>
          </p>
        </div>
        <div />
      </header>
    </>
  );
}

export default Header;
export type { HeaderProps };
