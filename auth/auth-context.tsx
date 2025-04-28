import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';
import { getUserInfo, saveUserToBackend } from '../services/user-service';

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
  const logoutReturnUri = 'yourapp://login';

  const [loginRequest, loginResponse, promptLogin] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      extraParams: { prompt: 'login' },
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
    setAuthFlowStarted(true);
    promptLogin();
  };

  const signupWithAuth0 = () => {
    setAuthFlowStarted(true);
    promptSignup();
  };

  const logoutWithAuth0 = async () => {
    console.log('[Auth] Logging out');
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('activeUserId');
    setToken(null);
    console.log('[Auth] Token cleared');
  };

  const loadToken = async () => {
    console.log('[Auth] Checking for stored token...');
    const stored = await SecureStore.getItemAsync('authToken');
    if (stored) {
      setToken(stored);
      console.log('[Auth] Token restored:', stored);
    } else {
      console.log('[Auth] No token found.');
    }
    setAuthLoading(false);
  };

  useEffect(() => {
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
        console.log('[Auth] Access token received:', accessToken);

        try {
          const profile = await getUserInfo(accessToken);
          console.log('[Auth] Got user info from Auth0:', profile);

          // Save the user to your backend
          await saveUserToBackend(profile);

          // 🆕 Save user locally for UserContext
          await SecureStore.setItemAsync(`userProfile-${profile.sub}`, JSON.stringify({
            username: profile.nickname,
            fullName: profile.name,
          }));

          // 🆕 Save active user ID (needed for later)
          await SecureStore.setItemAsync('activeUserId', profile.sub);

          console.log('[Auth] User profile saved locally');

        } catch (error) {

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