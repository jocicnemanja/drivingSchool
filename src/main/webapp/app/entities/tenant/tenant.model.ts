export interface ITenant {
  id: number;
  name?: string | null;
  phoneNumber?: string | null;
}

export type NewTenant = Omit<ITenant, 'id'> & { id: null };
