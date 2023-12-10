import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReports, NewReports } from '../reports.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReports for edit and NewReportsFormGroupInput for create.
 */
type ReportsFormGroupInput = IReports | PartialWithRequiredKeyOf<NewReports>;

type ReportsFormDefaults = Pick<NewReports, 'id'>;

type ReportsFormGroupContent = {
  id: FormControl<IReports['id'] | NewReports['id']>;
  name: FormControl<IReports['name']>;
  type: FormControl<IReports['type']>;
};

export type ReportsFormGroup = FormGroup<ReportsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportsFormService {
  createReportsFormGroup(reports: ReportsFormGroupInput = { id: null }): ReportsFormGroup {
    const reportsRawValue = {
      ...this.getFormDefaults(),
      ...reports,
    };
    return new FormGroup<ReportsFormGroupContent>({
      id: new FormControl(
        { value: reportsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(reportsRawValue.name),
      type: new FormControl(reportsRawValue.type),
    });
  }

  getReports(form: ReportsFormGroup): IReports | NewReports {
    return form.getRawValue() as IReports | NewReports;
  }

  resetForm(form: ReportsFormGroup, reports: ReportsFormGroupInput): void {
    const reportsRawValue = { ...this.getFormDefaults(), ...reports };
    form.reset(
      {
        ...reportsRawValue,
        id: { value: reportsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReportsFormDefaults {
    return {
      id: null,
    };
  }
}
