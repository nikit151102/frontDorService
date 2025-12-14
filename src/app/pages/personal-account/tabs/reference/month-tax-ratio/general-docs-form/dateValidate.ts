import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Валидатор beginDateTime < endDateTime
export function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDate = formGroup.get('beginDateTime')?.value;
    const endDate = formGroup.get('endDateTime')?.value;

    if (startDate && endDate && startDate > endDate) {
      return { dateRangeInvalid: true }; 
    }
    return null; 
  };
}