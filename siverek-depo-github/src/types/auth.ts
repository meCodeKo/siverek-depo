export interface User {
  id: string;
  username: string;
  password?: string; // Optional for client-side use
  email: string;
  fullName: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export type UserRole = 'admin' | 'manager' | 'user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'transactions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'export'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  manager: [
    { resource: 'inventory', actions: ['create', 'read', 'update'] },
    { resource: 'transactions', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'users', actions: ['read'] },
  ],
  user: [
    { resource: 'inventory', actions: ['read'] },
    { resource: 'transactions', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
  ],
};