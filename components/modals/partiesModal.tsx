import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetchUserEvents, fetchEventById } from '../../services/party-service';

export default function PartiesModal() {
  const [userEvents, setUserEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadUserEvents = async () => {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) return;

      try {
        const eventIds = await fetchUserEvents(userId); // fetch list of event IDs
        const eventDetails = await Promise.all(
          eventIds.map(async (id: string) => {
            try {
              return await fetchEventById(id);
            } catch {
              return null;
            }
          })
        );
        setUserEvents(eventDetails.filter(Boolean));
      } catch (err) {
        console.error('Failed to load user events:', err);
      }
    };

    loadUserEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parties ({userEvents.length})</Text>
      <FlatList
        data={userEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventBox}>
            <Image source={{ uri: item.images || 'https://via.placeholder.com/60' }} style={styles.avatar} />
            <View style={styles.meta}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxHeight: 380,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  eventBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  date: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
