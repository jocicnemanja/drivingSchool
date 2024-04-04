import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { DocumentsService } from '../service/documents.service';
import { IDocuments } from '../documents.model';
import { DocumentsFormService } from './documents-form.service';

import { DocumentsUpdateComponent } from './documents-update.component';

describe('Documents Management Update Component', () => {
  let comp: DocumentsUpdateComponent;
  let fixture: ComponentFixture<DocumentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentsFormService: DocumentsFormService;
  let documentsService: DocumentsService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DocumentsUpdateComponent],
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
      .overrideTemplate(DocumentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentsFormService = TestBed.inject(DocumentsFormService);
    documentsService = TestBed.inject(DocumentsService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const documents: IDocuments = { id: 456 };
      const student: IStudent = { id: 771 };
      documents.student = student;

      const studentCollection: IStudent[] = [{ id: 15820 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documents });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const documents: IDocuments = { id: 456 };
      const student: IStudent = { id: 10826 };
      documents.student = student;

      activatedRoute.data = of({ documents });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.documents).toEqual(documents);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocuments>>();
      const documents = { id: 123 };
      jest.spyOn(documentsFormService, 'getDocuments').mockReturnValue(documents);
      jest.spyOn(documentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documents }));
      saveSubject.complete();

      // THEN
      expect(documentsFormService.getDocuments).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentsService.update).toHaveBeenCalledWith(expect.objectContaining(documents));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocuments>>();
      const documents = { id: 123 };
      jest.spyOn(documentsFormService, 'getDocuments').mockReturnValue({ id: null });
      jest.spyOn(documentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documents: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documents }));
      saveSubject.complete();

      // THEN
      expect(documentsFormService.getDocuments).toHaveBeenCalled();
      expect(documentsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocuments>>();
      const documents = { id: 123 };
      jest.spyOn(documentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(documentsService.update).toHaveBeenCalled();
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
