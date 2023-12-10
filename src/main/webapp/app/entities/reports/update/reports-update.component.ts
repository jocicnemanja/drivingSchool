import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReports } from '../reports.model';
import { ReportsService } from '../service/reports.service';
import { ReportsFormService, ReportsFormGroup } from './reports-form.service';

@Component({
  standalone: true,
  selector: 'jhi-reports-update',
  templateUrl: './reports-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReportsUpdateComponent implements OnInit {
  isSaving = false;
  reports: IReports | null = null;

  editForm: ReportsFormGroup = this.reportsFormService.createReportsFormGroup();

  constructor(
    protected reportsService: ReportsService,
    protected reportsFormService: ReportsFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reports }) => {
      this.reports = reports;
      if (reports) {
        this.updateForm(reports);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reports = this.reportsFormService.getReports(this.editForm);
    if (reports.id !== null) {
      this.subscribeToSaveResponse(this.reportsService.update(reports));
    } else {
      this.subscribeToSaveResponse(this.reportsService.create(reports));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReports>>): void {
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

  protected updateForm(reports: IReports): void {
    this.reports = reports;
    this.reportsFormService.resetForm(this.editForm, reports);
  }
}
