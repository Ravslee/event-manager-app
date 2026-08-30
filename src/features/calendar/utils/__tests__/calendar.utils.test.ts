import { describe, it, expect } from 'vitest';
import {
  generateMonth,
  nextMonth,
  previousMonth,
  getMonthTitle,
} from '../calendar.utils';

describe('calendar.utils', () => {
  it('generateMonth generates exactly 42 calendar grid cells', () => {
    const testDate = new Date(2026, 8, 1); // September 2026
    const result = generateMonth(testDate, []);

    expect(result).toHaveLength(42);
    expect(result[0]).toHaveProperty('isCurrentMonth');
    expect(result[0]).toHaveProperty('isToday');
    expect(result[0]).toHaveProperty('events');
  });

  it('nextMonth increments month by 1', () => {
    const testDate = new Date(2026, 0, 15); // Jan 15 2026
    const next = nextMonth(testDate);

    expect(next.getMonth()).toBe(1); // Feb
    expect(next.getFullYear()).toBe(2026);
  });

  it('previousMonth decrements month by 1', () => {
    const testDate = new Date(2026, 5, 1); // June 1 2026
    const prev = previousMonth(testDate);

    expect(prev.getMonth()).toBe(4); // May
  });

  it('getMonthTitle formats date as "MMMM yyyy"', () => {
    const testDate = new Date(2026, 9, 1); // October 2026
    expect(getMonthTitle(testDate)).toBe('October 2026');
  });
});
