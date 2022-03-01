import { PropsWithChildren } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface AlertDialogProps {
  isOpen: boolean;
  isDisplayCancel?: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

function AlertDialog(props: PropsWithChildren<AlertDialogProps>) {
  const { isOpen, isDisplayCancel = true, title, children, onConfirm, onClose } = props;
  return (
    <Dialog open={isOpen} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {isDisplayCancel && <Button onClick={onClose}>取消</Button>}
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
