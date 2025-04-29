import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import PartyInfoInPage from '../components/PartyInfoInPage';
import { RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendCard from '../components/FriendCard';
import { AntDesign } from '@expo/vector-icons';
import FriendInviteModal from '../components/modals/FriendInviteModal';
import { fetchEventAttendees, fetchUserById } from '../services/party-service';
import { attendEvent } from '../services/party-service'; 
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { rejectEvent } from '../services/party-service';



type PartyPageRouteProp = RouteProp<RootStackParamList, 'PartyPage'>;

interface Props {
  route: PartyPageRouteProp;
}

export default function PartyPage({ route }: Props) {
  const { id, title, org, date, location, description, image } = route.params;

  const [attendees, setAttendees] = useState<any[]>([]);
  const [isFriendPopupVisible, setFriendPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleRSVP = async () => {
    try {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You must be logged in.',
        });
        return;
      }
  
      // NEW: Check if already attending
      const alreadyAttending = attendees.some((attendee) => attendee.id === userId);
      if (alreadyAttending) {
        Toast.show({
          type: 'info',
          text1: 'Already attending!',
        });
        return;
      }
  
      // If not attending yet, RSVP
      await attendEvent(id, userId);
  
      Toast.show({
        type: 'success',
        text1: `Attending ${title}`,
        text2: `On ${date}`,
      });
  
      navigation.goBack();
    } catch (error) {
      console.error('[PartyPage] RSVP failed:', error);
      Toast.show({
        type: 'error',
        text1: 'RSVP Failed',
        text2: 'Please try again.',
      });
    }
  };
  
  
  const handleReject = async () => {
    try {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You must be logged in.',
        });
        return;
      }
  
      await rejectEvent(id, userId);
  
      Toast.show({
        type: 'success',
        text1: `No longer attending`,
        text2: `${title}`,
      });
  
      navigation.goBack();
    } catch (error) {
      console.error('[PartyPage] Reject failed:', error);
      Toast.show({
        type: 'info',
        text1: `Rejected`,
        text2: `${title}`,
      });
  
      navigation.goBack();
    }
  };
  
  
  



  useEffect(() => {
    const loadAttendees = async () => {
      try {
        const attendeeIds = await fetchEventAttendees(id);
        const attendeeProfiles = await Promise.all(attendeeIds.map((userId: string) => fetchUserById(userId)));
        setAttendees(attendeeProfiles);
      } catch (error) {
        console.error('[PartyPage] Failed to load attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendees();
  }, [id]);

  return (
    <SafeAreaView style={styles.page}>
      <FriendInviteModal visible={isFriendPopupVisible} onClose={() => setFriendPopupVisible(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.partyInfoContainer}>
          <PartyInfoInPage 
            id={id}
            title={title}
            org={org}
            date={date}
            location={location}
            description={description}
            image={image}
          />
        </View>

        <View style={styles.friendListWrapper}>
          <Text style={styles.friendListTitle}>Current List ({attendees.length})</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#161E7A" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={attendees}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <FriendCard {...item} type="status" />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={styles.attendeesList}
              removeClippedSubviews={false}
              nestedScrollEnabled={true}
              

            />
          )}
        </View>

      </ScrollView>

      <View style={styles.inviteContainer}>
        <TouchableOpacity 
          style={styles.buttonInvite}
          onPress={() => setFriendPopupVisible(true)}
        >
          <AntDesign name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonRSVP} onPress={handleRSVP}> 
          <Text style={styles.buttonTextRSVP}> RSVP </Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonReject} onPress={handleReject}> 
          <Text style={styles.buttonTextReject}> Reject </Text> 
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 120,
  },
  partyInfoContainer: {
    paddingHorizontal: 10,
  },
  friendListWrapper: {
    marginTop: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    padding: 10,
    maxHeight: 300, // <<< IMPORTANT: limit height for internal FlatList
  },
  friendListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attendeesList: {
    flexGrow: 0,
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
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 0.5,
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
    fontWeight: '500',
  },
  buttonReject: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonTextReject: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
