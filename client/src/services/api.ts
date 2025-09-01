import { User, UserStats } from '../types/User';

const API_BASE = import.meta.env.VITE_API_URL + '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
    return response.json();
  },

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Utilisateur non trouvé');
    return response.json();
  },

  createUser: async (userData: Omit<User, 'id' | 'expirationDate' | 'status'>): Promise<User> => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
    return response.json();
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    return response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
  },

  // Stats
  getStats: async (): Promise<UserStats> => {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return response.json();
  },
};