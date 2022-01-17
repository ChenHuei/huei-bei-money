/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Dialog, Button } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import EventNoteIcon from "@mui/icons-material/EventNote";

import { formatCurrency } from "@/utils/currency";
import Circle from "./Circle";

interface HeaderProps {
  current: Date;
  onChange: (e: Date) => void;
}

function Header(props: HeaderProps) {
  const { current, onChange } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(current);

  useEffect(() => {
    setDate(current);
  }, [current]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="mobile"
            views={["year", "month"]}
            openTo="month"
            minDate={new Date(2021, 1, 1)}
            value={date}
            onChange={setDate}
            renderInput={() => <></>}
          />
        </LocalizationProvider>
        <div className="flex justify-end px-6 py-4">
          <Button color="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (date !== null) onChange(date);
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>

      <header className="relative flex justify-center items-end px-4 py-2 bg-primaryDarker">
        <div className="absolute left-4 bottom-2 text-white">
          <p>{format(current, "yyyy")}</p>
          <p className="text-5xl font-bold">{format(current, "MM")}</p>
        </div>

        <div className="flex flex-1 flex-col justify-center items-center">
          <div
            className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-secondary shadow-md"
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
