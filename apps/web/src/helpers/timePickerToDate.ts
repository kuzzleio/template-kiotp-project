// slice i, i+2
// set utc hours
export default function timePickerToDate(timePicker: string, currentDate?: Date): Date {
  const { hours, minutes, seconds } = decomposeTimeFormat(timePicker);

  const date = currentDate ?? new Date(Date.now());
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(seconds);

  return date;
}

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
function decomposeTimeFormat(timeFormat: string): Time {
  const time = timeFormat.split(':');
  const hours = parseInt(time[0], 10);
  const minutes = parseInt(time[1], 10);
  const seconds = parseInt(time[2], 10);

  return { hours, minutes, seconds };
}
