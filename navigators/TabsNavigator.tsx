import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import HomePage from '../screens/index';
import SearchPage from '../screens/search';
import PostPage from '../screens/post';
import ActivityPage from '../screens/activity';
import AccountPage from '../screens/account';
import HomeStackNavigator from './HomeStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';

import NotificationIcon from './NotificationIcon';


const Tab = createBottomTabNavigator();

export default function TabsNavigator() {

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#aaa',
        tabBarShowLabel: false,
      }}
    >
     <Tab.Screen
        name="index"
        component={HomeStackNavigator}
        options={{ 
          title: '', // 👈 this hides just the text/title
          headerShown: true, // 👈 keep the header visible
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="search"
        component={SearchStackNavigator}
        options={{
          headerShown: false,
          title:"",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />          
        ),
        }}
      />
     
      <Tab.Screen
        name="post"
        component={PostPage}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
        ),
        }}
      />

      <Tab.Screen
        name="activity"
        component={ActivityPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (<NotificationIcon 
            size={size}
            color={color}
          />),
        }}
      />

      <Tab.Screen
        name="account"
        component={AccountPage}
        options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
        }}
      />


    </Tab.Navigator>
  );
}

