import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from './src/screens/api/config';
import * as encoding from 'text-encoding';
import UUID from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

// All Home Screen
import LoadingScreen from './src/allScreens/screens/LoadingScreen';
import HomeScreen from './src/allScreens/HomeScreen';
import ChatScreen from './src/allScreens/screens/allHomeScreen/ChatScreen';
import VoiceInChatScreen from './src/allScreens/screens/allHomeScreen/VoiceScreen';
// All Assistant Screen
import AssistantScreen from './src/allScreens/screens/allAssistantScreen/AssistantScreen';




// VoiceScreen
import VoiceScreen from './src/allScreens/screens/VoiceScreen';


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
  const [showTabBar, setShowTabBar] = useState();

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
           
          }}
        >
          <Tab.Screen name={"HomeScreen"} component={AllHomeScreen} options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{
                position: 'absolute',
                top: 20,
                alignItems: 'center',
              }} >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={23}
                  color={focused ? '#6972F0' : 'gray'}
                ></Ionicons>
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

          <Tab.Screen name={"AssistantScreen"} component={AllAssistantScreen} options={{
             headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }}>
                <Ionicons
                  name="grid-outline"
                  size={23}
                  color={focused ? '#6972F0' : 'gray'}
                ></Ionicons>
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
                <Ionicons
                  name="time-outline"
                  size={23}
                  color={focused ? '#6972F0' : 'gray'}
                ></Ionicons>
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

          <Tab.Screen name={"Search"} component={SearchScreen} options={{
            tabBarIcon: ({ focused }) => (
              <View style={{
                // centring Tab Button...
                position: 'absolute',
                top: 20
              }}>
                <Ionicons
                  name="person-outline"
                  size={23}
                  color={focused ? '#6972F0' : 'gray'}
                ></Ionicons>
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
          <Tab.Screen name={"HomeScreen"} component={AllHomeScreen} options={{ headerShown: false }}></Tab.Screen>

        </Tab.Navigator>
        // }"
      )}
      <Toast />
    </NavigationContainer >

  );
}


function AllHomeScreen() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="VoiceInChatScreen" component={VoiceInChatScreen} />
    </Stack.Navigator>
  );
}

function AllAssistantScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
    </Stack.Navigator>
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
