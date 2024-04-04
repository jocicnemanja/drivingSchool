import { IReports, NewReports } from './reports.model';

export const sampleWithRequiredData: IReports = {
  id: 17435,
};

export const sampleWithPartialData: IReports = {
  id: 29401,
  name: 'meanwhile or',
  type: 'ram crunch',
};

export const sampleWithFullData: IReports = {
  id: 6105,
  name: 'where frantically oh',
  type: 'refrigerate cumbersome since',
};

export const sampleWithNewData: NewReports = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
