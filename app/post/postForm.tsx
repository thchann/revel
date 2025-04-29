//PostForm
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PostStackParamList } from './postNav';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import AddLocationScreen from './addLocation';
import { createEvent } from '../../services/party-service';
import * as SecureStore from 'expo-secure-store';


type FormScreenRouteProp = RouteProp<PostStackParamList, 'PostForm'>;
type NavigationProp = NativeStackNavigationProp<PostStackParamList, 'PostForm'>;

const clubs = ['Personal', 'Chess Club', 'Dance Society', 'Coding Ninjas'];

export default function PostFormScreen() {
  const route = useRoute<FormScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { imageUri } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState('Personal');

  const scrollRef = useRef<ScrollView>(null);
  const modalizeRef = useRef<Modalize>(null);

  const togglePicker = (mode: 'date' | 'time') => {
    if (pickerVisible && pickerMode === mode) {
      setPickerVisible(false);
    } else {
      setPickerMode(mode);
      setPickerVisible(true);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const onChange = (_: any, selected: Date | undefined) => {
    if (selected) {
      const updated = new Date(date);
      if (pickerMode === 'date') {
        updated.setFullYear(selected.getFullYear());
        updated.setMonth(selected.getMonth());
        updated.setDate(selected.getDate());
      } else {
        updated.setHours(selected.getHours());
        updated.setMinutes(selected.getMinutes());
      }
      setDate(updated);
    }
  };

  const onPost = async () => {
    try {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) {
        Alert.alert("Error", "User not logged in");
        return;
      }
  
      const eventData = {
        title,
        date: date.toISOString(),
        location,
        images: imageUri,
        organization: selectedAffiliation !== 'Personal' ? selectedAffiliation : undefined,
        description,
        host: userId,
        attendees: [userId], // host is an attendee
      };
  
      const created = await createEvent(eventData);
      console.log('[onPost] Event successfully created:', created);
  
      Alert.alert("Success", "Your party was posted!");
      navigation.goBack(); // or go to a confirmation screen
    } catch (err) {
      console.error("[onPost] Error creating event:", err);
      Alert.alert("Error", "Failed to post your party.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onPost}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Post</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, description, location, date, imageUri]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.formContainer}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageDescRow}>
            <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            <TouchableOpacity
              onPress={() => navigation.navigate('EditCaption', {
                caption: description,
                onCaptionChange: setDescription,
              })}
              style={styles.captionPreviewBox}
            >
              <Text style={styles.captionPreviewText}>
                {description || 'Write a caption...'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.affiliationScroll}>
              {clubs.map((club) => (
                <TouchableOpacity
                  key={club}
                  style={[
                    styles.affiliationButton,
                    selectedAffiliation === club && styles.affiliationButtonSelected,
                  ]}
                  onPress={() => setSelectedAffiliation(club)}
                >
                  <Text
                    style={[
                      styles.affiliationText,
                      selectedAffiliation === club && styles.affiliationTextSelected,
                    ]}
                  >
                    {club}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Ionicons name="document-text-outline" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Add Title"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Ionicons name="location-outline" size={20} color="#999" style={styles.icon} />
              <TouchableOpacity
  style={[styles.input, { justifyContent: 'center' }]}
  onPress={() =>
    navigation.navigate('AddLocation', {
      location,
      onLocationChange: setLocation,
    })
  }
>
  <Text style={{ color: location ? '#000' : '#999', fontSize: 15 }}>
    {location || 'Add Location'}
  </Text>
</TouchableOpacity>

            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
              <Text style={styles.privacyLabel}>Private Party</Text>
              <View style={{ flex: 1 }} />
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                trackColor={{ false: '#ccc', true: '#1e1ea1' }}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.dateTimeRow}>
            <TouchableOpacity style={styles.dateField} onPress={() => togglePicker('date')}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateField} onPress={() => togglePicker('time')}>
              <Text style={styles.dateText}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {pickerVisible && (
            <DateTimePicker
              value={date}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={pickerMode === 'date' ? new Date() : undefined}
              onChange={onChange}
            />
          )}
        </ScrollView>
      </View>

      <View style={styles.fixedButton}>
        <TouchableOpacity style={styles.postButton} onPress={onPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  imageDescRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  captionPreviewBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 80,
    justifyContent: 'center',
  },
  captionPreviewText: {
    color: '#ccc',
    fontSize: 14,
  },
  section: {
    marginBottom: 10,
    marginTop: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    fontSize: 15,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 15,
    marginBottom: 15,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
    marginTop: 10,
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  fixedButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  postButton: {
    backgroundColor: '#1e1ea1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  privacyLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  affiliationScroll: {
    flexDirection: 'row',
  },
  affiliationButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  affiliationButtonSelected: {
    backgroundColor: '#1e1ea1',
    borderColor: '#1e1ea1',
  },
  affiliationText: {
    fontSize: 14,
    color: '#333',
  },
  affiliationTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  // Modalize styles
  modalContent: {
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  okText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalInput: {
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 120,
  },
});
