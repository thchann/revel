import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Friend } from '../types/components';
import * as SecureStore from 'expo-secure-store';
import { inviteFriend } from '../services/friend-service';
import Toast from 'react-native-toast-message';

export default function FriendCard({ id, name, username, avatar, type, status, isFriend }: Friend) {
  const handleInvite = async () => {
    try {
      const activeUserId = await SecureStore.getItemAsync('activeUserId');
      if (!activeUserId) return;

      await inviteFriend(activeUserId, id);
      Toast.show({
        type: 'success',
        text1: `Added ${name}`,
      });
    } catch (error) {
      console.error('[FriendCard] Invite failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to send friend request',
      });
    }
  };

  return (
    <View style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <Image source={avatar} style={styles.avatar} />
        <View>
          <Text style={styles.friendName}>{name}</Text>
          <Text style={styles.friendUsername}>{username}</Text>
        </View>
      </View>

      {type === 'status' && (
        <View>
          {status === 'going' && <View style={[styles.circle, { backgroundColor: '#43d177' }]} />}
          {status === 'pending' && <View style={[styles.circle, { backgroundColor: '#f7ef77' }]} />}
          {status === 'unavailable' && <View style={[styles.circle, { backgroundColor: '#d14141' }]} />}
        </View>
      )}

      {type === 'invite' && (
        <TouchableOpacity
          style={[
            styles.inviteButton,
            isFriend && styles.disabledButton
          ]}
          onPress={handleInvite}
          disabled={isFriend}
        >
          <Text style={[styles.inviteText, isFriend && styles.disabledText]}>
            {isFriend ? 'Friend' : 'Invite'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    fontWeight: '600',
    fontSize: 16,
  },
  friendUsername: {
    color: '#888',
    fontSize: 14,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 13,
  },
  inviteButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  inviteText: {
    color: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#ccc',
  },
  disabledText: {
    color: '#999',
  },
});
