import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const dummyParties = [
  { id: '1', name: 'Epic Party', date: 'March 24', image: require('../../assets/profile.jpg') },
  { id: '2', name: "John's Bash", date: 'March 30', image: require('../../assets/profile.jpg') },
  { id: '3', name: 'Spring Fest', date: 'April 2', image: require('../../assets/profile.jpg') },
];

export default function PartiesModal() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.y;
    setScrollY(position);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parties ({dummyParties.length})</Text>
      <FlatList
        data={dummyParties}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
        renderItem={({ item }) => (
          <View style={styles.partyRow}>
            <Image source={item.image} style={styles.avatar} />
            <View>
              <Text style={styles.partyName}>{item.name}</Text>
              <Text style={styles.partyDate}>{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    height: 380,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  partyName: {
    fontWeight: '600',
    fontSize: 14,
  },
  partyDate: {
    color: '#888',
    fontSize: 12,
  },
});
