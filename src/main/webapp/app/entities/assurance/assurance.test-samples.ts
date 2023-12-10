import dayjs from 'dayjs/esm';

import { IAssurance, NewAssurance } from './assurance.model';

export const sampleWithRequiredData: IAssurance = {
  id: 10175,
};

export const sampleWithPartialData: IAssurance = {
  id: 10523,
  date: dayjs('2023-12-09T17:04'),
  type: 'sadly',
};

export const sampleWithFullData: IAssurance = {
  id: 8587,
  date: dayjs('2023-12-10T04:21'),
  type: 'harm within',
  constAmount: 1645,
};

export const sampleWithNewData: NewAssurance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
