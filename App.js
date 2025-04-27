import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, RefreshControl } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BE_URL, getToken } from './src/allScreens/api/config';
import API from './src/allScreens/api/axiosInstance';

import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';

// All Home Screen
import LoadingScreen from './src/allScreens/screens/LoadingScreen';
import HomeScreen from './src/allScreens/HomeScreen';
import ChatScreen from './src/allScreens/ChatScreen';
import ProfileScreen from './src/allScreens/ProfileScreen';
import BioScreen from './src/allScreens/BioScreen';
import ResetPasswordScreen from './src/allScreens/ResetPasswordScreen';
import VoiceScreen from './src/allScreens/VoiceScreen';
import SummaryScreen from './src/allScreens/SummaryScreen';

// All Login Screen
import LoginScreen from './src/allScreens/screens/login/LoginScreen';
import InputLoginScreen from './src/allScreens/screens/login/InputLoginScreen';
import SignUpScreen from './src/allScreens/screens/login/SignUpScreen';
import ForgotPasswordScreen from './src/allScreens/screens/login/ForgotPasswordScreen';
import VerifyOTPScreen from './src/allScreens/screens/login/VerifyOTPScreen';




import ModalComponent from './src/components/ModalComponent';


import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();



function CustomDrawerContent(props) {
  const { chats, refreshChats } = props;
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();
  const animatedValues = useRef({}).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(null);
  // const currentRoute = chats[0].id;
  const currentRoute = props.state.routeNames[props.state.index]; // e.g., "chat-2"
  const currentChatId = parseInt(currentRoute.replace("Chat_", ""));
  // const currentRoute = props.state.routeNames[props.state.index];

  const filteredScreens = chats.filter(chat =>
    (chat.name || 'New Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = async (chatId) => {
    setIsModalVisible(false);

    try {
      const res = await API.delete(`/chats/${chatId}`);
      Alert.alert('Thành công', 'Xóa chat thành công!');
      await refreshChats();
      return res.data;
    } catch (error) {
      console.log('Delete error:', error);
      Alert.alert('Lỗi', error.detail || error.message || 'Xóa chat thất bại');
      throw error.response?.data || { message: 'Unknown error deleting chat' };
    }
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await API.get(`/users`);
        setUserData(response.data);
        console.log('User data loaded:', response.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    };

    const timeoutId = setTimeout(() => {
      getUser();
    }, 2000); // delay 2s

    return () => clearTimeout(timeoutId); // cleanup if component unmounts
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await API.get(`/users`);
        setUserData(response.data);
        console.log('User data loaded:', response.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    getUser();
  }, []);
  const handleLogout = async () => {
    try {
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn muốn đăng xuất phải không?',
        [
          {
            text: 'Huỷ',
            style: 'cancel',
          },
          {
            text: 'Đăng Xuất',
            onPress: async () => {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('refreshToken');
              Alert.alert('Thành công', 'Đăng xuất thành công!');
              navigation.replace('LoginScreen');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };
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

            <TouchableOpacity onPress={() => {
              navigation.navigate('ChatScreen', { chatId: null }); // điều hướng
            }}>
              <Ionicons name="duplicate-outline" size={25} color="#2b3356" style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Drawer items list scrolls naturally */}
        <ScrollView style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false} // hoặc state `refreshing`
              onRefresh={async () => {
                try {
                  await refreshChats(); // Gọi hàm reload lại list chats
                } catch (error) {
                  console.log('Refresh error:', error);
                }
              }}
              colors={['#2b3356']} // màu khi đang loading (Android)
              tintColor="#2b3356"    // màu vòng quay (iOS)
            />
          }>
          {filteredScreens.map((screen, index) => {

            const isFocused = currentChatId === screen.id;
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
                          props.navigation.navigate(`Chat_${screen.id}`, { title: screen.name, chatId: screen.id, status: screen.status });
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
                            handleDelete(screen.id)
                          }}
                        >
                          <Ionicons name="trash-outline" size={21} color="white" />
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
            source={{ uri: userData ? `${BE_URL}/${userData.avatar}` : "" }}
            style={{ width: 50, height: 50, marginHorizontal: 8 }}
            resizeMode="contain"
          />

          <Text style={{ fontSize: 16, fontWeight: '500' }}>{userData ? userData.name : ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingRight: 5 }} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={23} color="#f44" />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}


function SidebarNavigator() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const getChats = async () => {
    const token = await getToken();
    console.log(token);

    try {
      const response = await API.get(`/chats`);
      setChats(response.data);

    } catch (err) {
      // console.error('Error fetching chats:', err.response?.data || err.message);
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
        drawerContent={props => <CustomDrawerContent {...props} chats={chats} refreshChats={getChats} />}
      >
        <Drawer.Screen
          name={"AllHomeScreen"}
          component={AllHomeScreen}
        />
        {chats.map((chat) => (
          <Drawer.Screen
            key={chat.id}
            name={`Chat_${chat.id}`}
            children={() => <ChatScreen title={chat.name} chatId={chat.id} status={chat.status} />}
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
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="MainApp" component={SidebarNavigator} />
          <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
          <Stack.Screen name="BioScreen" component={BioScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="InputLoginScreen" component={InputLoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        </Stack.Navigator>
        {/* <AllLoginScreen /> */}
        <Toast />
      </NavigationContainer>
    </>
  );
}




