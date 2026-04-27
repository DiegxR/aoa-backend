export type UserRole = 'admin' | 'bodeguero' | 'consultor' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface GraphQLContext {
  user: AuthUser | null;
}