import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ListRenderItem, FlatList } from 'react-native';
import { Event } from '../types/components'; 
import EventCard from '../components/EventCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityPage() {
  const mockEvents: Event[] = [
      {
        id: '1',
        image: require('../assets/spider_man.png'),
        title: 'Epic Party',
        org: 'Kappa Kappa Delta @ Trinity University',
        date: '3/24/2025',
        location: '301 Avenue Lane',
        description: 'The theme is dress to impress. Doors open at 10pm!',
        compact: false,
      },
      {
        id: '2',
        image: require('../assets/spider_man.png'),
        title: "John's Party",
        org: 'Phi Sig @ Trinity University',
        date: '3/30/2025',
        location: '677 Street',
        description: 'come',
        compact: false,
      },
    ];

  const renderItem: ListRenderItem<Event> = ({ item }) => <EventCard {...item} />;

  const filters = ['Friend Requests', 'Party Invites', 'Club Invites'];
  const [activeFilter, setActiveFilter] = useState('Friend Requests');

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}> Activity </Text>
        <View style={styles.filterContainer}> 
          {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                    styles.filter,
                    activeFilter === filter && styles.activeFilter,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                    style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText,
                    ]}
                >
                    {filter}
                </Text>
              </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.container}>
        {activeFilter === 'Friend Requests' && (
            <Text> Friend Requests </Text>
        )}

        {activeFilter === 'Party Invites' && (

            <FlatList
              data={mockEvents}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            />

        )}
        {activeFilter === 'Club Invites' && (
          <Text> Club Invites </Text>
        )}
      </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  filter: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 4,
  },
  filterText: {
    color: 'black',
  },
  activeFilter: {
    backgroundColor: '#161E7A',
    borderColor: '#161E7A',
  },
  activeFilterText: {
    color: 'white',
  },
});
