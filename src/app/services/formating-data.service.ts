import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatingDataService {

  constructor() { }

  formatisNumber(value: any): string {
    if (typeof value === 'string') {
      if (value.trim() === '') return value;
      const parsedValue = Number(value.replace(',', '.'));

      if (isNaN(parsedValue)) {
        return value;
      }

      value = parsedValue;
    }

    const numericValue = Number(value);

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
