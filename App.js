import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback,Keyboard } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { BE_URL, token } from './src/allScreens/api/config';

import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';

// All Home Screen
import LoadingScreen from './src/allScreens/screens/LoadingScreen';
import HomeScreen from './src/allScreens/HomeScreen';
import ChatScreen from './src/allScreens/ChatScreen';
import ProfileScreen from './src/allScreens/ProfileScreen';
import BioScreen from './src/allScreens/BioScreen';
import VoiceScreen from './src/allScreens/VoiceScreen';


import ModalComponent from './src/components/ModalComponent';


import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();



function CustomDrawerContent(props) {
  const { chats } = props;

  const navigation = useNavigation();
  const animatedValues = useRef({}).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(null);
  const currentRoute = props.state.routeNames[props.state.index];

  const filteredScreens = chats.filter(chat =>
    (chat.name || 'New Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = () => {
    // xử lý xoá ở đây
    console.log('Confirmed delete!');
    setIsModalVisible(false);
  };

  useEffect(() => {
    Object.entries(animatedValues).forEach(([id, anim]) => {
      Animated.timing(anim, {
        toValue: deleteVisible === parseInt(id) ? -60 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [deleteVisible]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
        {/* Search input */}
        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
          <View style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            borderRadius: 100,
            padding: 10,
            justifyContent: 'center',
            fontSize: 16,
          }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </TouchableWithoutFeedback>

            <Ionicons name="search-outline" size={25} color="#2b3356" style={{ position: 'absolute', right: 15, }} />
          </View>
          <View>

            <TouchableOpacity onPress={() => navigation.navigate(`ChatScreen`, { chatId: null })}>
              <Ionicons name="duplicate-outline" size={25} color="#2b3356" style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Drawer items list scrolls naturally */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {filteredScreens.map((screen, index) => {

            const isFocused = currentRoute === screen.id;
            const isDeleteMode = deleteVisible === screen.id;

            if (!animatedValues[screen.id]) {
              animatedValues[screen.id] = new Animated.Value(0);
            }
            return (
              <TouchableWithoutFeedback onPress={() => setDeleteVisible(null)} key={index}>
                <View style={{ overflow: 'hidden', marginVertical: 4 }}>
                  <Animated.View
                    style={{
                      flexDirection: 'row',
                      transform: [{ translateX: animatedValues[screen.id] }],

                    }}
                  >
                    {/* Drawer item */}
                    <TouchableOpacity
                      onPress={() => {
                        if (isDeleteMode) {
                          setDeleteVisible(null);
                        } else {
                          props.navigation.navigate(`Chat_${screen.id}`, { title: screen.name, chatId: screen.id });
                          setSearchQuery('');
                          setDeleteVisible(null);
                        }
                      }}
                      onLongPress={() => setDeleteVisible(screen.id)}
                      delayLongPress={300}
                      style={{
                        width: "100%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fafafa',
                        borderRadius: 8,
                        borderTopRightRadius: isDeleteMode ? 0 : 8,
                        borderBottomRightRadius: isDeleteMode ? 0 : 8,
                        paddingVertical: 18,
                        paddingHorizontal: 12,
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#212121' }}>{`${screen.name ? screen.name : "New Chat"}`}</Text>
                        <Text style={{ fontSize: 12, color: '#616161' }}>{new Date(screen.time).toLocaleString()}</Text>
                      </View>
                      {isFocused ? (
                        <View style={{ width: 12, height: 12, backgroundColor: '#00FF09', borderRadius: 12 }} />
                      ) : (
                        <Ionicons name="chevron-forward" size={18} color="#888" />
                      )}
                    </TouchableOpacity>

                    {/* Trash button */}
                    {isDeleteMode && (
                      <View
                        style={{
                          width: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                          backgroundColor: "red"
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setDeleteVisible(null);
                            setIsModalVisible(true);
                          }}
                        >
                          <Ionicons name="trash-outline" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>

      </View>

      {/* Fixed login at bottom */}
      <View style={{
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          <Image
            source={require('./src/assets/logo.png')}
            style={{ width: 50, height: 50, marginHorizontal: 8 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Full Name</Text>
        </TouchableOpacity>
      </View>
      <ModalComponent
        visible={isModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </DrawerContentScrollView>
  );
}


function SidebarNavigator() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const getChats = async () => {
    try {
      const response = await axios.get(`${BE_URL}/chats`, {
        headers: {
          Authorization: token,
        },
      });
      setChats(response.data);

    } catch (err) {
      console.error('Error fetching chats:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  // if (loading) {
  //   return null;
  // }


  return (
    <>
      <Drawer.Navigator
        initialRouteName="AllHomeScreen"
        screenOptions={{ headerShown: false }}
        drawerContent={props => <CustomDrawerContent {...props} chats={chats} />}
      >
        <Drawer.Screen
          name={"AllHomeScreen"}
          component={AllHomeScreen}
        />
        {chats.map((chat) => (
          <Drawer.Screen
            key={chat.id}
            name={`Chat_${chat.id}`}
            children={() => <ChatScreen title={chat.name} chatId={chat.id} />}
          />
        ))}

      </Drawer.Navigator>

    </>
  );
}
function AllHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="MainApp" component={SidebarNavigator} />
          <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="BioScreen" component={BioScreen} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </>
  );
}




