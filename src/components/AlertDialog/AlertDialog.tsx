import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

function AlertDialog(props: AlertDialogProps) {
  const { isOpen, title, onConfirm, onClose } = props;
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          autoFocus
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
export type { AlertDialogProps };
