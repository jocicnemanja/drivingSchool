import dayjs from 'dayjs/esm';

import { IExam, NewExam } from './exam.model';

export const sampleWithRequiredData: IExam = {
  id: 32261,
};

export const sampleWithPartialData: IExam = {
  id: 31987,
  date: dayjs('2023-12-09T13:25'),
};

export const sampleWithFullData: IExam = {
  id: 30323,
  date: dayjs('2023-12-09T23:57'),
  type: 'hm',
  constAmount: 18590,
};

export const sampleWithNewData: NewExam = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
