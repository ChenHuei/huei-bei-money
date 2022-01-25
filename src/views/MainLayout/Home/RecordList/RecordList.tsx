import RecordDetail, { RecordDetailProps } from './RecordDetail';

interface Record extends Omit<RecordDetailProps, 'onClick'> {
  id: string;
  categoryId: string;
  subCategoryId: string;
  createdBy?: string;
}

interface RecordListProps {
  list: Record[];
  onClick: (data: Record) => void;
}

function RecordList(props: RecordListProps) {
  const { list, onClick } = props;

  return (
    <div>
      {list.map((item) => (
        <RecordDetail key={item.id} {...item} onClick={() => onClick(item)} />
      ))}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
