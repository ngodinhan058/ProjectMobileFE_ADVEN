import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from './src/screens/api/config';
import * as encoding from 'text-encoding';
import UUID from 'react-native-uuid';

import HomeScreen from './src/allScreens/HomeScreen';
import LoginScreen from './src/allScreens/screens/login/LoginScreen';
import VoiceScreen from './src/allScreens/screens/VoiceScreen';



import { jwtDecode } from 'jwt-decode';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();






export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={VoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
