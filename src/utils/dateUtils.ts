export function getQuarterStartDate(): Date {
  const now = new Date();
  const currentQuarter = Math.floor(now.getMonth() / 3);
  return new Date(now.getFullYear(), currentQuarter * 3, 1);
}

export function getWeekStartDate(weekNumber: number, weekStartDay: number = 1): Date {
  const quarterStart = getQuarterStartDate();
  
  // Adjust first day to match the desired week start day
  let daysToAdd = weekStartDay - quarterStart.getDay();
  if (daysToAdd <= 0) daysToAdd += 7;
  
  const firstWeekStart = new Date(quarterStart);
  firstWeekStart.setDate(firstWeekStart.getDate() + daysToAdd);
  
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
  
  return weekStart;
}

export function formatWeekDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
  });
}

export function getCurrentQuarterWeek(weekStartDay: number = 1): number {
  const now = new Date();
  const quarterStart = getQuarterStartDate();
  const firstWeek = getWeekStartDate(1, weekStartDay);
  const diff = now.getTime() - firstWeek.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.ceil(diff / oneWeek);
  return Math.min(Math.max(1, weekNumber), 12);
}

export function getWeekDateRange(weekNumber: number, weekStartDay: number = 1): string {
  const weekStart = getWeekStartDate(weekNumber, weekStartDay);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return `${formatWeekDate(weekStart)} - ${formatWeekDate(weekEnd)}`;
}

export function getQuarterWeeks(weekStartDay: number = 1): Array<{
  number: number;
  dateRange: string;
}> {
  const currentWeek = getCurrentQuarterWeek(weekStartDay);
  return Array.from({ length: 12 }, (_, i) => i + 1)
    .filter(week => week <= currentWeek)
    .map(week => ({
      number: week,
      dateRange: getWeekDateRange(week, weekStartDay)
    }));
}