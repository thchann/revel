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
    <View style={styles.friendRow}>
      <Image source={avatar} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.friendName}>{name}</Text>
        <Text style={styles.friendUsername}>{username}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(id)} style={styles.removeButton}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    fontWeight: '600',
    fontSize: 14,
  },
  friendUsername: {
    color: '#888',
    fontSize: 12,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E63946',
    borderRadius: 6,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
