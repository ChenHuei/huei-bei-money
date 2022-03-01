import { useCallback, useMemo, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import InfoIcon from '@mui/icons-material/Info';

import { FamilyCategory, USER_LIST } from '@/constants/family';
import { formatCurrency } from '@/utils/currency';
import AlertDialog from '@/components/AlertDialog';

import { FamilyRecord } from '../RecordList';

interface HeaderProps {
  list: FamilyRecord[];
}

function Header(props: HeaderProps) {
  const { list } = props;
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const total = useMemo(
    () =>
      list.reduce(
        (acc, item) =>
          acc +
          (item.huei + item.bei + item.family) * (item.type === FamilyCategory.savings ? 1 : -1),
        0,
      ),
    [list],
  );

  const getUserAmount = useCallback(
    (user: 'huei' | 'bei') =>
      list
        .filter((item) => item[user] !== 0)
        .reverse()
        .reduce((acc, item) => {
          const amount = item[user] * (item.type === FamilyCategory.savings ? 1 : -1);
          return acc + amount > 0 ? 0 : acc + amount;
        }, 0),
    [list],
  );

  return (
    <>
      <AlertDialog
        isOpen={openDetailDialog}
        isDisplayCancel={false}
        title="預先支出明細"
        onClose={() => setOpenDetailDialog(false)}
        onConfirm={() => setOpenDetailDialog(false)}
      >
        <List>
          {USER_LIST.map((user) => (
            <ListItem key={user.value} disablePadding>
              <ListItemButton>
                <ListItemIcon>{user.image}</ListItemIcon>
                <ListItemText
                  primary={`${user.label}: ${formatCurrency(
                    Math.min(getUserAmount(user.value), 0),
                  )}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </AlertDialog>
      <header className="flex justify-center items-end p-8 bg-primaryDarker">
        <div className="flex items-center text-white">
          <SavingsIcon className="scale-150" />
          <span className="mx-4">{formatCurrency(total)}</span>
          <InfoIcon className="scale-75" onClick={() => setOpenDetailDialog(true)} />
        </div>
      </header>
    </>
  );
}

export default Header;
export type { HeaderProps };
