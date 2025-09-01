import React from 'react';
import { Network as Netflix, Video, BarChart3, Users, Home } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'netflix', label: 'Netflix', icon: Netflix },
    { id: 'primevideo', label: 'Prime Video', icon: Video },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'users', label: 'Tous les utilisateurs', icon: Users },
  ];

  return (
    <div className="bg-gray-900 w-64 min-h-screen p-6 shadow-xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold flex items-center gap-2">
          <Video className="text-red-500" />
          StreamAdmin
        </h1>
        <p className="text-gray-400 text-sm mt-1">Gestion des abonnements</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-xs mb-2">Version</p>
        <p className="text-white font-semibold">StreamAdmin v1.0</p>
      </div>
    </div>
  );
};