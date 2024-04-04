import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAssurance, NewAssurance } from '../assurance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAssurance for edit and NewAssuranceFormGroupInput for create.
 */
type AssuranceFormGroupInput = IAssurance | PartialWithRequiredKeyOf<NewAssurance>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAssurance | NewAssurance> = Omit<T, 'date'> & {
  date?: string | null;
};

type AssuranceFormRawValue = FormValueOf<IAssurance>;

type NewAssuranceFormRawValue = FormValueOf<NewAssurance>;

type AssuranceFormDefaults = Pick<NewAssurance, 'id' | 'date'>;

type AssuranceFormGroupContent = {
  id: FormControl<AssuranceFormRawValue['id'] | NewAssurance['id']>;
  date: FormControl<AssuranceFormRawValue['date']>;
  type: FormControl<AssuranceFormRawValue['type']>;
  constAmount: FormControl<AssuranceFormRawValue['constAmount']>;
  student: FormControl<AssuranceFormRawValue['student']>;
};

export type AssuranceFormGroup = FormGroup<AssuranceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssuranceFormService {
  createAssuranceFormGroup(assurance: AssuranceFormGroupInput = { id: null }): AssuranceFormGroup {
    const assuranceRawValue = this.convertAssuranceToAssuranceRawValue({
      ...this.getFormDefaults(),
      ...assurance,
    });
    return new FormGroup<AssuranceFormGroupContent>({
      id: new FormControl(
        { value: assuranceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(assuranceRawValue.date),
      type: new FormControl(assuranceRawValue.type),
      constAmount: new FormControl(assuranceRawValue.constAmount),
      student: new FormControl(assuranceRawValue.student),
    });
  }

  getAssurance(form: AssuranceFormGroup): IAssurance | NewAssurance {
    return this.convertAssuranceRawValueToAssurance(form.getRawValue() as AssuranceFormRawValue | NewAssuranceFormRawValue);
  }

  resetForm(form: AssuranceFormGroup, assurance: AssuranceFormGroupInput): void {
    const assuranceRawValue = this.convertAssuranceToAssuranceRawValue({ ...this.getFormDefaults(), ...assurance });
    form.reset(
      {
        ...assuranceRawValue,
        id: { value: assuranceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AssuranceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertAssuranceRawValueToAssurance(rawAssurance: AssuranceFormRawValue | NewAssuranceFormRawValue): IAssurance | NewAssurance {
    return {
      ...rawAssurance,
      date: dayjs(rawAssurance.date, DATE_TIME_FORMAT),
    };
  }

  private convertAssuranceToAssuranceRawValue(
    assurance: IAssurance | (Partial<NewAssurance> & AssuranceFormDefaults),
  ): AssuranceFormRawValue | PartialWithRequiredKeyOf<NewAssuranceFormRawValue> {
    return {
      ...assurance,
      date: assurance.date ? assurance.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
