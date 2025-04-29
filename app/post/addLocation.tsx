// AddLocationScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  TextInput, 
} from 'react-native';
import SearchBar from '../search_components/SearchBar'; // adjust path if needed
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PostStackParamList } from './postNav';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GOOGLE_KEY } from '@env';

type NavigationProp = NativeStackNavigationProp<PostStackParamList, 'AddLocation'>;
type RouteProps = RouteProp<PostStackParamList, 'AddLocation'>;

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function AddLocationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [places, setPlaces] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const searchRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');


  const fetchNearbyPlaces = async (coords: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=3000&type=point_of_interest&key=${GOOGLE_KEY}`
      );
      const data = await response.json();
      //console.log('Fetched places:', data.results);
      setPlaces(data.results);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const fetchPlacesBySearch = async (query: string) => {
    if (!location) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&location=${location.latitude},${location.longitude}&radius=3000&key=${GOOGLE_KEY}`
      );
      const data = await response.json();
      setPlaces(data.results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(coords);
    fetchNearbyPlaces(coords);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSelectPlace = (place: any) => {
    route.params.onLocationChange(place.name);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={getCurrentLocation}>
          <Ionicons name="location-sharp" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Locations</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onLocation={true}
        onChange={(text) => {
          setSearchQuery(text);
          if (text.trim().length > 1) {
            fetchPlacesBySearch(text.trim());
          } else if (location) {
            fetchNearbyPlaces(location);
          }
        }}
        onClear={() => {
          setSearchQuery('');
          if (location) fetchNearbyPlaces(location);
        }}
        onCancel={() => {
          setSearchQuery('');
          if (location) fetchNearbyPlaces(location);
        }}
        onFocus={() => {}}
        activeFilter=""
        setActiveFilter={() => {}}
        isSearchActive={false}
      />


      {/* List */}
      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.placeItem} onPress={() => handleSelectPlace(item)}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.vicinity}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.results}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  cancel: {
    fontSize: 16,
    color: '#1e1ea1',
    fontWeight: '600',
  },
  searchWrapper: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  results: {
    paddingBottom: 60,
    paddingTop: 4, // pushes list a little below search input
  },
  placeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  placeAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  

});
