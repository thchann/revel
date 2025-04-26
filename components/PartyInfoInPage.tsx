import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ImageComponent } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type PartyInfoProps = RootStackParamList['PartyPage'];

export default function PartyInfoInPage({
    title,
    org,
    date,
    location,
    description,
    image,
} : PartyInfoProps) {
  return (
    <View style={styles.content}>
        <View style={styles.headerContainer}>
            <View style={styles.headerInfo}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.org}>{org}</Text>
            </View>
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
        </View>
        <View style={styles.mainContentContainer}>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} /> 
            </View>
            <View style={styles.meta}>
                <View style={styles.metaTag}>
                    <Entypo name="calendar" size={14} />
                    <Text style={styles.metaText}>  {date}</Text>
                </View>
                <View style={styles.metaTag}> 
                    <Entypo name="location-pin" size={14} />
                    <Text style={styles.metaText}>  {location}</Text>
                </View>
                <Text style={styles.description}>
                    <Text style={styles.descriptionTitle}>Description: </Text>
                    {description}
                </Text>

            </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 12,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 5,
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    marginRight: 5,
  },
  mainContentContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  meta: {
    flexDirection: 'column',
  },
  metaTag: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 14,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    flexWrap: 'wrap',
    width: '50%',
  },
});
