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
