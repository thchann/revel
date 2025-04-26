// components/EventCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { EventCardProps } from '../types/components';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types/navigation';

const EventCard = ({ image, title, org, date, location, description, compact }: EventCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PartyPage'>>();

  const openPartyPage = () => {
    navigation.navigate('PartyPage', {
      title,
      org,
      date,
      location,
      description,
      image,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openPartyPage}>
      {!compact && 
      <>
      <View style={styles.tag}>
        <Text style={styles.tagText}>Michael Joe has invited you!</Text>
      </View>

      <Image source={image} style={styles.image} /> 
      </>}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.org}>{org}</Text>
        <View style={styles.ratings}>
          <Text style={styles.label}>Safety:</Text>
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <Text style={styles.label}>  Overall:</Text>
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
          <FontAwesome name="star-o" size={16} />
        </View>
        <View style={styles.meta}>
          <Entypo name="calendar" size={14} />
          <Text style={styles.metaText}>  {date}</Text>
          <Entypo name="location-pin" size={14} style={{ marginLeft: 8 }} />
          <Text style={styles.metaText}>  {location}</Text>
        </View>
        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>Description: </Text>{description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#5a4de6',
    zIndex: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  org: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginVertical: 4,
    fontSize: 12,
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
  },
  description: {
    marginTop: 6,
    fontSize: 13,
  },
});

export default EventCard;
