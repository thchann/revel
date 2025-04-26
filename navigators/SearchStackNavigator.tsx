import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchPage from '../screens/search';
import PartyPage from '../screens/partyPage';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchPage} options={{ headerShown: false }} />
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
