import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../auth/auth-context';
import TabsNavigator from './TabsNavigator';
import LoginScreen from '../app/new_user_components/login'; // don't forget to import
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { token, authLoading } = useAuth();
  const isAuthenticated = !!token;

  console.log('🧭 [RootNav] token:', token);
  console.log('🕓 [RootNav] authLoading:', authLoading);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Tabs" component={TabsNavigator} />
      )}
    </Stack.Navigator>
  );
}