import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { LessonService } from '../service/lesson.service';
import { ILesson } from '../lesson.model';
import { LessonFormService } from './lesson-form.service';

import { LessonUpdateComponent } from './lesson-update.component';

describe('Lesson Management Update Component', () => {
  let comp: LessonUpdateComponent;
  let fixture: ComponentFixture<LessonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lessonFormService: LessonFormService;
  let lessonService: LessonService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LessonUpdateComponent],
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
      .overrideTemplate(LessonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LessonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lessonFormService = TestBed.inject(LessonFormService);
    lessonService = TestBed.inject(LessonService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const lesson: ILesson = { id: 456 };
      const student: IStudent = { id: 24431 };
      lesson.student = student;

      const studentCollection: IStudent[] = [{ id: 27261 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lesson: ILesson = { id: 456 };
      const student: IStudent = { id: 18959 };
      lesson.student = student;

      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.lesson).toEqual(lesson);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonFormService, 'getLesson').mockReturnValue(lesson);
      jest.spyOn(lessonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lesson }));
      saveSubject.complete();

      // THEN
      expect(lessonFormService.getLesson).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lessonService.update).toHaveBeenCalledWith(expect.objectContaining(lesson));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonFormService, 'getLesson').mockReturnValue({ id: null });
      jest.spyOn(lessonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lesson }));
      saveSubject.complete();

      // THEN
      expect(lessonFormService.getLesson).toHaveBeenCalled();
      expect(lessonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILesson>>();
      const lesson = { id: 123 };
      jest.spyOn(lessonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lesson });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lessonService.update).toHaveBeenCalled();
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
