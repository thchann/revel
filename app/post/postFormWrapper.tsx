// PostFormWrapper.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PostFormScreen from './postForm';

export default function PostFormWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostFormScreen />
    </GestureHandlerRootView>
  );
}
