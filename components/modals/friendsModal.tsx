import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface FriendModalProps {
  id: string;
  name: string;
  username: string;
  avatar: any;
  onRemove: (id: string) => void;
}

export default function FriendsModal({ id, name, username, avatar, onRemove }: FriendModalProps) {
  return (
    <View style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <Image source={avatar} style={styles.avatar} />
        <View>
          <Text style={styles.friendName}>{name}</Text>
          <Text style={styles.friendUsername}>@{username}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(id)} style={styles.removeButton}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  friendName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  friendUsername: {
    color: '#888',
    fontSize: 14,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  removeText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
});
