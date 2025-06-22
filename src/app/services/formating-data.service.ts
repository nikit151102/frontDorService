import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatingDataService {

  constructor() { }

    formatisNumber(value: any): string {
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : Number(value);

    if (isNaN(numericValue)) return '0';

    if (Number.isInteger(numericValue)) {
      return numericValue.toLocaleString('ru-RU');
    } else {
      const formatted = numericValue.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formatted.endsWith(',00')
        ? formatted.replace(',00', '')
        : formatted;
    }
  }
  
}
