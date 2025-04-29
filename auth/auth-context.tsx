import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';
import { getUserInfo, saveUserToBackend, fetchUserByEmail } from '../services/user-service';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
};

interface AuthContextType {
  token: string | null;
  authLoading: boolean;
  userInitialized: boolean;
  loginWithAuth0: () => void;
  signupWithAuth0: () => void;
  logoutWithAuth0: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authFlowStarted, setAuthFlowStarted] = useState(false);
  const [userInitialized, setUserInitialized] = useState(false);
  const [forceSignup, setForceSignup] = useState(false);

  const redirectUri = makeRedirectUri({ native: 'exp://fbfpraq-tchan-8081.exp.direct' });

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
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('activeUserId');
    await SecureStore.deleteItemAsync('userEmail');
    setToken(null);
  };

  const loadToken = async () => {
    const stored = await SecureStore.getItemAsync('authToken');
    if (stored) {
      setToken(stored);
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

        try {
          const profile = await getUserInfo(accessToken);

          await SecureStore.setItemAsync('userEmail', profile.email);

          let userProfileFromBackend;

          if (forceSignup || res === signupResponse) {
            console.log('[Auth] Detected signup flow');
            setForceSignup(false);
            try {
              userProfileFromBackend = await saveUserToBackend(profile);
            } catch (error) {
              console.error('[Auth] User already exists:', error);
              Alert.alert(
                'Account Already Exists',
                'An account with this email already exists. Please log in instead.',
                [
                  {
                    text: 'Login',
                    onPress: () => {
                      loginWithAuth0();
                    },
                  },
                ],
                { cancelable: false }
              );
              return; // <<< THIS IS THE KEY LINE
            }

            const userId = userProfileFromBackend.id;
            await SecureStore.setItemAsync('activeUserId', userId);

            await SecureStore.setItemAsync(`userProfile-${userId}`, JSON.stringify({
              username: profile.nickname,
              fullName: profile.name,
              image: profile.picture,
            }));

            setUserInitialized(true);
            console.log('[Auth] New user stored locally:', userId);

          } else if (res === loginResponse) {
            console.log('[Auth] Detected login flow');
            try {
              userProfileFromBackend = await fetchUserByEmail(profile.email);
            } catch (error) {
              console.error('[Auth] No user found during login:', error);
              Alert.alert(
                'Account Not Found',
                'No account was found with this email. Would you like to sign up or try again?',
                [
                  {
                    text: 'Sign Up',
                    onPress: () => {
                      setForceSignup(true);
                      signupWithAuth0();
                    },
                  },
                  {
                    text: 'Try Again',
                    onPress: async () => {
                      await logoutWithAuth0();
                    },
                    style: 'cancel',
                  },
                ],
                { cancelable: false }
              );
              return;
            }
          }

          if (!userProfileFromBackend) {
            throw new Error('Failed to retrieve user from backend.');
          }

          await SecureStore.setItemAsync('activeUserId', userProfileFromBackend.id);

          const userProfileData = {
            username: profile.nickname,
            fullName: profile.name,
            image: profile.picture,
          };

          console.log('[Auth] Storing user profile locally:', userProfileData);

          await SecureStore.setItemAsync(`userProfile-${userProfileFromBackend.id}`, JSON.stringify(userProfileData));

          const storedProfileRaw = await SecureStore.getItemAsync(`userProfile-${userProfileFromBackend.id}`);
          const storedProfile = storedProfileRaw ? JSON.parse(storedProfileRaw) : null;
          console.log('[Auth] Retrieved stored user profile:', storedProfile);

        } catch (error) {
          console.error('[Auth] Failed during auth response handling:', error);
        }
      } else if (res.type === 'dismiss') {
        console.log('[Auth] Auth popup dismissed');
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('activeUserId');
        await SecureStore.deleteItemAsync('userEmail');
        setToken(null);
      }
      setAuthLoading(false);
    };

    handleAuthResponse();
  }, [loginResponse, signupResponse]);

  return (
    <AuthContext.Provider value={{ token, authLoading, userInitialized, loginWithAuth0, signupWithAuth0, logoutWithAuth0 }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
