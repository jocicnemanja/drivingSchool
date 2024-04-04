import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ExamService } from '../service/exam.service';
import { IExam } from '../exam.model';
import { ExamFormService } from './exam-form.service';

import { ExamUpdateComponent } from './exam-update.component';

describe('Exam Management Update Component', () => {
  let comp: ExamUpdateComponent;
  let fixture: ComponentFixture<ExamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examFormService: ExamFormService;
  let examService: ExamService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExamUpdateComponent],
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
      .overrideTemplate(ExamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examFormService = TestBed.inject(ExamFormService);
    examService = TestBed.inject(ExamService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const student: IStudent = { id: 31391 };
      exam.student = student;

      const studentCollection: IStudent[] = [{ id: 12110 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const exam: IExam = { id: 456 };
      const student: IStudent = { id: 29869 };
      exam.student = student;

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.exam).toEqual(exam);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExam>>();
      const exam = { id: 123 };
      jest.spyOn(examFormService, 'getExam').mockReturnValue(exam);
      jest.spyOn(examService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exam }));
      saveSubject.complete();

      // THEN
      expect(examFormService.getExam).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(examService.update).toHaveBeenCalledWith(expect.objectContaining(exam));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExam>>();
      const exam = { id: 123 };
      jest.spyOn(examFormService, 'getExam').mockReturnValue({ id: null });
      jest.spyOn(examService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exam }));
      saveSubject.complete();

      // THEN
      expect(examFormService.getExam).toHaveBeenCalled();
      expect(examService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExam>>();
      const exam = { id: 123 };
      jest.spyOn(examService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examService.update).toHaveBeenCalled();
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
