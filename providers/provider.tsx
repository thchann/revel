import React from 'react';
import { AuthProvider } from '../auth/auth-context';
import { UserProvider } from '../context/user-context';

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
     </AuthProvider>
  );
}