import { useState } from "react";
import {
  Dialog,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";

import Transition from "@/components/Transition";
import { Record } from "../../RecordList";

interface CategoryDetail {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  sort: number;
  subCategory: CategoryDetail[];
}

interface CategoryListProps {
  list: Category[];
}

function CategoryList(props: CategoryListProps) {
  const { list } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Omit<Record, "id" | "updatedTime">>({
    categoryId: "",
    subCategoryId: "",
    categoryName: "",
    subCategoryName: "",
    price: 0,
    description: "",
  });

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        TransitionComponent={Transition}
      >
        Calculator
      </Dialog>
      <form className="w-full p-4">
        <TextField
          fullWidth
          select
          required
          id="categoryId"
          label="主類別"
          margin="normal"
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value, subCategoryId: "" })
          }
        >
          {list.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          required
          id="subCategoryId"
          label="子類別"
          margin="normal"
          disabled={form.categoryId === ""}
          value={form.subCategoryId}
          onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
        >
          {list[0].subCategory.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <FormControl fullWidth margin="normal" onClick={() => setIsOpen(true)}>
          <InputLabel htmlFor="amount">金額</InputLabel>
          <OutlinedInput
            id="amount"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseInt(e.target.value, 10) })
            }
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="amount"
          />
        </FormControl>
        <TextField
          fullWidth
          id="description"
          label="描述"
          margin="normal"
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </form>
    </>
  );
}

export default CategoryList;
export type { Category, CategoryListProps };
