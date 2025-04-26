// app/index.tsx
// HOME PAGE!

import React from 'react';
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

const mockEvents: Event[] = [
  {
    id: '1',
    image: require('../assets/spider_man.png'),
    title: 'Epic Party',
    org: 'Kappa Kappa Delta @ Trinity University',
    date: '3/24/2025',
    location: '301 Avenue Lane',
    description: 'The theme is dress to impress. Doors open at 10pm!'
  },
  {
    id: '2',
    image: require('../assets/spider_man.png'),
    title: "John's Party",
    org: 'Phi Sig @ Trinity University',
    date: '3/30/2025',
    location: '677 Street',
    description: 'come'
  }
];

export default function HomePage() {
  const renderItem: ListRenderItem<Event> = ({ item }) => <EventCard {...item} />;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Revel!</Text>
      <FilterBar />
      <FlatList
        data={mockEvents}
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
