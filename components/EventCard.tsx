// components/EventCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { EventCardProps } from '../types/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const EventCard = ({ id, image, imageUrl, title, org, date, location, description, compact }: EventCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PartyPage'>>();

  const openPartyPage = () => {
    navigation.navigate('PartyPage', {
      id,
      title,
      org,
      date,
      location,
      description,
      image,
      imageUrl,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openPartyPage}>
      {!compact && (
        <>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            image && <Image source={image} style={styles.image} />
          )}
        </>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

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
