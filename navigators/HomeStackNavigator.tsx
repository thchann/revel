import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/index';
import PartyPage from '../screens/partyPage';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen
        name="PartyPage"
        component={PartyPage}
        options={{
          title: 'Party Info',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
