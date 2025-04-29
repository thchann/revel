import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import { Event, Friend } from '../types/components'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchItems from '../app/search_components/SearchItems';
import SearchBar from '../app/search_components/SearchBar';
import { fetchAllEvents, fetchAllUsers } from '../services/search-service';
import fuzzysort from 'fuzzysort';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Parties'); // 'Parties' or 'Friends'
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<Friend[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const fetchedEvents = await fetchAllEvents();
          const fetchedUsers = await fetchAllUsers();
  
          const activeUserId = await SecureStore.getItemAsync('activeUserId');
          const activeUser = fetchedUsers.find((user: Friend) => user.id === activeUserId);
          const activeUserFriends = activeUser?.friends || [];
  
          const filteredUsers = fetchedUsers
            .filter((user: Friend) => user.id !== activeUserId)
            .map((user: Friend) => ({
              ...user,
              isFriend: activeUserFriends.includes(user.id),
            }));
  
          setEvents(fetchedEvents);
          setUsers(filteredUsers);
        } catch (error) {
          console.error('[SearchPage] Failed to fetch initial data:', error);
        }
      };
  
      loadData();
    }, [])
  );

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
  }, [searchQuery, activeFilter, users]); // <-- ADD users HERE so when updated, filteredResults are refreshed!

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

  // --- ADD THIS: function to update one user (make them a friend live)
  const markUserAsFriend = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isFriend: true } : user
      )
    );
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
          markUserAsFriend={markUserAsFriend} // <-- PASS IT
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
