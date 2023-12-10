import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface IExam {
  id: number;
  date?: dayjs.Dayjs | null;
  type?: string | null;
  constAmount?: number | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewExam = Omit<IExam, 'id'> & { id: null };
