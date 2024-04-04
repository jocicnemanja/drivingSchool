import { IDocuments, NewDocuments } from './documents.model';

export const sampleWithRequiredData: IDocuments = {
  id: 11349,
};

export const sampleWithPartialData: IDocuments = {
  id: 10729,
  name: 'demob',
  type: 'yippee',
};

export const sampleWithFullData: IDocuments = {
  id: 3573,
  name: 'recording',
  type: 'joyous',
};

export const sampleWithNewData: NewDocuments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
