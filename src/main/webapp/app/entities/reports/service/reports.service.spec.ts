import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReports } from '../reports.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../reports.test-samples';

import { ReportsService } from './reports.service';

const requireRestSample: IReports = {
  ...sampleWithRequiredData,
};

describe('Reports Service', () => {
  let service: ReportsService;
  let httpMock: HttpTestingController;
  let expectedResult: IReports | IReports[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReportsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Reports', () => {
      const reports = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reports).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reports', () => {
      const reports = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reports).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reports', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reports', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reports', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReportsToCollectionIfMissing', () => {
      it('should add a Reports to an empty array', () => {
        const reports: IReports = sampleWithRequiredData;
        expectedResult = service.addReportsToCollectionIfMissing([], reports);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reports);
      });

      it('should not add a Reports to an array that contains it', () => {
        const reports: IReports = sampleWithRequiredData;
        const reportsCollection: IReports[] = [
          {
            ...reports,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReportsToCollectionIfMissing(reportsCollection, reports);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reports to an array that doesn't contain it", () => {
        const reports: IReports = sampleWithRequiredData;
        const reportsCollection: IReports[] = [sampleWithPartialData];
        expectedResult = service.addReportsToCollectionIfMissing(reportsCollection, reports);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reports);
      });

      it('should add only unique Reports to an array', () => {
        const reportsArray: IReports[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reportsCollection: IReports[] = [sampleWithRequiredData];
        expectedResult = service.addReportsToCollectionIfMissing(reportsCollection, ...reportsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reports: IReports = sampleWithRequiredData;
        const reports2: IReports = sampleWithPartialData;
        expectedResult = service.addReportsToCollectionIfMissing([], reports, reports2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reports);
        expect(expectedResult).toContain(reports2);
      });

      it('should accept null and undefined values', () => {
        const reports: IReports = sampleWithRequiredData;
        expectedResult = service.addReportsToCollectionIfMissing([], null, reports, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reports);
      });

      it('should return initial array if no Reports is added', () => {
        const reportsCollection: IReports[] = [sampleWithRequiredData];
        expectedResult = service.addReportsToCollectionIfMissing(reportsCollection, undefined, null);
        expect(expectedResult).toEqual(reportsCollection);
      });
    });

    describe('compareReports', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReports(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReports(entity1, entity2);
        const compareResult2 = service.compareReports(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReports(entity1, entity2);
        const compareResult2 = service.compareReports(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReports(entity1, entity2);
        const compareResult2 = service.compareReports(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
