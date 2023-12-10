import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExam, NewExam } from '../exam.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExam for edit and NewExamFormGroupInput for create.
 */
type ExamFormGroupInput = IExam | PartialWithRequiredKeyOf<NewExam>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IExam | NewExam> = Omit<T, 'date'> & {
  date?: string | null;
};

type ExamFormRawValue = FormValueOf<IExam>;

type NewExamFormRawValue = FormValueOf<NewExam>;

type ExamFormDefaults = Pick<NewExam, 'id' | 'date'>;

type ExamFormGroupContent = {
  id: FormControl<ExamFormRawValue['id'] | NewExam['id']>;
  date: FormControl<ExamFormRawValue['date']>;
  type: FormControl<ExamFormRawValue['type']>;
  constAmount: FormControl<ExamFormRawValue['constAmount']>;
  student: FormControl<ExamFormRawValue['student']>;
};

export type ExamFormGroup = FormGroup<ExamFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExamFormService {
  createExamFormGroup(exam: ExamFormGroupInput = { id: null }): ExamFormGroup {
    const examRawValue = this.convertExamToExamRawValue({
      ...this.getFormDefaults(),
      ...exam,
    });
    return new FormGroup<ExamFormGroupContent>({
      id: new FormControl(
        { value: examRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(examRawValue.date),
      type: new FormControl(examRawValue.type),
      constAmount: new FormControl(examRawValue.constAmount),
      student: new FormControl(examRawValue.student),
    });
  }

  getExam(form: ExamFormGroup): IExam | NewExam {
    return this.convertExamRawValueToExam(form.getRawValue() as ExamFormRawValue | NewExamFormRawValue);
  }

  resetForm(form: ExamFormGroup, exam: ExamFormGroupInput): void {
    const examRawValue = this.convertExamToExamRawValue({ ...this.getFormDefaults(), ...exam });
    form.reset(
      {
        ...examRawValue,
        id: { value: examRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExamFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertExamRawValueToExam(rawExam: ExamFormRawValue | NewExamFormRawValue): IExam | NewExam {
    return {
      ...rawExam,
      date: dayjs(rawExam.date, DATE_TIME_FORMAT),
    };
  }

  private convertExamToExamRawValue(
    exam: IExam | (Partial<NewExam> & ExamFormDefaults),
  ): ExamFormRawValue | PartialWithRequiredKeyOf<NewExamFormRawValue> {
    return {
      ...exam,
      date: exam.date ? exam.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
