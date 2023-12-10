import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface ILesson {
  id: number;
  date?: dayjs.Dayjs | null;
  type?: string | null;
  costAmount?: number | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewLesson = Omit<ILesson, 'id'> & { id: null };
