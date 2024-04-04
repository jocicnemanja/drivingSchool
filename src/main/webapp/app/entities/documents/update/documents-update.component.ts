import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IDocuments } from '../documents.model';
import { DocumentsService } from '../service/documents.service';
import { DocumentsFormService, DocumentsFormGroup } from './documents-form.service';

@Component({
  standalone: true,
  selector: 'jhi-documents-update',
  templateUrl: './documents-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DocumentsUpdateComponent implements OnInit {
  isSaving = false;
  documents: IDocuments | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: DocumentsFormGroup = this.documentsFormService.createDocumentsFormGroup();

  constructor(
    protected documentsService: DocumentsService,
    protected documentsFormService: DocumentsFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documents }) => {
      this.documents = documents;
      if (documents) {
        this.updateForm(documents);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documents = this.documentsFormService.getDocuments(this.editForm);
    if (documents.id !== null) {
      this.subscribeToSaveResponse(this.documentsService.update(documents));
    } else {
      this.subscribeToSaveResponse(this.documentsService.create(documents));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocuments>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(documents: IDocuments): void {
    this.documents = documents;
    this.documentsFormService.resetForm(this.editForm, documents);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      documents.student,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.documents?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
