import { useState, useMemo } from 'react';
import { User } from '../types/User';

export const useFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = !serviceFilter || user.service === serviceFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      
      return matchesSearch && matchesService && matchesStatus;
    });
  }, [users, searchTerm, serviceFilter, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    serviceFilter,
    setServiceFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers
  };
};