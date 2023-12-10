import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILesson, NewLesson } from '../lesson.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILesson for edit and NewLessonFormGroupInput for create.
 */
type LessonFormGroupInput = ILesson | PartialWithRequiredKeyOf<NewLesson>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILesson | NewLesson> = Omit<T, 'date'> & {
  date?: string | null;
};

type LessonFormRawValue = FormValueOf<ILesson>;

type NewLessonFormRawValue = FormValueOf<NewLesson>;

type LessonFormDefaults = Pick<NewLesson, 'id' | 'date'>;

type LessonFormGroupContent = {
  id: FormControl<LessonFormRawValue['id'] | NewLesson['id']>;
  date: FormControl<LessonFormRawValue['date']>;
  type: FormControl<LessonFormRawValue['type']>;
  costAmount: FormControl<LessonFormRawValue['costAmount']>;
  student: FormControl<LessonFormRawValue['student']>;
};

export type LessonFormGroup = FormGroup<LessonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LessonFormService {
  createLessonFormGroup(lesson: LessonFormGroupInput = { id: null }): LessonFormGroup {
    const lessonRawValue = this.convertLessonToLessonRawValue({
      ...this.getFormDefaults(),
      ...lesson,
    });
    return new FormGroup<LessonFormGroupContent>({
      id: new FormControl(
        { value: lessonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(lessonRawValue.date),
      type: new FormControl(lessonRawValue.type),
      costAmount: new FormControl(lessonRawValue.costAmount),
      student: new FormControl(lessonRawValue.student),
    });
  }

  getLesson(form: LessonFormGroup): ILesson | NewLesson {
    return this.convertLessonRawValueToLesson(form.getRawValue() as LessonFormRawValue | NewLessonFormRawValue);
  }

  resetForm(form: LessonFormGroup, lesson: LessonFormGroupInput): void {
    const lessonRawValue = this.convertLessonToLessonRawValue({ ...this.getFormDefaults(), ...lesson });
    form.reset(
      {
        ...lessonRawValue,
        id: { value: lessonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LessonFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertLessonRawValueToLesson(rawLesson: LessonFormRawValue | NewLessonFormRawValue): ILesson | NewLesson {
    return {
      ...rawLesson,
      date: dayjs(rawLesson.date, DATE_TIME_FORMAT),
    };
  }

  private convertLessonToLessonRawValue(
    lesson: ILesson | (Partial<NewLesson> & LessonFormDefaults),
  ): LessonFormRawValue | PartialWithRequiredKeyOf<NewLessonFormRawValue> {
    return {
      ...lesson,
      date: lesson.date ? lesson.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
