import dayjs from 'dayjs/esm';

export interface IStudent {
  id: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  contractNumber?: string | null;
  phoneNumber?: string | null;
  jmbg?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
