export interface Admin {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'SuperAdmin' | 'Admin';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: Admin;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}