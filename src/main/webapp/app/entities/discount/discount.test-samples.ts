import { IDiscount, NewDiscount } from './discount.model';

export const sampleWithRequiredData: IDiscount = {
  id: 20141,
};

export const sampleWithPartialData: IDiscount = {
  id: 6535,
  amount: 18845.6,
};

export const sampleWithFullData: IDiscount = {
  id: 6503,
  amount: 13702.21,
};

export const sampleWithNewData: NewDiscount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
