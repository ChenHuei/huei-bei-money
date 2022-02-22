import { User } from 'firebase/auth';
import { format } from 'date-fns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { INCOME_CATEGORY_ID } from '@/constants/home';
import { formatCurrency } from '@/utils/currency';

interface Record {
  id: string;
  categoryId: string;
  subCategoryId: string;
  date: number;
  categoryName: string;
  subCategoryName: string;
  price: number;
  description: string;
  createdBy: string;
}

interface RecordListProps {
  user: User;
  list: Record[];
  onClick: (data: Record) => void;
}

function RecordList(props: RecordListProps) {
  const { user, list, onClick } = props;

  return (
    <div>
      {list.map((item) => {
        const {
          id,
          categoryName,
          date,
          createdBy,
          subCategoryName,
          description,
          price,
          categoryId,
        } = item;
        const isSelf = user.displayName === item.createdBy;
        const isIncome = categoryId === INCOME_CATEGORY_ID;

        return (
          <div
            key={id}
            className="flex items-center mb-4"
            aria-hidden
            onClick={() => isSelf && onClick(item)}
          >
            <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
              <p>{categoryName}</p>
            </div>
            <div className="flex-1 mx-3">
              <div className="flex">
                <p>{format(new Date(date), 'MM/dd')}</p>
                {isSelf === false && (
                  <p className="flex items-center text-primaryDarker">
                    <AccountCircleIcon className="ml-2 mr-1 text-sm" />
                    {createdBy}
                  </p>
                )}
              </div>
              <p>
                {subCategoryName} {description}
              </p>
            </div>
            <p>{formatCurrency(price * (isIncome ? 1 : -1))}</p>
          </div>
        );
      })}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
