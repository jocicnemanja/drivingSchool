import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { AssuranceService } from '../service/assurance.service';
import { IAssurance } from '../assurance.model';
import { AssuranceFormService } from './assurance-form.service';

import { AssuranceUpdateComponent } from './assurance-update.component';

describe('Assurance Management Update Component', () => {
  let comp: AssuranceUpdateComponent;
  let fixture: ComponentFixture<AssuranceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assuranceFormService: AssuranceFormService;
  let assuranceService: AssuranceService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AssuranceUpdateComponent],
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
      .overrideTemplate(AssuranceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssuranceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assuranceFormService = TestBed.inject(AssuranceFormService);
    assuranceService = TestBed.inject(AssuranceService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const assurance: IAssurance = { id: 456 };
      const student: IStudent = { id: 352 };
      assurance.student = student;

      const studentCollection: IStudent[] = [{ id: 2105 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ assurance });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const assurance: IAssurance = { id: 456 };
      const student: IStudent = { id: 32043 };
      assurance.student = student;

      activatedRoute.data = of({ assurance });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.assurance).toEqual(assurance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssurance>>();
      const assurance = { id: 123 };
      jest.spyOn(assuranceFormService, 'getAssurance').mockReturnValue(assurance);
      jest.spyOn(assuranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assurance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assurance }));
      saveSubject.complete();

      // THEN
      expect(assuranceFormService.getAssurance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(assuranceService.update).toHaveBeenCalledWith(expect.objectContaining(assurance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssurance>>();
      const assurance = { id: 123 };
      jest.spyOn(assuranceFormService, 'getAssurance').mockReturnValue({ id: null });
      jest.spyOn(assuranceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assurance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assurance }));
      saveSubject.complete();

      // THEN
      expect(assuranceFormService.getAssurance).toHaveBeenCalled();
      expect(assuranceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssurance>>();
      const assurance = { id: 123 };
      jest.spyOn(assuranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assurance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assuranceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
