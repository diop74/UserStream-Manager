import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onAddUser: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  serviceFilter,
  onServiceFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddUser
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les services</option>
              <option value="Netflix">Netflix</option>
              <option value="PrimeVideo">Prime Video</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="Active">Actif</option>
              <option value="Expired">Expiré</option>
            </select>
          </div>
        </div>

        <button
          onClick={onAddUser}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <Plus size={20} />
          Ajouter un utilisateur
        </button>
      </div>
    </div>
  );
};