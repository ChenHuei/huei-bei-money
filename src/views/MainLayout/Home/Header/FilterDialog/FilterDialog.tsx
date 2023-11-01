import { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { USER_LIST } from '@/constants/home';
import Transition from '@/components/Transition';

interface FilterDialogProps {
  open: boolean;
  value: string[];
  onChange: (e: string[]) => void;
  onClose: () => void;
}

function FilterDialog(props: FilterDialogProps) {
  const { open, value, onChange, onClose } = props;
  const [innerValue, setInnerValue] = useState<string[]>(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    if (open) setInnerValue(value);
  }, [open, value]);

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar className="py-1" position="sticky" color="secondary">
        <Toolbar>
          <CloseIcon className="mr-2" aria-hidden onClick={onClose} />
          <p className="text-xl">篩選</p>
        </Toolbar>
      </AppBar>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <FormControl fullWidth margin="normal">
            <InputLabel id="user">使用者</InputLabel>
            <Select
              labelId="user"
              id="user"
              label="使用者"
              value={innerValue}
              multiple
              renderValue={(selected) => selected.join(', ')}
              onChange={(e) => {
                const val = e.target.value;
                setInnerValue(typeof val === 'string' ? val.split(',') : val);
              }}>
              {USER_LIST.map((item) => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={innerValue.includes(item)} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sticky bottom-4 left-0 h-12">
          <Button
            className="h-full"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              onChange(innerValue);
              onClose();
            }}>
            確認
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default FilterDialog;
export type { FilterDialogProps };
