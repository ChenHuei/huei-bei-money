/* eslint-disable react/jsx-props-no-spreading */
import Item, { ItemProps } from "./Item";

interface HistoryItem extends ItemProps {
  id: string;
  categoryId: string;
  subCategoryId: string;
}

interface ListProps {
  list: HistoryItem[];
}

function List(props: ListProps) {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
}

export default List;
export type { ListProps, HistoryItem };
