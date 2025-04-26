import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../auth/auth-context';
import { useOnboarding } from '../context/OnboardingContext';
import TabsNavigator from './TabsNavigator';
import LoginScreen from '../app/new_user_components/login';
import WelcomeScreen from '../app/new_user_components/welcome';
import BirthdayScreen from '../app/new_user_components/birthday';
import UsernameScreen from '../app/new_user_components/username';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { token, authLoading } = useAuth();
  const { onboardingComplete } = useOnboarding();
  const isAuthenticated = !!token;

  console.log('🧭 [RootNav] token:', token);
  console.log('🕓 [RootNav] authLoading:', authLoading);
  console.log('🎯 [RootNav] onboardingComplete:', onboardingComplete);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      key={`${isAuthenticated}-${onboardingComplete}`}
      screenOptions={{ headerShown: false }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : !onboardingComplete ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Birthday" component={BirthdayScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Username" component={UsernameScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="Tabs" component={TabsNavigator} options={{headerShown: false}} />
      )}
    </Stack.Navigator>
  );
}