const defaultFaDateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatDateTimeFa(
  value: string | number | Date,
  fallback = "-",
) {
  const parsedDate = value instanceof Date ? value : new Date(value);

  return Number.isNaN(parsedDate.getTime())
    ? fallback
    : defaultFaDateTimeFormatter.format(parsedDate);
}
