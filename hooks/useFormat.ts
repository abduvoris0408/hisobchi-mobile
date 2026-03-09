export function useFormat() {
  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(Math.abs(amount)) + " so'm";
  };

  const formatDate = (date: string): string => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Bugun';
    if (days === 1) return 'Kecha';
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
  };

  const formatPercent = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return { formatMoney, formatDate, formatPercent };
}
