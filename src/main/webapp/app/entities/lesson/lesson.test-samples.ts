import dayjs from 'dayjs/esm';

import { ILesson, NewLesson } from './lesson.model';

export const sampleWithRequiredData: ILesson = {
  id: 30562,
};

export const sampleWithPartialData: ILesson = {
  id: 30865,
  date: dayjs('2023-12-09T18:51'),
};

export const sampleWithFullData: ILesson = {
  id: 25275,
  date: dayjs('2023-12-10T10:27'),
  type: 'likely teapot highly',
  costAmount: 28132,
};

export const sampleWithNewData: NewLesson = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
