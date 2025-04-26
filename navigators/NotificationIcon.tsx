import React from 'react';
import { useNotificationStore } from '../store/activity'
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    color: string;
    size: number;
}

export default function NotificationIcon({color, size} : Props) {
  const count = useNotificationStore((state) => state.notificationCount);

  return (
    <View>
      <Ionicons name="notifications" size={size} color={color} />
      {count > 0 && 
      ( <View style={styles.badge} > 
          <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      right: -6,
      top: -3,
      backgroundColor: '#FF3B30',
      borderRadius: 20,
      paddingHorizontal: 6,
      paddingVertical: 3,
      minWidth: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });
