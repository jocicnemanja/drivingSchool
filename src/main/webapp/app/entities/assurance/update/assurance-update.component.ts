import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IAssurance } from '../assurance.model';
import { AssuranceService } from '../service/assurance.service';
import { AssuranceFormService, AssuranceFormGroup } from './assurance-form.service';

@Component({
  standalone: true,
  selector: 'jhi-assurance-update',
  templateUrl: './assurance-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssuranceUpdateComponent implements OnInit {
  isSaving = false;
  assurance: IAssurance | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: AssuranceFormGroup = this.assuranceFormService.createAssuranceFormGroup();

  constructor(
    protected assuranceService: AssuranceService,
    protected assuranceFormService: AssuranceFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assurance }) => {
      this.assurance = assurance;
      if (assurance) {
        this.updateForm(assurance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assurance = this.assuranceFormService.getAssurance(this.editForm);
    if (assurance.id !== null) {
      this.subscribeToSaveResponse(this.assuranceService.update(assurance));
    } else {
      this.subscribeToSaveResponse(this.assuranceService.create(assurance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssurance>>): void {
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

  protected updateForm(assurance: IAssurance): void {
    this.assurance = assurance;
    this.assuranceFormService.resetForm(this.editForm, assurance);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      assurance.student,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.assurance?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
