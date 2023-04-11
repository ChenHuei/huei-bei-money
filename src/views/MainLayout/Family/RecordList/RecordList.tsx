import { format } from 'date-fns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

import { FamilyCategory } from '@/constants/family';
import { formatCurrency } from '@/utils/currency';

interface FamilyRecord {
  id: string;
  date: number;
  title: string;
  type: FamilyCategory | '';
  huei: number;
  bei: number;
  family: number;
}

interface RecordListProps {
  list: FamilyRecord[];
  onClick: (data: FamilyRecord) => void;
}

function RecordList(props: RecordListProps) {
  const { list, onClick } = props;

  return (
    <div>
      {list.map((item) => {
        const { id, type, title, date, huei, bei } = item;
        return (
          <div
            key={id}
            className="flex items-center mb-4"
            aria-hidden
            onClick={() => onClick(item)}
          >
            <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
              {type === FamilyCategory.savings ? '收' : '支'}
            </div>
            <div className="flex-1 mx-3">
              <div className="flex">
                <p>{format(new Date(date), 'MM/dd')}</p>
                <p className="flex items-center">
                  {huei > 0 || bei > 0 ? (
                    <span className="text-primaryDarker">
                      <AccountCircleIcon className="ml-2 mr-1 text-sm" />
                      {huei > 0 ? 'huei' : 'bei'}
                    </span>
                  ) : (
                    <span className="tw-secondary">
                      <HomeIcon className="ml-2 mr-1 text-sm" />
                      family
                    </span>
                  )}
                </p>
              </div>
              <p>{title}</p>
            </div>
            <p>
              {formatCurrency(
                (item.huei + item.bei + item.family) *
                  (item.type === FamilyCategory.savings ? 1 : -1),
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default RecordList;
export type { FamilyRecord };
