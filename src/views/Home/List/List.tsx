import { formatCurrency } from "@/utils/currency";

interface HistoryItem {
  id: string;
  createdBy: string;
  price: number;
}

interface ListProps {
  list: HistoryItem[];
}

function List(props: ListProps) {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>
          <p>{formatCurrency(item.price)}</p>
          <p>{item.createdBy}</p>
        </div>
      ))}
    </div>
  );
}

export default List;
export type { ListProps, HistoryItem };
