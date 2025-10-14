export const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
export const toISODate = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
export const formatDisplay = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const isPast = (year, month, day) => {
  const target = startOfDay(new Date(year, month - 1, day));
  return target < startOfDay(new Date());
};

export const getMonthGrid = (year, month) => {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};
