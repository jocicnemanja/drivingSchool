import { IStudent } from 'app/entities/student/student.model';

export interface IDiscount {
  id: number;
  amount?: number | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewDiscount = Omit<IDiscount, 'id'> & { id: null };
