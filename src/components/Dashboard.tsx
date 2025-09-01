import React from 'react';
import { UserStats } from '../types/User';
import { StatsCards } from './StatsCards';
import { TrendingUp, Users, Calendar, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const recentActivity = [
    {
      type: 'warning',
      message: `${stats.expiringThisWeek} abonnement(s) expire(nt) cette semaine`,
      time: 'Maintenant',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      type: 'info',
      message: `${stats.active} utilisateurs actifs`,
      time: 'Il y a 5 min',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      type: 'success',
      message: 'Système de notification activé',
      time: 'Il y a 1h',
      icon: Calendar,
      color: 'text-green-600'
    }
  ];

  const serviceDistribution = [
    {
      service: 'Netflix',
      count: stats.netflix,
      percentage: stats.total > 0 ? Math.round((stats.netflix / stats.total) * 100) : 0,
      color: 'bg-red-500'
    },
    {
      service: 'Prime Video',
      count: stats.primeVideo,
      percentage: stats.total > 0 ? Math.round((stats.primeVideo / stats.total) * 100) : 0,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vue d'ensemble</h1>
        <p className="text-gray-600">Tableau de bord de gestion des abonnements</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution des services */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Distribution des services
          </h3>
          <div className="space-y-4">
            {serviceDistribution.map((item) => (
              <div key={item.service} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.service}</span>
                  <span className="text-sm text-gray-500">{item.count} utilisateurs ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-green-600" size={20} />
            Activité récente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon size={16} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};