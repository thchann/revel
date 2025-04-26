import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Friend } from '../types/components';

export default function FriendCard({ name, username, avatar, type, status }: Friend) {
  return (
    <View style={styles.friendContainer}>
        <View style={styles.friendInfo}>
            <Image source={avatar} style={styles.avatar} />
            <View>
                <Text style={styles.friendName}>{name}</Text>
                <Text style={styles.friendUsername}>{username}</Text>
            </View>
        </View>
        {type === 'status' && (<View>
            {status === 'going' && ( <View style={[styles.circle, { backgroundColor: '#43d177' }]} />)}
            {status === 'pending' && (<View style={styles.statusContainer}>
                <View style={[styles.circle, { backgroundColor: '#f7ef77' }]} />
            </View>)}
            {status === 'unavailable' && (<View style={styles.statusContainer}>
                <View style={[styles.circle, { backgroundColor: '#d14141' }]} />
            </View>)}
        </View>)}
        {type === 'invite' && (<TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteText}> Invite </Text>
        </TouchableOpacity>)}
        
    </View>
    
  );
}

const styles = StyleSheet.create({
    friendContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
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
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
    }
  });
  