import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { AppRouter } from '../router/AppRouter';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default AppProvider;
