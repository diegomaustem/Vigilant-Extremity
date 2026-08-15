export interface RoleBase {
  id: number;
  name: string;
  description: string;
}

export interface InputRole extends RoleBase {}

export interface Role extends RoleBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}