
import { LoginCredentials, AuthResponse, Admin } from '../types/Auth';

const API_BASE = import.meta.env.VITE_API_URL + '/api/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur de connexion');
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la déconnexion');
    }
  },

  getProfile: async (token: string): Promise<{ admin: Admin }> => {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Token invalide');
    }

    return response.json();
  },

  createAdmin: async (token: string, adminData: any): Promise<any> => {
    const response = await fetch(`${API_BASE}/create-admin`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création');
    }

    return response.json();
  },

  getAdmins: async (token: string): Promise<{ admins: Admin[] }> => {
    const response = await fetch(`${API_BASE}/admins`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération');
    }

    return response.json();
  }
};