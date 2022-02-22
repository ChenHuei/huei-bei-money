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
      {list.map((item) => (
        <div
          key={item.id}
          className="flex items-center mb-4"
          aria-hidden
          onClick={() => user.displayName === item.createdBy && onClick(item)}
        >
          <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
            <p>{item.categoryName}</p>
          </div>
          <div className="flex-1 mx-3">
            <div className="flex">
              <p>{format(new Date(item.date), 'MM/dd')}</p>
              {user.displayName !== item.createdBy && (
                <p className="flex items-center text-primaryDarker">
                  <AccountCircleIcon className="ml-2 mr-1 text-sm" />
                  {item.createdBy}
                </p>
              )}
            </div>
            <p>
              {item.subCategoryName} {item.description}
            </p>
          </div>
          <p>{formatCurrency(item.price * (item.categoryId === INCOME_CATEGORY_ID ? 1 : -1))}</p>
        </div>
      ))}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
