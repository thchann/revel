import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PostStackParamList } from './postNav';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EditCaptionRouteProp = RouteProp<PostStackParamList, 'EditCaption'>;
type NavigationProp = NativeStackNavigationProp<PostStackParamList, 'EditCaption'>;

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditCaptionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditCaptionRouteProp>();
  const [text, setText] = useState(route.params.caption);

  const handleSaveAndGoBack = () => {
    route.params.onCaptionChange(text);
    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      {/* Darker overlay below caption zone */}
      <Pressable onPress={handleSaveAndGoBack} style={styles.overlay} />

      {/* Caption Area */}
      <View style={styles.captionContainer}>
        <View style={styles.headerSpacer} />
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <Text style={styles.headerTitle}>Caption</Text>
          <Pressable onPress={handleSaveAndGoBack} hitSlop={10} style={styles.headerSide}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a caption..."
            placeholderTextColor="#999"
            multiline
            autoFocus
            style={styles.input}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.17, // match height below caption
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.12)', // slightly darker overlay
  },
  captionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.338, // slightly taller caption area
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: Platform.OS === 'ios' ? 58 : 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerSide: {
    width: 55,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  doneText: {
    fontSize: 16,
    color: '#1e1ea1',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 8,
    marginHorizontal: -16,
  },
  scroll: {
    flexGrow: 1,
  },
  input: {
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
    flex: 1,
  },
});
