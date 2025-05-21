import { format, addDays } from 'date-fns';

export function generateMonthlyDateRanges() {
    const today = new Date();
    const ranges = [];

    for (let i = 0; i < 30; i++) {
        const start = addDays(today, i);
        const end = addDays(start, 2); // 区间是 2 天
        const label = `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
        ranges.push({ label,price:'' });
    }

    return ranges;
}


