import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type PartyInfoProps = RootStackParamList['PartyPage'];

export default function PartyInfoInPage({
    title,
    org,
    date,
    location,
    description,
    image,
}: PartyInfoProps) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.meta}>
        <Entypo name="calendar" size={14} />
        <Text style={styles.metaText}>  {date}</Text>
        <Entypo name="location-pin" size={14} style={{ marginLeft: 10 }} />
        <Text style={styles.metaText}>  {location}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>

      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingTop: 0, // <<< REMOVE top padding
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 14,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});
