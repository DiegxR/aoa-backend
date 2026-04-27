import { AuthUser } from '../types/context.types';

interface LogEntry {
  timestamp: string;
  operation: string;
  userId: string;
  role: string;
  details?: Record<string, unknown>;
}

export const logOperation = (
  operation: string,
  user: AuthUser | null,
  details?: Record<string, unknown>
): void => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    operation,
    userId: user?.id ?? 'anonymous',
    role: user?.role ?? 'none',
    details,
  };
  console.log(JSON.stringify(entry));
};