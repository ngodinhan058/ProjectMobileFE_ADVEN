import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

// All Home Screen
import LoadingScreen from './src/allScreens/screens/LoadingScreen';
import HomeScreen from './src/allScreens/HomeScreen';
import ChatScreen from './src/allScreens/ChatScreen';
import ChatEmulatorScreen from './src/allScreens/ChatEmulatorScreen';

// VoiceScreen
import VoiceScreen from './src/allScreens/screens/VoiceScreen';

import ModalComponent from './src/allScreens/components/ModalComponent';


import { jwtDecode } from 'jwt-decode';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const screens = [
  { name: 'Chào hỏi trợ giúp' },
  { name: 'Giải thích bài đọc hiểu' },
  { name: 'Cấu hình Android SDK' },
  { name: 'Gửi văn bản cho GPT' },
  { name: 'Chào hỏi trợ giúp1' },
  { name: 'Giải thích bài đọc hiểu2' },
  { name: 'Cấu hình Android SDK3' },
  { name: 'Gửi văn bản cho GPT4' },
  { name: 'Chào hỏi trợ giúp16' },
  { name: 'Giải thích bài đọc hiểu25' },
  { name: 'Cấu hình Andro6id SDK3' },
  { name: 'Gửi văn bản cho56 GPT4' },
  { name: 'Chào hỏi trợ5 giúp1' },
  { name: 'Giải thích 6bài đọc hiểu2' },
  { name: 'Cấu hình A6ndroid SDK3' },
  { name: 'Gửi văn bả6n cho GPT4' },
];

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const animatedValues = useRef({}).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(null);
  const currentRoute = props.state.routeNames[props.state.index];

  const filteredScreens = screens.filter(screen =>
    screen.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = () => {
    // xử lý xoá ở đây
    console.log('Confirmed delete!');
    setIsModalVisible(false);
  };
  return (
    <>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
          {/* Search input */}
          <TextInput
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              fontSize: 16,
            }}
          />

          {/* Drawer items list scrolls naturally */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {filteredScreens.map((screen, index) => {
              const isFocused = currentRoute === screen.name;
              const isDeleteMode = deleteVisible === screen.name;

              if (!animatedValues[screen.name]) {
                animatedValues[screen.name] = new Animated.Value(0);
              }

              useEffect(() => {
                Object.entries(animatedValues).forEach(([name, anim]) => {
                  Animated.timing(anim, {
                    toValue: deleteVisible === name ? -60 : 0,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                });
              }, [deleteVisible]);

              return (
                <TouchableWithoutFeedback onPress={() => setDeleteVisible(null)} key={index}>
                  <View style={{ overflow: 'hidden', marginVertical: 4, }}>
                    <Animated.View
                      style={{
                        flexDirection: 'row',
                        transform: [{ translateX: animatedValues[screen.name] }],
                      }}
                    >
                      {/* Drawer item */}
                      <TouchableOpacity
                        onPress={() => {
                          if (isDeleteMode) {
                            setDeleteVisible(null);
                          } else {
                            props.navigation.navigate(screen.name);
                            setSearchQuery('');
                            setDeleteVisible(null);
                          }
                        }}
                        onLongPress={() => setDeleteVisible(screen.name)}
                        delayLongPress={300}
                        style={{
                          width: "100%",
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#fafafa',
                          borderRadius: 8,
                          borderTopRightRadius: deleteVisible == screen.name ? 0 : 8,
                          borderBottomRightRadius: deleteVisible == screen.name ? 0 : 8,
                          paddingVertical: 18,
                          paddingHorizontal: 12,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#212121' }}>{screen.name}</Text>
                          <Text style={{ fontSize: 12, color: '#616161' }}>29 Dec 2023 - 09:41 AM</Text>
                        </View>
                        {isFocused ? (<View style={{ width: 12, height: 12, backgroundColor: '#00FF09', borderRadius: 12 }} ></View>)
                          : (<Ionicons name="chevron-forward" size={18} color="#888" />)}

                      </TouchableOpacity>

                      {/* Trash button */}
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
            onPress={() => navigation.navigate('ChatScreen')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={require('./src/assets/logo.png')}
              style={{ width: 50, height: 50, marginHorizontal: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Login</Text>
          </TouchableOpacity>
        </View>
        <ModalComponent
          visible={isModalVisible}
          onConfirm={handleDelete}
          onCancel={() => setIsModalVisible(false)}
        />
      </DrawerContentScrollView>

    </>
  );
}


function SidebarNavigator() {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="AllHomeScreen"
        screenOptions={{ headerShown: false }}
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"AllHomeScreen"}
          component={AllHomeScreen}
        />
        {screens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            children={() => <ChatScreen title={screen.name} />}
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="MainApp" component={SidebarNavigator} />
        <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}



