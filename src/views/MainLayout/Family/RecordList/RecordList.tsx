import { format } from 'date-fns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
        const userList: { label: string; value: number }[] = [
          { label: 'huei', value: huei },
          { label: 'bei', value: bei },
        ];
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
                {type === FamilyCategory.expend && userList.some((element) => element.value > 0) && (
                  <p className="flex items-center text-primaryDarker">
                    <AccountCircleIcon className="ml-2 mr-1 text-sm" />
                    {userList.reduce(
                      (acc, element) =>
                        element.value > 0
                          ? `${acc}${acc.length > 0 ? '/' : ''}${element.label}`
                          : acc,
                      '',
                    )}
                  </p>
                )}
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
