const bdtFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number) {
  return `৳ ${bdtFormatter.format(amount)}`;
}

