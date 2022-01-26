import { format } from 'date-fns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { formatCurrency } from '@/utils/currency';

interface RecordDetailProps {
  isSelf: boolean;
  isIncome: boolean;
  date: number;
  categoryName: string;
  subCategoryName: string;
  price: number;
  description: string;
  createdBy: string;
  onClick: () => void;
}

function RecordDetail(props: RecordDetailProps) {
  const {
    isSelf,
    isIncome,
    date,
    categoryName,
    subCategoryName,
    description,
    price,
    createdBy,
    onClick,
  } = props;

  return (
    <div className="flex items-center mb-4" aria-hidden onClick={() => isSelf && onClick()}>
      <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
        <p>{categoryName}</p>
      </div>
      <div className="flex-1 mx-3">
        <div className="flex">
          <p>{format(new Date(date), 'MM/dd')}</p>
          {!isSelf && (
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
}

export default RecordDetail;
export type { RecordDetailProps };
