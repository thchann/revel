import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  onCancel: () => void;
  onFocus: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isSearchActive: boolean;
  onLocation?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  onCancel,
  onFocus,
  activeFilter,
  setActiveFilter,
  isSearchActive,
  onLocation
}: Props) {

    const filters = ['Parties', 'Clubs', 'Friends'];

    const { height, width } = Dimensions.get('window');
    
    // animated values 
    const cancelOpacity = useRef(new Animated.Value(0)).current;
    const filterOpacity = useRef(new Animated.Value(0)).current;
    const searchBarContainerHeight = useRef(new Animated.Value(55)).current;
    const searchBarWidth = useRef(new Animated.Value(width * .94)).current;

    // handles animation on search bar click, 
    // filters and cancel (opacity) 
    // search bar and header shrink and expand respectively
    const handleFocus = () => {
        onFocus();
        Animated.parallel([
          Animated.timing(cancelOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(filterOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(searchBarContainerHeight, {
            toValue: height * .105,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(searchBarWidth, {
            toValue: width * .8,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      };

      // handles animation on search bar cancel
      // filters and cancel (opacity) 
      // search bar and header expand and shrink respectively
      const handleCancel = () => {
        onCancel();
        Animated.parallel([
          Animated.timing(cancelOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(filterOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(searchBarContainerHeight, {
            toValue: height * .06,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(searchBarWidth, {
            toValue: width * .94,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      };

  return (
    <Animated.View 
        style={[
            styles.searchBarContainer,
            {
                height: searchBarContainerHeight,
            },
        ]}>
            <View style={styles.searchRow}>
                <Animated.View 
                    style={[
                        styles.inputContainer,
                        {
                            width: searchBarWidth,
                        },
                    ]}>
                    <Ionicons name="search" size={18} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        placeholderTextColor="#888"
                        value={value}
                        onChangeText={onChange}
                        onFocus={handleFocus}
                        returnKeyType="search"
                    />
                    {value.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close" size={18} color="#888" />
                    </TouchableOpacity>
                    )}
                </Animated.View>
                <Animated.View style={{ opacity: cancelOpacity}}>
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            {!onLocation && (<Animated.View 
                style={[
                    styles.filterBar,
                    {
                        opacity: filterOpacity,
                    },
                ]}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            activeFilter === filter && styles.activeFilterButton,
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
            </Animated.View>)}  
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    display: 'flex',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    marginLeft: 6,
  },
  icon: {
    marginRight: 4,
  },
  cancel: {
    marginLeft: 10,
    color: '#161E7A',
    fontSize: 16,
  },
  filterBar: {
    flexDirection: 'row',
    paddingLeft: 5,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 6,
  },
  activeFilterButton: {
    backgroundColor: '#161E7A',
    borderColor: '#161E7A',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
  },
});
