export const formatCurrency = (price: number, currency: string): string => {
  return `${price.toFixed(2)} ${currency}`;
};
