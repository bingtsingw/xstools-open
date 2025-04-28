import { format } from 'date-fns';
import { fromZonedTime } from './fromZonedTime';

export const formatWithTimeZone = (date: Date | string | number, timeZone: string, formatStr: string): string => {
  return format(fromZonedTime(date, timeZone), formatStr);
};
