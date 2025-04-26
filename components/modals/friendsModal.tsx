import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface FriendModalProps {
  id: string;
  name: string;
  username: string;
  avatar: any;
  onRemove: (id: string) => void;
}

export default function FriendsModal({ id, name, username, avatar, onRemove }: FriendModalProps) {
  const [showRemove, setShowRemove] = useState(false);

  return (
    <TouchableOpacity onPress={() => setShowRemove((prev) => !prev)} activeOpacity={0.8}>
      <View style={styles.friendRow}>
        <Image source={avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.friendName}>{name}</Text>
          <Text style={styles.friendUsername}>{username}</Text>
        </View>
        {showRemove && (
          <TouchableOpacity onPress={() => onRemove(id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
  removeText: {
    color: '#E63946',
    fontWeight: '600',
    fontSize: 13,
  },
});