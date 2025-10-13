import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Pipe({
  name: 'relativeDateZ0'
})
export class RelativeDateZ0Pipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown { 
      if (!value) return '';
  
      // Validar tipo antes de convertir
      if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
        return '';
      }
  
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';
  
      // Usar UTC (zona horaria 0) en lugar de Ecuador
      const utcTime = toZonedTime(date, 'UTC');
  
      if (isToday(utcTime)) {
        return `Hoy a las ${format(utcTime, 'HH:mm')}`;
      } else if (isYesterday(utcTime)) {
        return `Ayer a las ${format(utcTime, 'HH:mm')}`;
      } else {
        return format(utcTime, 'dd/MM/yyyy');
      }
  }

}
