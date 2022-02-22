import { FamilyCategory } from '@/constants/family';
import { formatCurrency } from '@/utils/currency';

interface FamilyRecord {
  id: string;
  title: string;
  type: FamilyCategory | '';
  huei: number;
  bei: number;
}

interface RecordListProps {
  list: FamilyRecord[];
  onClick: (data: FamilyRecord) => void;
}

function RecordList(props: RecordListProps) {
  const { list, onClick } = props;

  return (
    <div>
      {list.map((item) => (
        <div
          key={item.id}
          className="flex items-center mb-4"
          aria-hidden
          onClick={() => onClick(item)}
        >
          <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
            {item.type === FamilyCategory.savings ? '收' : '支'}
          </div>
          <div className="flex-1 mx-3">{item.title}</div>
          <p>
            {formatCurrency(
              (item.huei + item.bei) * (item.type === FamilyCategory.savings ? 1 : -1),
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecordList;
export type { FamilyRecord };
