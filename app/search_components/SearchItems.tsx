import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../types/components'; 


interface SearchPageProps {
  filteredEvents: Event[];
}

export default function SearchItems({
  filteredEvents,
} : SearchPageProps) {
  
  return (
    <View style={styles.container}>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            image={item.image}
            title={item.title}
            org={item.org}
            date={item.date}
            location={item.location}
            description={item.description}
            compact={true}
          />
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No results</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
