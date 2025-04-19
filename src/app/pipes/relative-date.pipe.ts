import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown { 
      if (!value) return '';
  
      // Validar tipo antes de convertir
      if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
        return '';
      }
  
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';
  
      const ecuadorTime = toZonedTime(date, 'America/Guayaquil');
  
      if (isToday(ecuadorTime)) {
        return `Hoy a las ${format(ecuadorTime, 'HH:mm')}`;
      } else if (isYesterday(ecuadorTime)) {
        return `Ayer a las ${format(ecuadorTime, 'HH:mm')}`;
      } else {
        return format(ecuadorTime, 'dd/MM/yyyy');
      }
  }

}
