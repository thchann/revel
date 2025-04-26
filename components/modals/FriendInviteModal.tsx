import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { friendsData } from '../../data/friendsData'; 
import FriendCard from '../../components/FriendCard';

interface FriendInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FriendInviteModal({ visible, onClose }: FriendInviteModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.3}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
            <View style={styles.header}>
                <Text style={styles.title}>Invite a Friend</Text>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            

            <FlatList
                data={friendsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FriendCard {...item} type={'invite'} />}
            />

        
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    container: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    handle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    cancelButton: {
        position: 'absolute',
        right: 0,
        padding: 10,
    },
    cancelText: {
      color: '#161E7A',
      fontWeight: '600',
      fontSize: 14,
    },
  });
  