import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from './src/screens/api/config';
import * as encoding from 'text-encoding';
import UUID from 'react-native-uuid';

import HomeScreen from './src/allScreens/HomeScreen';
import LoginScreen from './src/allScreens/screens/login/LoginScreen';
import VoiceScreen from './src/allScreens/screens/VoiceScreen';
import LoadingScreen from './src/allScreens/screens/LoadingScreen';

import plus from './src/assets/logo.png'

import { jwtDecode } from 'jwt-decode';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function getWidth() {
  let width = Dimensions.get("window").width

  // Horizontal Padding = 20...
  width = width - 80

  // Total five Tabs...
  return width / 5
}


export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Action');
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  const [isConnected, setIsConnected] = useState(null);
  const [checkConnected, setCheckConnected] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        setTimeout(() => {
          setCheckConnected(true)
          setCurrentScreen("")
        }, 1500);
      }
    };

    checkConnection();

    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer>
      {checkConnected ? (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 20,
              marginHorizontal: 20,
              height: 60,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowOffset: {
                width: 10,
                height: 10,
              },
              paddingHorizontal: 20,
            },
          }}
        >
          <Tab.Screen name={"Home"} component={AllHomeScreen} options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }} >
                <FontAwesome5
                  name="home"
                  size={20}
                  color={focused ? '#6972F0' : 'gray'}
                ></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true
              }).start();
              setCurrentScreen("")
            }
          })}></Tab.Screen>

          <Tab.Screen name={"Search"} component={SearchScreen} options={{
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }}>
                <FontAwesome5
                  name="search"
                  size={20}
                  color={focused ? '#6972F0' : 'gray'}
                ></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start();
              setCurrentScreen("")
            }
          })}></Tab.Screen>

          <Tab.Screen name={"Action"} component={VoiceScreen} options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: '#6972F0',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS == "android" ? 50 : 30
              }}>
                <FontAwesome5
                  name="microphone"
                  size={20}
                  color={focused ? '#000' : '#fff'}
                ></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              setCurrentScreen("Action")
            }
          })} ></Tab.Screen>

          <Tab.Screen name={"Notifications"} component={NotificationScreen} options={{
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }}>
                <FontAwesome5
                  name="bell"
                  size={20}
                  color={focused ? '#6972F0' : 'gray'}
                ></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true
              }).start();
              setCurrentScreen("")
            }
          })}></Tab.Screen>

          <Tab.Screen name={"Settings"} component={SettingsScreen} options={{
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }}>
                <FontAwesome5
                  name="user-alt"
                  size={20}
                  color={focused ? '#6972F0' : 'gray'}
                ></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true
              }).start();
              setCurrentScreen("")
            }
          })}></Tab.Screen>
          {/* Tab Screens ở đây */}
        </Tab.Navigator>
      ) : (
        // Đừng quan tâm ở dưới chỉ hoạt động ở trên thôi từ "{ ... }"
        // "{
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              display: 'none',
            },
          }}
        >
          <Tab.Screen name={"Home"} component={AllHomeScreen} options={{ headerShown: false }}></Tab.Screen>

        </Tab.Navigator>
        // }"
      )}

      {currentScreen !== 'Action' && (
        <Animated.View
          style={{
            width: getWidth() - 20,
            height: 2,
            backgroundColor: '#6972F0',
            position: 'absolute',
            bottom: 78,
            left: 50,
            borderRadius: 20,
            transform: [{ translateX: tabOffsetValue }]
          }}
        />
      )
      }
    </NavigationContainer >
  );
}


function AllHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,}}>
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search!</Text>
    </View>
  );
}
