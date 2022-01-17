import { format } from "date-fns";
import EventNoteIcon from "@mui/icons-material/EventNote";

import { formatCurrency } from "@/utils/currency";

interface HeaderProps {
  current: Date;
}

function Header(props: HeaderProps) {
  const { current } = props;

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-primaryDarkest">
      <div>
        <p>{format(current, "yyyy")}</p>
        <p>{format(current, "MM")}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center w-20 h-20 p-2 rounded-full bg-secondary shadow-md">
          <div className="flex justify-center items-center w-full h-full p-2 rounded-full bg-primaryDarkest shadow-md">
            <div className="flex justify-center items-center w-full h-full p-2 rounded-full bg-primaryDarker shadow-md">
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
