import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/user-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../auth/auth-context';
import FriendsModal from '../components/modals/friendsModal';
import PartiesModal from '../components/modals/partiesModal';
import ClubsModal from '../components/modals/clubsModal';
import { fetchUserByEmail } from '../services/user-service'; // changed from fetchUserById
import * as SecureStore from 'expo-secure-store';
import { removeFriendFromBackend } from '../services/friend-service';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserById } from '../services/user-service';

export default function AccountPage() {
  const { username, fullName, setFullName, setUsername } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(fullName);
  const { logoutWithAuth0 } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'parties' >('friends');
  const [friends, setFriends] = useState<any[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // You need to know your own ID


  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log('[AccountPage] Attempting to load profile...');
        const userEmail = await SecureStore.getItemAsync('userEmail');
        console.log('[AccountPage] userEmail:', userEmail);

        if (!userEmail) {
          console.error('[AccountPage] No user email found');
          return;
        }

        const userData = await fetchUserByEmail(userEmail);
        setUserId(userData.id);
        setFullName(userData.name);
        setTempName(userData.name);
        setUsername(userData.email.split('@')[0]);
        setProfileImageUrl(userData.image || null);
        setFriends(userData.friends || []);

        const friendDetails = await Promise.all(
          (userData.friends || []).map(async (friendId: string) => {
            try {
              const friend = await fetchUserById(friendId);
              return {
                id: friend.id,
                name: friend.name,
                username: friend.email.split('@')[0], // assuming no username field
                avatar: friend.image || null,
              };
            } catch (err) {
              console.warn(`Could not fetch friend with id ${friendId}`);
              return null;
            }
          })
        );

        setFriends(friendDetails.filter(f => f));

      } catch (error) {
        console.error('[AccountPage] Failed to load user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleEdit = () => {
    if (isEditing) setFullName(tempName);
    setIsEditing(!isEditing);
  };

  const handleRemoveFriend = async (friendIdToRemove: string) => {
    try {
      const userId = await SecureStore.getItemAsync('activeUserId');
      if (!userId) {
        console.error('[handleRemoveFriend] No userId found');
        return;
      }
  
      // 🔁 Call backend DELETE route to remove one friend
      await removeFriendFromBackend(userId, friendIdToRemove);
  
      // ✅ Update local UI
      const updatedFriends = friends.filter((f: string) => f !== friendIdToRemove);
      setFriends(updatedFriends);
  
      console.log('✅ Friend removed both from backend and UI');
    } catch (error) {
      console.error('❌ Error removing friend:', error);
    }
  };

  const handlePickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // square crop
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setProfileImageUrl(selectedUri); // update local profile picture
        console.log('✅ New profile image selected:', selectedUri);
        
        // Optional future idea:
        // Upload selectedUri to your backend so it persists even after logout
      }
    } catch (error) {
      console.error('❌ Error picking profile image:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>@{username}</Text>
          </View>
          <TouchableOpacity onPress={logoutWithAuth0} style={styles.logoutButton}>
            <Feather name="log-out" size={16} color="#2E2A80" style={{ marginRight: 4 }} />
            <Text style={styles.logout}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handlePickProfileImage}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
          ) : (
            <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
          )}
        </TouchableOpacity>

        <View style={styles.nameRow}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
            />
          ) : (
            <Text style={styles.name}>{tempName}</Text>
          )}
          <TouchableOpacity onPress={handleEdit}>
            <Feather name="edit-3" size={16} color="#444" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
              Friends <Text style={{ fontWeight: '700' }}>{friends.length}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'parties' && styles.activeTab]}
            onPress={() => setActiveTab('parties')}
          >
            <Text style={[styles.tabText, activeTab === 'parties' && styles.activeTabText]}>
              Parties
            </Text>
          </TouchableOpacity>

        </View>

        <View style={{ width: '100%' }}>
          {activeTab === 'friends' && (
            <View style={styles.friendContainer}>
              <Text style={styles.friendTitle}>Friends ({friends.length})</Text>
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                renderItem={({ item }) => (
                  <FriendsModal
                    id={item.id}
                    name={item.name}
                    username={item.username}
                    avatar={item.avatar ? { uri: item.avatar } : require('../assets/profile.jpg')}
                    onRemove={handleRemoveFriend}
                  />
                )}
              />
            </View>
          )}
          {activeTab === 'parties' && <PartiesModal />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 0, backgroundColor: '#fff', alignItems: 'center', marginTop: 16 },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  username: { fontSize: 20, fontWeight: '700' },
  manage: { fontSize: 14, color: '#666' },
  logout: { fontSize: 14, color: '#2E2A80', fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 4, marginTop: 4 },
  profileImage: { width: 130, height: 130, borderRadius: 65, marginBottom: 12, borderWidth: 1,              // ⬅ adds a thin border
  borderColor: 'rgba(0,0,0,0.2)', },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  name: { fontSize: 18, fontWeight: '600' },
  nameInput: { fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 4, minWidth: 160 },
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee' },
  tabText: { fontSize: 14, color: '#444' },
  activeTab: { backgroundColor: '#2E2A80' },
  activeTabText: { color: '#fff' },
  friendContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '100%', maxHeight: 380, borderWidth:1, borderColor: 'rgba(117, 115, 115, 0.18)' },
  friendTitle: { fontWeight: '700', fontSize: 16, marginBottom: 12 },
});
