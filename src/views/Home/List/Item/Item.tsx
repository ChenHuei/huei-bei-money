import { format } from "date-fns";

import { formatCurrency } from "@/utils/currency";

interface ItemProps {
  categoryName: string;
  subCategoryName: string;
  price: number;
  description: string;
  updatedTime: number;
}

function Item(props: ItemProps) {
  const { categoryName, updatedTime, subCategoryName, description, price } =
    props;

  return (
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 flex justify-center items-center bg-primary text-white rounded-lg">
        <p>{categoryName}</p>
      </div>
      <div className="flex-1 mx-3">
        <p>{format(updatedTime, "MM/dd")}</p>
        <p>
          {subCategoryName} {description}
        </p>
      </div>
      <p>{formatCurrency(price)}</p>
    </div>
  );
}

export default Item;
export type { ItemProps };
