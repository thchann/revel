import React from 'react';
import { AuthProvider } from '../auth/auth-context';
import { UserProvider } from '../context/UserContext';

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <AuthProvider>
      <UserProvider>
        <OnboardingProvider>
          {children}
        </OnboardingProvider>
      </UserProvider>
     </AuthProvider>
  );
}