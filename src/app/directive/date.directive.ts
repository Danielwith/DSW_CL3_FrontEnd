import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

@Directive({
  selector: '[validateDate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateDirective,
      multi: true,
    },
  ],
})
export class DateDirective implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = this.dateValidator();
  }

  validate(c: AbstractControl): { [key: string]: any } | null {
    return this.validator(c);
  }

  private dateValidator(): ValidatorFn {
    return (c: AbstractControl) => {
      const currentDate = new Date();
      const selectedDate = new Date(c.value);

      if (c.value && selectedDate > currentDate) {
        return {
          dateofbirth: {
            valid: false,
          },
        };
      }

      return null;
    };
  }
}
