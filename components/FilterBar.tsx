import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const filters = ['Type', 'Distance', 'Safety'];

export default function FilterBar() {
  return (
    <View style={styles.filters}>
      {filters.map((filter) => (
        <TouchableOpacity key={filter} style={styles.filterButton}>
          <Text style={styles.filterText}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
  },
});
