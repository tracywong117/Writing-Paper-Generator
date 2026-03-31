export const holidays = {
  2026: {
    '1-1': "New Year's Day",
    '2-17': "Lunar New Year's Day",
    '2-18': "2nd Day of LNY",
    '2-19': "3rd Day of LNY",
    '4-3': 'Good Friday',
    '4-4': 'Day after Good Friday',
    '4-6': 'Day after Ching Ming',
    '4-7': 'Day after Easter Monday',
    '5-1': 'Labour Day',
    '5-25': "Day after Buddha's Birthday",
    '6-19': 'Tuen Ng Festival',
    '7-1': 'HKSAR Day',
    '9-26': 'Day after Mid-Autumn',
    '10-1': 'National Day',
    '10-19': 'Day after Chung Yeung',
    '12-25': 'Christmas Day',
    '12-26': 'Day after Christmas'
  }
}

/**
 * Look up a holiday by year, month (1-indexed), day.
 * Returns the holiday name string, or null.
 */
export function getHoliday(year, month, day) {
  const yearData = holidays[year]
  if (!yearData) return null
  return yearData[`${month}-${day}`] || null
}
