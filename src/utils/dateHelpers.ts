export const GetSundayAndSaturdayFromADate = (date: Date) => {
  const dayOfWeek = date.getDay();

  const sundayDay = date.getDate() - dayOfWeek;
  const saturdayDay = date.getDate() + (6 - dayOfWeek);

  const sundayStr = `${date.getFullYear().toString()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${sundayDay}`;
  const saturdayStr = `${date.getFullYear().toString()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${saturdayDay}`;

  //   const sunday = Date.parse(sundayStr);
  //   const saturday = Date.parse(saturdayStr);

  return { sundayStr, saturdayStr };
};
