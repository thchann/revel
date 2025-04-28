import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface UserContextType {
  username: string;
  fullName: string;
  setUsername: (name: string) => void;
  setFullName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsernameState] = useState('');
  const [fullName, setFullNameState] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) {
        console.warn('[UserContext] No activeUserId found');
        return;
      }

      const profileRaw = await SecureStore.getItemAsync(`userProfile-${userId}`);
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        if (profile.username) setUsernameState(profile.username);
        if (profile.fullName) setFullNameState(profile.fullName);

        console.log(`[UserContext] Loaded profile for ${userId}`);
      }
    };

    loadUserInfo();
  }, []);

  const setUsername = async (name: string) => {
    setUsernameState(name);
    const userId = await SecureStore.getItemAsync('activeUserId');
    if (!userId) return;
    const profileRaw = await SecureStore.getItemAsync(`userProfile-${userId}`);
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    profile.username = name;
    await SecureStore.setItemAsync(`userProfile-${userId}`, JSON.stringify(profile));
  };

  const setFullName = async (name: string) => {
    setFullNameState(name);
    const userId = await SecureStore.getItemAsync('activeUserId');
    if (!userId) return;
    const profileRaw = await SecureStore.getItemAsync(`userProfile-${userId}`);
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    profile.fullName = name;
    await SecureStore.setItemAsync(`userProfile-${userId}`, JSON.stringify(profile));
  };

  return (
    <UserContext.Provider value={{ username, fullName, setUsername, setFullName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};