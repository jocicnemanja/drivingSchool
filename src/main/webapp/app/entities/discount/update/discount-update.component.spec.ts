import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { DiscountService } from '../service/discount.service';
import { IDiscount } from '../discount.model';
import { DiscountFormService } from './discount-form.service';

import { DiscountUpdateComponent } from './discount-update.component';

describe('Discount Management Update Component', () => {
  let comp: DiscountUpdateComponent;
  let fixture: ComponentFixture<DiscountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let discountFormService: DiscountFormService;
  let discountService: DiscountService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DiscountUpdateComponent],
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
      .overrideTemplate(DiscountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    discountFormService = TestBed.inject(DiscountFormService);
    discountService = TestBed.inject(DiscountService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const discount: IDiscount = { id: 456 };
      const student: IStudent = { id: 2761 };
      discount.student = student;

      const studentCollection: IStudent[] = [{ id: 17501 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discount });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const discount: IDiscount = { id: 456 };
      const student: IStudent = { id: 21210 };
      discount.student = student;

      activatedRoute.data = of({ discount });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.discount).toEqual(discount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscount>>();
      const discount = { id: 123 };
      jest.spyOn(discountFormService, 'getDiscount').mockReturnValue(discount);
      jest.spyOn(discountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discount }));
      saveSubject.complete();

      // THEN
      expect(discountFormService.getDiscount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(discountService.update).toHaveBeenCalledWith(expect.objectContaining(discount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscount>>();
      const discount = { id: 123 };
      jest.spyOn(discountFormService, 'getDiscount').mockReturnValue({ id: null });
      jest.spyOn(discountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discount }));
      saveSubject.complete();

      // THEN
      expect(discountFormService.getDiscount).toHaveBeenCalled();
      expect(discountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscount>>();
      const discount = { id: 123 };
      jest.spyOn(discountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(discountService.update).toHaveBeenCalled();
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
