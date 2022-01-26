import { User } from 'firebase/auth';
import { INCOME_CATEGORY_ID } from '@/constants/home';
import RecordDetail, { RecordDetailProps } from './RecordDetail';

interface Record extends Omit<RecordDetailProps, 'isSelf' | 'isIncome' | 'onClick'> {
  id: string;
  categoryId: string;
  subCategoryId: string;
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
        <RecordDetail
          key={item.id}
          {...item}
          isSelf={user.displayName === item.createdBy}
          isIncome={item.categoryId === INCOME_CATEGORY_ID}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
