import { IStudent } from 'app/entities/student/student.model';

export interface IDocuments {
  id: number;
  name?: string | null;
  type?: string | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewDocuments = Omit<IDocuments, 'id'> & { id: null };
