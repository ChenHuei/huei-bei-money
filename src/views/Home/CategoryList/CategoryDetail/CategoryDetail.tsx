interface CategoryDetailProps {
  id: string;
  name: string;
}
function CategoryDetail(props: CategoryDetailProps) {
  const { id, name } = props;

  return <div key={id}>CategoryDetail: {name}</div>;
}

export default CategoryDetail;
export type { CategoryDetailProps };
