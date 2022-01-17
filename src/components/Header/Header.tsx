/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Dialog, Button } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import EventNoteIcon from "@mui/icons-material/EventNote";

import { formatCurrency } from "@/utils/currency";

interface HeaderProps {
  current: Date;
  onChange: (e: Date) => void;
}

function Header(props: HeaderProps) {
  const { current, onChange } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [innerCurrent, setInnerCurrent] = useState<Date | null>(current);

  useEffect(() => {
    setInnerCurrent(current);
  }, [current]);

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-primaryDarker">
      <div>
        <p>{format(current, "yyyy")}</p>
        <p>{format(current, "MM")}</p>
      </div>

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
            value={innerCurrent}
            onChange={setInnerCurrent}
            renderInput={() => <></>}
          />
        </LocalizationProvider>
        <div className="flex justify-end px-6 py-4">
          <Button color="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (innerCurrent !== null) onChange(innerCurrent);
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>

      <div className="flex flex-col justify-center items-center">
        <div
          className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-secondary shadow-md"
          aria-hidden
          onClick={() => setIsOpen(true)}
        >
          <div className="flex justify-center items-center w-full h-full p-2 rounded-full bg-primaryDarker shadow-md">
            <div className="flex justify-center items-center w-full h-full p-2 rounded-full bg-primary shadow-md">
              <div className="flex justify-center items-center w-full h-full p-2 rounded-full bg-white shadow-md">
                <EventNoteIcon className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 font-medium text-white">
          本月 <span>{formatCurrency(0)}</span>
        </p>
      </div>
      <div />
    </header>
  );
}

export default Header;
export type { HeaderProps };
