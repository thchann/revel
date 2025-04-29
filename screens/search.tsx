import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import { Event, Friend } from '../types/components'; 
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchItems from '../app/search_components/SearchItems';
import SearchBar from '../app/search_components/SearchBar';

import { fetchAllEvents, fetchAllUsers } from '../services/search-service'; // <- NEW IMPORT
import fuzzysort from 'fuzzysort';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Parties'); // 'Parties' or 'Friends'
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<Friend[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedEvents = await fetchAllEvents();
        const fetchedUsers = await fetchAllUsers();
        setEvents(fetchedEvents);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('[SearchPage] Failed to fetch initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      if (activeFilter === 'Parties') {
        const results = searchInEvents(searchQuery);
        setFilteredResults(results);
      } else if (activeFilter === 'Friends') {
        const results = searchInUsers(searchQuery);
        setFilteredResults(results);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, activeFilter]);

  const searchInEvents = (query: string): Event[] => {
    if (query.trim().length === 0) return [];
    const results = fuzzysort.go(query, events, { key: 'title', threshold: -1000 });
    return results.map(res => res.obj);
  };

  const searchInUsers = (query: string): Friend[] => {
    if (query.trim().length === 0) return [];
    const results = fuzzysort.go(query, users, { key: 'name', threshold: -1000 });
    return results.map(res => res.obj);
  };

  const onCancelSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <SearchBar
        value={searchQuery}
        onChange={handleSearch}
        onClear={() => setSearchQuery('')}
        onCancel={onCancelSearch}
        onFocus={() => setIsSearchActive(true)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isSearchActive={isSearchActive}
      />

      {isSearchActive && (
        <SearchItems 
          filteredItems={filteredResults}
          activeFilter={activeFilter}
        />
      )}

      {!isSearchActive && (
        <View style={styles.searchContainer}>
          <Text style={styles.searchContainerText}>
            Click the search bar to find parties and friends!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  searchContainerText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
