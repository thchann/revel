import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Friend } from '../types/components';
import { addFriend } from '../services/user-service';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

interface FriendCardProps extends Friend {
  markUserAsFriend: (userId: string) => void;
}

export default function FriendCard({ id, name, username, avatar, type, status, isFriend, markUserAsFriend }: FriendCardProps) {
  const [friendAdded, setFriendAdded] = useState<boolean>(!!isFriend);

  const handleInvite = async () => {
    if (friendAdded) return; // Already a friend, do nothing

    try {
      const activeUserId = await SecureStore.getItemAsync('activeUserId');
      if (!activeUserId) return;

      await addFriend(activeUserId, id);

      Toast.show({
        type: 'success',
        text1: `Added ${name}`,
      });

      setFriendAdded(true); 
      markUserAsFriend(id); // Update the main user list in SearchPage too
    } catch (error) {
      console.error('[FriendCard] Invite failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to add friend',
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

      {type === 'invite' && (
        <TouchableOpacity
          style={[
            styles.inviteButton,
            friendAdded && styles.inviteButtonDisabled,
          ]}
          onPress={handleInvite}
          disabled={friendAdded}
        >
          <Text style={[styles.inviteText, friendAdded && styles.inviteTextDisabled]}>
            {friendAdded ? 'Added' : 'Invite'}
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
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inviteButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  inviteButtonDisabled: {
    backgroundColor: '#e0e0e0', 
    borderColor: '#e0e0e0',
  },
  inviteText: {
    color: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inviteTextDisabled: {
    color: '#aaa',
  },
});
