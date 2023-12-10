import dayjs from 'dayjs/esm';

import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: 30793,
};

export const sampleWithPartialData: IPayment = {
  id: 21103,
  amount: 15283,
  date: dayjs('2023-12-09T16:11'),
};

export const sampleWithFullData: IPayment = {
  id: 2345,
  amount: 20555,
  date: dayjs('2023-12-09T14:01'),
};

export const sampleWithNewData: NewPayment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
