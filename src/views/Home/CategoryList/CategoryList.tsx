import CategoryDetail, { CategoryDetailProps } from "./CategoryDetail";

interface Category {
  id: string;
  name: string;
  sort: number;
  subCategory: CategoryDetailProps[];
}

interface CategoryListProps {
  list: Category[];
}

function CategoryList(props: CategoryListProps) {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      {list[0].subCategory.map((item) => (
        <CategoryDetail key={item.id} {...item} />
      ))}
    </div>
  );
}

export default CategoryList;
export type { Category, CategoryListProps };
