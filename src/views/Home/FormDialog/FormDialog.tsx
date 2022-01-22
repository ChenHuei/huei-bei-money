import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Transition from "@/components/Transition";
import CategoryList, { Category } from "./CategoryList";

interface FormDialogProps {
  isOpen: boolean;
  categoryList: Category[];
  onClose: () => void;
}

function FormDialog(props: FormDialogProps) {
  const { isOpen, categoryList, onClose } = props;

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <div className="flex p-4 text-white bg-primaryDarker">
        <div className="mr-2" aria-hidden onClick={onClose}>
          <CloseIcon />
        </div>
        <p>Create Record</p>
      </div>
      <div className="flex">
        <CategoryList list={categoryList} />
      </div>
    </Dialog>
  );
}

export default FormDialog;
export type { FormDialogProps };
