// eslint-disable-next-line import/prefer-default-export
export const formatCurrency = (number: number): string =>
  new Intl.NumberFormat('en-UK', { style: 'currency', currency: 'TWD' }).format(number);
