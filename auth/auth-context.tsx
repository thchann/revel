import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
} from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
};

interface AuthContextType {
  token: string | null;
  authLoading: boolean;
  loginWithAuth0: () => void;
  signupWithAuth0: () => void;
  logoutWithAuth0: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authFlowStarted, setAuthFlowStarted] = useState(false);
  const redirectUri = makeRedirectUri({ native: 'exp://fbfpraq-tchan-8081.exp.direct' });

  const [loginRequest, loginResponse, promptLogin] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      extraParams: { prompt: 'login' }, // <-- force fresh login
    },
    discovery
  );

  const [signupRequest, signupResponse, promptSignup] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      extraParams: { screen_hint: 'signup', prompt: 'login' },
    },
    discovery
  );

  const loginWithAuth0 = () => {
    console.log('[Auth] Triggering login');
    setAuthFlowStarted(true);
    promptLogin();
  };

  const signupWithAuth0 = () => {
    console.log('[Auth] Triggering signup');
    setAuthFlowStarted(true);
    promptSignup();
  };

  const logoutWithAuth0 = async () => {
    console.log('[Auth] Logging out');
    
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('activeUserId');
    setToken(null);
  
    const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(redirectUri)}`;
  
    // 🛠️ Use openBrowserAsync, NOT openAuthSessionAsync
  };

  const getUserInfo = async (accessToken: string) => {
    const res = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('[Auth] Failed to fetch profile');
    return await res.json();
  };

  useEffect(() => {
    const loadToken = async () => {
      console.log('[Auth] Checking for stored token...');
      const stored = await SecureStore.getItemAsync('authToken');
      if (stored) {
        try {
          const profile = await getUserInfo(stored);
          const userId = profile.sub;
          await SecureStore.setItemAsync('activeUserId', userId);
          setToken(stored);
          console.log('[Auth] Returning user session loaded for', userId);
        } catch {
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('activeUserId');
        }
      } else {
        console.log('[Auth] No token found');
      }
      setAuthLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    const handleAuthResponse = async () => {
      const res = loginResponse || signupResponse;
      if (!res) return;
      setAuthFlowStarted(false);

      if (res.type === 'success' && res.params?.access_token) {
        const accessToken = res.params.access_token;
        await SecureStore.setItemAsync('authToken', accessToken);
        setToken(accessToken);

        try {
          const profile = await getUserInfo(accessToken);
          const userId = profile.sub;
          await SecureStore.setItemAsync('activeUserId', userId);

          const safeUserId = userId.replace(/[^\w.-]/g, '_');

          if (signupResponse && res === signupResponse) {
            await SecureStore.setItemAsync(`onboardingComplete-${safeUserId}`, 'false');
            console.log('[Auth] New user detected. Reset onboarding.');
          }

          const historyRaw = await SecureStore.getItemAsync('sessionHistory');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          const updated = [
            { sub: userId, email: profile.email, timestamp: Date.now() },
            ...history.filter((u: any) => u.sub !== userId),
          ];
          await SecureStore.setItemAsync('sessionHistory', JSON.stringify(updated));
        } catch (e) {
          console.warn('[Auth] Auth success handling failed:', e);
        }
      } else if (res.type === 'dismiss') {
        console.log('[Auth] Auth popup dismissed');
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('activeUserId');
        setToken(null);
      }

      setAuthLoading(false);
    };
    handleAuthResponse();
  }, [loginResponse, signupResponse]);

  return (
    <AuthContext.Provider value={{ token, authLoading, loginWithAuth0, signupWithAuth0, logoutWithAuth0 }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};