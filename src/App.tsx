import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';
import { Filters } from './components/Filters';
import { useUsers } from './hooks/useUsers';
import { useFilters } from './hooks/useFilters';
import { User } from './types/User';

const AppContent: React.FC = () => {
  const { admin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { users, stats, loading: usersLoading, error, createUser, updateUser, deleteUser } = useUsers();
  const {
    searchTerm,
    setSearchTerm,
    serviceFilter,
    setServiceFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers
  } = useFilters(users);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, userData);
      } else {
        await createUser(userData);
      }
      setIsFormOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(userId);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const getFilteredUsersByService = (service: string) => {
    return filteredUsers.filter(user => user.service === service);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (usersLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      
      case 'netflix':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Utilisateurs Netflix</h1>
                <p className="text-gray-600">Gérez les abonnements Netflix</p>
              </div>
            </div>
            <Filters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              serviceFilter={serviceFilter}
              onServiceFilterChange={setServiceFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onAddUser={handleAddUser}
            />
            <UserTable
              users={getFilteredUsersByService('Netflix')}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>
        );
      
      case 'primevideo':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Utilisateurs Prime Video</h1>
                <p className="text-gray-600">Gérez les abonnements Prime Video</p>
              </div>
            </div>
            <Filters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              serviceFilter={serviceFilter}
              onServiceFilterChange={setServiceFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onAddUser={handleAddUser}
            />
            <UserTable
              users={getFilteredUsersByService('PrimeVideo')}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>
        );
      
      case 'statistics':
        return <Dashboard stats={stats} />;
      
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tous les utilisateurs</h1>
                <p className="text-gray-600">Vue d'ensemble de tous les abonnements</p>
              </div>
            </div>
            <Filters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              serviceFilter={serviceFilter}
              onServiceFilterChange={setServiceFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onAddUser={handleAddUser}
            />
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>
        );
      
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Navbar expiredCount={stats.expired} expiringThisWeek={stats.expiringThisWeek} />
        
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>

      <UserForm
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;