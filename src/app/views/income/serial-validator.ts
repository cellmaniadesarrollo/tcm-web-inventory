import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function serialValidator(itemName: string, rules: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const serial = control.value;
    if (!itemName || !serial) return null;

    const upperItem = itemName.toUpperCase();

    // Buscar regla
    const rule = rules.find((r: any) =>
      r.keywords.some((k: string) => upperItem.includes(k))
    );

    if (!rule) return null;

    // Validar largo
    if (serial.length < rule.requiredLength) {
      return {
        serialLength: {
          required: rule.requiredLength,
          actual: serial.length,
          missing: rule.requiredLength - serial.length
        }
      };
    }

    // Validar si es solo números
    if (rule.numericOnly && !/^[0-9]+$/.test(serial)) {
      return { serialNumeric: true };
    }

    return null;
  };
}
