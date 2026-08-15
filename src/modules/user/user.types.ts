export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUser = {
  email: string;
  name: string;
  passwordHash: string;
  roleId: number;
};

export type InputUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & {
  password: string;
};

export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>> & {
  password?: string;
};

export type UserResponse = Omit<User, 'passwordHash'>;