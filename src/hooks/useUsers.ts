import { useState, useEffect } from 'react';
import { User, UserStats } from '../types/User';
import { api } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    expired: 0,
    netflix: 0,
    primeVideo: 0,
    expiringThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        api.getUsers(),
        api.getStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'expirationDate' | 'status'>) => {
    try {
      await api.createUser(userData);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      await api.updateUser(id, userData);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  };
};