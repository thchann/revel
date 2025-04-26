import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import PartyInfoInPage from '../components/PartyInfoInPage';
import { RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friendsData } from '../data/friendsData'; 
import FriendCard from '../components/FriendCard';
import { AntDesign } from '@expo/vector-icons';
import FriendInviteModal from '../components/modals/FriendInviteModal';

type PartyPageRouteProp = RouteProp<RootStackParamList, 'PartyPage'>;

interface Props {
    route: PartyPageRouteProp;
  }

  export default function PartyPage({ route }: Props) {
    const { title, org, date, location, description, image } = route.params;

    const [isFriendPopupVisible, setFriendPopupVisible] = useState(false);

  
    return (
      
        <View style={styles.page}>
          <FriendInviteModal visible={isFriendPopupVisible} onClose={() => setFriendPopupVisible(false)} />
          <View style={styles.partyInfoContainer}>
              <PartyInfoInPage 
                title={title}
                org={org}
                date={date}
                location={location}
                description={description}
                image={image}
              />
          </View>
          <View style={styles.friendList}>
          <Text style={styles.friendListTitle}>Current List (197)</Text>

            <FlatList
              data={friendsData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <FriendCard {...item} type={'status'} />}
            />
          </View>
          <View style={styles.inviteContainer}>
            <TouchableOpacity 
              style={styles.buttonInvite}
              onPress={() => setFriendPopupVisible(true)}
            >
              <AntDesign name="plus" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonRSVP}> 
              <Text style={styles.buttonTextRSVP} > RSVP </Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonReject}> 
            <Text style={styles.buttonTextReject}> Reject </Text> 
            </TouchableOpacity>
          </View>
        </View>
    );
  }
  

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  partyInfoContainer: {
    paddingHorizontal: 10,
  },
  friendList: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    display: 'flex',
    flex: 1,
    paddingBottom: 80,
  },
  friendListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  inviteContainer: {
    position: 'absolute',
    bottom: 80,
    right: 15,
  },
  buttonInvite: {
    backgroundColor: '#161E7A',
    borderRadius: 100,
    padding: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: .5,
    borderTopColor: '#e3e3e3',
  },
  buttonRSVP: {
    backgroundColor: '#161E7A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextRSVP: {
    color: 'white',
    fontSize: 18,
    fontWeight: 500,
  },
  buttonReject: {
    backgroundColor: 'gray',
    borderColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    width: '45%',
    alignItems: 'center',
  },
  buttonTextReject: {
    color: 'white',
    fontSize: 18,
    fontWeight: 500,
  },
});
