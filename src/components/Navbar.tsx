import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  expiredCount: number;
  expiringThisWeek: number;
}

export const Navbar: React.FC<NavbarProps> = ({ expiredCount, expiringThisWeek }) => {
  const { admin, logout } = useAuth();
  const hasNotifications = expiredCount > 0 || expiringThisWeek > 0;

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 text-sm">Gérez vos abonnements Netflix et Prime Video</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell size={20} className="text-gray-600" />
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {expiredCount + expiringThisWeek}
                </span>
              )}
            </button>
            
            {hasNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                {expiredCount > 0 && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <span className="text-red-600 font-medium">{expiredCount}</span> abonnement(s) expiré(s)
                  </div>
                )}
                {expiringThisWeek > 0 && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <span className="text-yellow-600 font-medium">{expiringThisWeek}</span> abonnement(s) expire(nt) cette semaine
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Settings size={20} className="text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
              <p className="text-xs text-gray-500">{admin?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
              title="Se déconnecter"
            >
              <LogOut size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};