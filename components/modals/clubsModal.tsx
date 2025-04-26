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
import { clubsData } from '../../data/clubsData';

export default function ClubsModal() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.y;
    setScrollY(position);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs ({clubsData.length})</Text>
      <FlatList
        data={clubsData}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
        renderItem={({ item }) => (
          <View style={styles.clubRow}>
            <Image source={item.image} style={styles.avatar} />
            <View>
              <Text style={styles.clubName}>{item.name}</Text>
              <Text style={styles.clubMembers}>{item.members}</Text>
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
  clubRow: {
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
  clubName: {
    fontWeight: '600',
    fontSize: 14,
  },
  clubMembers: {
    color: '#888',
    fontSize: 12,
  },
});
