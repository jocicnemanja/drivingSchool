export interface IReports {
  id: number;
  name?: string | null;
  type?: string | null;
}

export type NewReports = Omit<IReports, 'id'> & { id: null };
