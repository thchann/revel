import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './navigators/RootStackNavigator';
import Providers from './providers/provider';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const load = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setChecking(false);
    };
    load();
  }, []);

  if (checking) return null;

  return (
    <GestureHandlerRootView>
      <Providers>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </Providers>
      <Toast />
    </GestureHandlerRootView>
    
  );
}
