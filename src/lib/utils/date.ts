const dateFormats = {
  short: { year: "numeric", month: "short", day: "numeric" },
  long: { year: "numeric", month: "long", day: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type CalendarDateStyle = keyof typeof dateFormats;

export function formatCalendarDate(
  value: string,
  style: CalendarDateStyle = "long",
  locale = "en-US",
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Invalid calendar date: ${value}`);

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new RangeError(`Invalid calendar date: ${value}`);
  }

  return new Intl.DateTimeFormat(locale, {
    ...dateFormats[style],
    timeZone: "UTC",
  }).format(date);
}
