import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import { Event } from '../types/components'; 
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchItems from '../app/search_components/SearchItems';
import SearchBar from '../app/search_components/SearchBar';

import fuzzysort from 'fuzzysort';

export default function SearchPage() {
  const mockEvents: Event[] = [
    {
      id: '1',
      image: require('../assets/spider_man.png'),
      title: 'Epic Party',
      org: 'Kappa Kappa Delta @ Trinity University',
      date: '3/24/2025',
      location: '301 Avenue Lane',
      description: 'The theme is dress to impress. Doors open at 10pm!',
      compact: true,
    },
    {
      id: '2',
      image: require('../assets/spider_man.png'),
      title: "John's Party",
      org: 'Phi Sig @ Trinity University',
      date: '3/30/2025',
      location: '677 Street',
      description: 'come',
      compact: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState(''); // user inputted data in search bar
  const [activeFilter, setActiveFilter] = useState('Parties'); // current thing the user is searching for
  const [filteredResults, setFilteredResults] = useState<Event[]>([]); // data that is being searched
  
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(true);
  };
  
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      if (activeFilter === 'Parties') {
        const results = search(searchQuery);
        setFilteredResults(results);
        
      } else if (activeFilter === 'Clubs' || activeFilter === 'Friends') {
        setFilteredResults([]); 
        //setIsSearchActive(false);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, activeFilter]); 
  
  const search = (query: string): Event[] => {
    if (query.trim().length === 0) return [];
  
    const results = fuzzysort.go(query, mockEvents, {
      key: 'title',
      threshold: -1000,
    });
  
    return results.map(res => res.obj);
  };

  const onCancelSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
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
            filteredEvents={filteredResults}
          />
        )}

        {!isSearchActive && (
          <View style={styles.searchContainer}>
            <Text style={styles.searchContainerText}>
              Click the search bar to find parties, clubs, and friends!
            </Text>
          </View>
        )}
    </SafeAreaView>
  )  
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  searchContainerText: {
    textAlign: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  activeFilterButton: {
    backgroundColor: '#161E7A',
    borderColor: '#161E7A',
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 600,
  },
  activeFilterText: {
    color: '#fff',
  },
});

