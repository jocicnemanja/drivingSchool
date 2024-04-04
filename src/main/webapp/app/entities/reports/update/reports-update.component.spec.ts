import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReportsService } from '../service/reports.service';
import { IReports } from '../reports.model';
import { ReportsFormService } from './reports-form.service';

import { ReportsUpdateComponent } from './reports-update.component';

describe('Reports Management Update Component', () => {
  let comp: ReportsUpdateComponent;
  let fixture: ComponentFixture<ReportsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reportsFormService: ReportsFormService;
  let reportsService: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReportsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ReportsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReportsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reportsFormService = TestBed.inject(ReportsFormService);
    reportsService = TestBed.inject(ReportsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reports: IReports = { id: 456 };

      activatedRoute.data = of({ reports });
      comp.ngOnInit();

      expect(comp.reports).toEqual(reports);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReports>>();
      const reports = { id: 123 };
      jest.spyOn(reportsFormService, 'getReports').mockReturnValue(reports);
      jest.spyOn(reportsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reports });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reports }));
      saveSubject.complete();

      // THEN
      expect(reportsFormService.getReports).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reportsService.update).toHaveBeenCalledWith(expect.objectContaining(reports));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReports>>();
      const reports = { id: 123 };
      jest.spyOn(reportsFormService, 'getReports').mockReturnValue({ id: null });
      jest.spyOn(reportsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reports: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reports }));
      saveSubject.complete();

      // THEN
      expect(reportsFormService.getReports).toHaveBeenCalled();
      expect(reportsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReports>>();
      const reports = { id: 123 };
      jest.spyOn(reportsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reports });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reportsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
