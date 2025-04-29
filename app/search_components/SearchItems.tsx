import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import EventCard from '../../components/EventCard';
import FriendCard from '../../components/FriendCard';
import { Event, Friend } from '../../types/components';

interface SearchItemsProps {
  filteredItems: (Event | Friend)[];
  activeFilter: string;
}

export default function SearchItems({
  filteredItems,
  activeFilter,
}: SearchItemsProps) {
  const renderItem = ({ item }: { item: any }) => {
    if (activeFilter === 'Parties') {
      return (
        <EventCard
          id={item.id}
          image={item.image}           // for hardcoded
          imageUrl={item.imageUrl}     // for fetched from DB
          title={item.title}
          org={item.org}
          date={item.date}
          location={item.location}
          description={item.description}
          compact={true}
        />
      );
    } else if (activeFilter === 'Friends') {
      return (
      <FriendCard
        id={item.id}
        name={item.name}
        username={item.username}
        avatar={item.avatar}
        type="invite" // <<< ADD THIS
        status="pending"
      />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
