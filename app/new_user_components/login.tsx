import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../auth/auth-context';

export default function LoginScreen() {
  const { loginWithAuth0, signupWithAuth0, token } = useAuth();
  const [authActionInProgress, setAuthActionInProgress] = useState(false);

  const handleLogin = async () => {
    console.log('[Login] Login button pressed');
    if (authActionInProgress) {
      console.log('[Login] Auth already in progress...');
      return;
    }
    setAuthActionInProgress(true);
    try {
      await loginWithAuth0();
    } catch (e) {
      console.warn('[Login] Login failed:', e);
    } finally {
      setAuthActionInProgress(false);
    }
  };

  const handleSignup = async () => {
    console.log('[Login] Register button pressed');
    if (authActionInProgress) {
      console.log('[Login] Auth already in progress...');
      return;
    }
    setAuthActionInProgress(true);
    try {
      await signupWithAuth0();
    } catch (e) {
      console.warn('[Login] Signup failed:', e);
    } finally {
      setAuthActionInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Revel!</Text>
        <Text style={styles.subtitle}>An all new way to find parties and clubs near you!</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={authActionInProgress}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleSignup} disabled={authActionInProgress}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        {authActionInProgress && <ActivityIndicator style={{ marginTop: 16 }} />}
        
        {token && (
          <Text style={styles.token}>
            Logged in ✅
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  content: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2c2c6c',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 0,
  },
  buttonGroup: {
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: '#2c2c6c',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2c2c6c',
    alignItems: 'center',
  },
  registerText: {
    color: '#2c2c6c',
    fontWeight: '700',
    fontSize: 18,
  },
  token: {
    textAlign: 'center',
    marginTop: 16,
    color: 'green',
  },
});
