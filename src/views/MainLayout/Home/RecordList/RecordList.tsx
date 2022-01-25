import { User } from 'firebase/auth';
import RecordDetail, { RecordDetailProps } from './RecordDetail';

interface Record extends Omit<RecordDetailProps, 'isSelf' | 'onClick'> {
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
          isSelf={user.displayName === item.createdBy}
          {...item}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
