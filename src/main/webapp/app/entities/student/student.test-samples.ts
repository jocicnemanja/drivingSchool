import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 27479,
};

export const sampleWithPartialData: IStudent = {
  id: 30128,
  middleName: 'across',
  dateOfBirth: dayjs('2023-12-09T13:16'),
};

export const sampleWithFullData: IStudent = {
  id: 25060,
  firstName: 'Okey',
  middleName: 'er modulo',
  lastName: 'Schiller',
  contractNumber: 'whether lest',
  phoneNumber: 'geez since',
  jmbg: 'hidden ha',
  dateOfBirth: dayjs('2023-12-09T21:08'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
