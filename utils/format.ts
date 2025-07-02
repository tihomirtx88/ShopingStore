export const formatCurrency = (amount: number | null) => {
    const value = amount || 0
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value);
};

export const formatDate = (date: string | number | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};