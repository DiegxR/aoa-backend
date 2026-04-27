export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  createdBy?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}