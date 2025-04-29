// app/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import { Event } from '../types/components';
import { fetchAllEvents } from '../services/party-service';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchAllEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('[HomePage] Failed to fetch events:', error);
      }
    };

    loadEvents();
  }, []);

  const renderItem: ListRenderItem<Event> = ({ item }) => <EventCard {...item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Revel!</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
