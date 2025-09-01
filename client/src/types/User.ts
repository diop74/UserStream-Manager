export interface User {
  id: string;
  name: string;
  email: string;
  service: 'Netflix' | 'PrimeVideo';
  subscriptionDate: string;
  validityMonths: number;
  expirationDate: string;
  status: 'Active' | 'Expired';
}

export interface UserStats {
  total: number;
  active: number;
  expired: number;
  netflix: number;
  primeVideo: number;
  expiringThisWeek: number;
}