// postNav.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageSelectorScreen from './imageSelect';
import EditCaptionScreen from './editCaption';
import { Text, TouchableOpacity } from 'react-native';
import PostFormWrapper from './postFormWrapper';
import AddLocationScreen from './addLocation';


export type PostStackParamList = {
  ImageSelector: undefined;

  PostForm: { imageUri: string; onPost?: () => void };
  EditCaption: {
    caption: string;
    onCaptionChange: (newCaption: string) => void;
  };

  AddLocation: {
    location: string;
    onLocationChange: (newAddress: string) => void;
  };
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function PostNavigator() {
  return (
    <Stack.Navigator initialRouteName="ImageSelector">
      <Stack.Screen
        name="ImageSelector"
        component={ImageSelectorScreen}
        options={{
          title: 'Select Image',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: '700',
          },
        }}
      />
      <Stack.Screen
        name="PostForm"
        component={PostFormWrapper}
        options={({ route }) => ({
          title: 'Create Party',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: '700',
          },
          headerRight: () => (
            <TouchableOpacity onPress={route.params?.onPost}>
              <Text style={{ color: '#1e1ea1', fontSize: 16 }}>Post</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditCaption"
        component={EditCaptionScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddLocation"
        component={AddLocationScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false, // you'll build a custom header
        }}
      />

    </Stack.Navigator>
  );
}
