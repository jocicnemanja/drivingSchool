import { ITenant, NewTenant } from './tenant.model';

export const sampleWithRequiredData: ITenant = {
  id: 17359,
};

export const sampleWithPartialData: ITenant = {
  id: 27438,
  phoneNumber: 'yum ill',
};

export const sampleWithFullData: ITenant = {
  id: 29506,
  name: 'grouse bravely provided',
  phoneNumber: 'jam underneath juvenile',
};

export const sampleWithNewData: NewTenant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
