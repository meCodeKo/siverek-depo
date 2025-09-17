 import { User, LoginCredentials, AuthSession, UserRole, ROLE_PERMISSIONS } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  USERS: 'siverek_users',
  CURRENT_SESSION: 'siverek_session',
  LOGIN_ATTEMPTS: 'siverek_login_attempts',
};

// Varsayılan kullanıcılar
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@siverek.gov.tr',
    fullName: 'Sistem Yöneticisi',
    role: 'admin',
    department: 'Bilgi İşlem Müdürlüğü',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@siverek.gov.tr',
    fullName: 'Bilgi İşlem Müdürü',
    role: 'manager',
    department: 'Bilgi İşlem Müdürlüğü',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'user1',
    email: 'user1@siverek.gov.tr',
    fullName: 'Bilgisayar Programcısı',
    role: 'user',
    department: 'Bilgi İşlem Müdürlüğü',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

// Varsayılan şifreler (gerçek uygulamada hash'lenmiş olacak)
const DEFAULT_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  manager: 'manager123',
  user1: 'user123',
};

class AuthService {
  private sessionTimeout = 8 * 60 * 60 * 1000; // 8 saat

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    if (typeof window === 'undefined') return;
    
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
  }

  private getUsersFromStorage(): User[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : DEFAULT_USERS;
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  private generateToken(): string {
    return btoa(uuidv4() + Date.now());
  }

  private saveSession(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify({
      ...session,
      expiresAt: session.expiresAt.toISOString(),
    }));
  }

  private getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    
    const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      return {
        ...session,
        expiresAt: new Date(session.expiresAt),
      };
    } catch {
      return null;
    }
  }

  private checkLoginAttempts(username: string): boolean {
    if (typeof window === 'undefined') return true;
    
    const attempts = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    if (!attempts) return true;

    try {
      const attemptsData = JSON.parse(attempts);
      const userAttempts = attemptsData[username];
      
      if (!userAttempts) return true;
      
      const now = Date.now();
      const recentAttempts = userAttempts.filter((attempt: number) => now - attempt < 15 * 60 * 1000); // 15 dakika
      
      return recentAttempts.length < 5; // Maksimum 5 deneme
    } catch {
      return true;
    }
  }

  private recordLoginAttempt(username: string): void {
    if (typeof window === 'undefined') return;
    
    const attempts = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    let attemptsData: Record<string, number[]> = {};
    
    if (attempts) {
      try {
        attemptsData = JSON.parse(attempts);
      } catch {
        attemptsData = {};
      }
    }
    
    if (!attemptsData[username]) {
      attemptsData[username] = [];
    }
    
    attemptsData[username].push(Date.now());
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attemptsData));
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    const { username, password } = credentials;

    // Giriş denemesi kontrolü
    if (!this.checkLoginAttempts(username)) {
      return {
        success: false,
        error: 'Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.'
      };
    }

    const users = this.getUsersFromStorage();
    const user = users.find(u => u.username === username && u.isActive);

    if (!user) {
      this.recordLoginAttempt(username);
      return {
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      };
    }

    // Şifre kontrolü (gerçek uygulamada hash karşılaştırması yapılacak)
    const expectedPassword = DEFAULT_PASSWORDS[username];
    if (password !== expectedPassword) {
      this.recordLoginAttempt(username);
      return {
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      };
    }

    // Son giriş tarihini güncelle
    const updatedUser = { ...user, lastLogin: new Date(), updatedAt: new Date() };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    this.saveUsers(updatedUsers);

    // Oturum oluştur
    const session: AuthSession = {
      user: updatedUser,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + this.sessionTimeout),
    };

    this.saveSession(session);

    return { success: true, session };
  }

  getCurrentSession(): AuthSession | null {
    const session = this.getStoredSession();
    
    if (!session) return null;
    
    // Oturum süresi kontrolü
    if (new Date() > session.expiresAt) {
      this.logout();
      return null;
    }

    return session;
  }

  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  }

  hasPermission(resource: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = ROLE_PERMISSIONS[user.role];
    const resourcePermission = permissions.find(p => p.resource === resource);
    
    return resourcePermission ? resourcePermission.actions.includes(action) : false;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // Kullanıcı yönetimi (sadece admin)
  getUsers(): User[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !this.hasPermission('users', 'read')) {
      return [];
    }
    return this.getUsersFromStorage();
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !this.hasPermission('users', 'create')) {
      return false;
    }

    const users = this.getUsersFromStorage();
    const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
    
    if (existingUser) return false;

    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return true;
  }

  deactivateUser(userId: string): boolean {
    // Bu metod artık async updateUser'ı kullanacak
    const result = this.updateUser(userId, { isActive: false });
    return result instanceof Promise ? false : result;
  }

  // Şifre değiştirme
  changePassword(currentPassword: string, newPassword: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Mevcut şifre kontrolü
    if (DEFAULT_PASSWORDS[user.username] !== currentPassword) {
      return false;
    }

    // Gerçek uygulamada şifre hash'lenip kaydedilecek
    DEFAULT_PASSWORDS[user.username] = newPassword;
    return true;
  }

  // Oturum süresini uzat
  extendSession(): void {
    const session = this.getStoredSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + this.sessionTimeout);
      this.saveSession(session);
    }
  }

  // Tüm kullanıcıları getir
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch('/api/auth?action=list');
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        console.error('Failed to fetch users:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Yeni kullanıcı ekle
  async addUser(userData: Omit<User, 'id'> & { password: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          user: userData
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding user:', error);
      return {
        success: false,
        error: 'Beklenmeyen bir hata oluştu.'
      };
    }
  }

  // Kullanıcı sil
  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          userId: userId
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Beklenmeyen bir hata oluştu.'
      };
    }
  }

  // Kullanıcı güncelle
  async updateUser(userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          userId: userId,
          userData: updates
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: 'Beklenmeyen bir hata oluştu.'
      };
    }
  }
}

export const authService = new AuthService();