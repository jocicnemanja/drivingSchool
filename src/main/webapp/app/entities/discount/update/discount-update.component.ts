import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IDiscount } from '../discount.model';
import { DiscountService } from '../service/discount.service';
import { DiscountFormService, DiscountFormGroup } from './discount-form.service';

@Component({
  standalone: true,
  selector: 'jhi-discount-update',
  templateUrl: './discount-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DiscountUpdateComponent implements OnInit {
  isSaving = false;
  discount: IDiscount | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: DiscountFormGroup = this.discountFormService.createDiscountFormGroup();

  constructor(
    protected discountService: DiscountService,
    protected discountFormService: DiscountFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discount }) => {
      this.discount = discount;
      if (discount) {
        this.updateForm(discount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discount = this.discountFormService.getDiscount(this.editForm);
    if (discount.id !== null) {
      this.subscribeToSaveResponse(this.discountService.update(discount));
    } else {
      this.subscribeToSaveResponse(this.discountService.create(discount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscount>>): void {
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

  protected updateForm(discount: IDiscount): void {
    this.discount = discount;
    this.discountFormService.resetForm(this.editForm, discount);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      discount.student,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.discount?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
