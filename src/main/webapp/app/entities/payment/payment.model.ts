import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface IPayment {
  id: number;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
