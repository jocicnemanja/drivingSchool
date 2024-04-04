import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDocuments, NewDocuments } from '../documents.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDocuments for edit and NewDocumentsFormGroupInput for create.
 */
type DocumentsFormGroupInput = IDocuments | PartialWithRequiredKeyOf<NewDocuments>;

type DocumentsFormDefaults = Pick<NewDocuments, 'id'>;

type DocumentsFormGroupContent = {
  id: FormControl<IDocuments['id'] | NewDocuments['id']>;
  name: FormControl<IDocuments['name']>;
  type: FormControl<IDocuments['type']>;
  student: FormControl<IDocuments['student']>;
};

export type DocumentsFormGroup = FormGroup<DocumentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DocumentsFormService {
  createDocumentsFormGroup(documents: DocumentsFormGroupInput = { id: null }): DocumentsFormGroup {
    const documentsRawValue = {
      ...this.getFormDefaults(),
      ...documents,
    };
    return new FormGroup<DocumentsFormGroupContent>({
      id: new FormControl(
        { value: documentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(documentsRawValue.name),
      type: new FormControl(documentsRawValue.type),
      student: new FormControl(documentsRawValue.student),
    });
  }

  getDocuments(form: DocumentsFormGroup): IDocuments | NewDocuments {
    return form.getRawValue() as IDocuments | NewDocuments;
  }

  resetForm(form: DocumentsFormGroup, documents: DocumentsFormGroupInput): void {
    const documentsRawValue = { ...this.getFormDefaults(), ...documents };
    form.reset(
      {
        ...documentsRawValue,
        id: { value: documentsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DocumentsFormDefaults {
    return {
      id: null,
    };
  }
}
