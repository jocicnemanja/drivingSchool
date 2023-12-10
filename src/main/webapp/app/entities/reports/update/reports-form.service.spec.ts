import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../reports.test-samples';

import { ReportsFormService } from './reports-form.service';

describe('Reports Form Service', () => {
  let service: ReportsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsFormService);
  });

  describe('Service methods', () => {
    describe('createReportsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReportsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });

      it('passing IReports should create a new form with FormGroup', () => {
        const formGroup = service.createReportsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });
    });

    describe('getReports', () => {
      it('should return NewReports for default Reports initial value', () => {
        const formGroup = service.createReportsFormGroup(sampleWithNewData);

        const reports = service.getReports(formGroup) as any;

        expect(reports).toMatchObject(sampleWithNewData);
      });

      it('should return NewReports for empty Reports initial value', () => {
        const formGroup = service.createReportsFormGroup();

        const reports = service.getReports(formGroup) as any;

        expect(reports).toMatchObject({});
      });

      it('should return IReports', () => {
        const formGroup = service.createReportsFormGroup(sampleWithRequiredData);

        const reports = service.getReports(formGroup) as any;

        expect(reports).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReports should not enable id FormControl', () => {
        const formGroup = service.createReportsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReports should disable id FormControl', () => {
        const formGroup = service.createReportsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
