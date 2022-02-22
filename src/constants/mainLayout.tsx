import { ReactNode } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

export interface Tab {
  to: string;
  label: string;
  icon: ReactNode;
}

export const TABS_LIST: Tab[] = [
  {
    to: '/home',
    label: '首頁',
    icon: <HomeIcon />,
  },
  {
    to: '/home/family',
    label: '家庭基金',
    icon: <FamilyRestroomIcon />,
  },
  {
    to: '/home/user',
    label: '帳戶',
    icon: <PersonIcon />,
  },
];
