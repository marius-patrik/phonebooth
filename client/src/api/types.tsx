export interface CallItem {
  id: string;
  calleeID: string;
  countryCode: string;
  price?: number; // cents
  status: 'ringing' | 'connected' | 'hanging' | 'over' | 'failed';
  startTime: string; // ISO date
  endTime?: string; // ISO date
}

export interface RateItem {
  id: string;
  country: string;
  code: string;
  price: number; // cents/min
}

export interface TransactionItem {
  id: string;
  transactionType: string; // deposit, call
  price: number; // cents
  timestamp: string; // ISO date
  displayCurrency: string; // $, €, etc.
}

export interface UserItem {
  id: string;
  currency: string; // USD, EUR, etc.
  displayCurrency: string; // $, €, etc.
  balance: number; // cents/dollars
  email: string; // email
  callerID: number; // phoneNumber
}

export interface LoginItem {
  email: string; // email
}

export interface ContactItem {
  id: number;
  name: string;
  calleeID: number;
  countryCode: string;
  createdAt: string; // ISO date
}
