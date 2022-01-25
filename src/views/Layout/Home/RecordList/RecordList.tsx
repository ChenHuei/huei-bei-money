import RecordDetail, { RecordDetailProps } from './RecordDetail';

interface Record extends RecordDetailProps {
  id: string;
  categoryId: string;
  subCategoryId: string;
  createdBy?: string;
}

interface RecordListProps {
  list: Record[];
}

function RecordList(props: RecordListProps) {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <RecordDetail key={item.id} {...item} />
      ))}
    </div>
  );
}

export default RecordList;
export type { Record, RecordListProps };
