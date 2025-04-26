import React, { useState } from 'react';
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
import { useUser } from '../context/UserContext';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../auth/auth-context';
import { friendsData } from '../data/friendsData';
import FriendsModal from '../components/modals/friendsModal';
import PartiesModal from '../components/modals/partiesModal';
import ClubsModal from '../components/modals/clubsModal';


export default function AccountPage() {
  const { username, fullName, setFullName } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(fullName);
  const { logoutWithAuth0 } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'parties' | 'clubs'>('friends');
  const [friends, setFriends] = useState(friendsData);
  

  const handleEdit = () => {
    if (isEditing) setFullName(tempName);
    setIsEditing(!isEditing);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.manage}>Manage</Text>
          </View>
          <TouchableOpacity onPress={logoutWithAuth0} style={styles.logoutButton}>
            <Feather name="log-out" size={16} color="#2E2A80" style={{ marginRight: 4 }} />
            <Text style={styles.logout}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />

        <View style={styles.nameRow}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
            />
          ) : (
            <Text style={styles.name}>{fullName}</Text>
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
              Friends <Text style={{ fontWeight: '700' }}>124</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'parties' && styles.activeTab]}
            onPress={() => setActiveTab('parties')}
          >
            <Text style={[styles.tabText, activeTab === 'parties' && styles.activeTabText]}>
              Parties <Text style={{ fontWeight: '700' }}>12</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'clubs' && styles.activeTab]}
            onPress={() => setActiveTab('clubs')}
          >
            <Text style={[styles.tabText, activeTab === 'clubs' && styles.activeTabText]}>
              Clubs <Text style={{ fontWeight: '700' }}>2</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%' }}>
          {activeTab === 'friends' && (
            <View style={styles.friendContainer}>
              <Text style={styles.friendTitle}>Friends ({friends.length})</Text>
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <FriendsModal
                    id={item.id}
                    name={item.name}
                    username={item.username}
                    avatar={item.avatar}
                    onRemove={(id) => setFriends((prev) => prev.filter((f) => f.id !== id))}
                  />
                )}
              />
            </View>
          )}
        {activeTab === 'parties' && <PartiesModal />}
        {activeTab === 'clubs' && <ClubsModal />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 0,   
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  manage: {
    fontSize: 14,
    color: '#666',
  },
  logout: {
    fontSize: 14,
    color: '#2E2A80',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginTop: 4,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  nameInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    minWidth: 160,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  tabText: {
    fontSize: 14,
    color: '#444',
  },
  activeTab: {
    backgroundColor: '#2E2A80',
  },
  activeTabText: {
    color: '#fff',
  },
  friendContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxHeight: 380,
  },
  friendTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
});