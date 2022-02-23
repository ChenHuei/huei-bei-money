import { ReactNode } from 'react';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

export enum FamilyCategory {
  savings = 'savings',
  expend = 'expend',
}

export interface Category {
  label: string;
  value: FamilyCategory;
}

export const CATEGORY_LIST: Category[] = [
  {
    label: '儲蓄',
    value: FamilyCategory.savings,
  },
  {
    label: '支出',
    value: FamilyCategory.expend,
  },
];

export interface FamilyUser {
  label: string;
  value: 'huei' | 'bei';
  image: ReactNode;
}

export const USER_LIST: FamilyUser[] = [
  {
    label: 'Huei',
    value: 'huei',
    image: <ManIcon />,
  },
  {
    label: 'Bei',
    value: 'bei',
    image: <WomanIcon />,
  },
];
