import React, { useRef, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import ChatBoxItem from '../components/ChatBoxItem';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { chatId, title } = route.params;

  const backPressCount = useRef(0);
  const timeoutRef = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        navigation.replace('LoginScreen');
      }
    };

    checkToken();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (backPressCount.current === 0) {
          backPressCount.current += 1;
          ToastAndroid.show('Nhấn thêm lần nữa để thoát ứng dụng', ToastAndroid.SHORT);

          timeoutRef.current = setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);

          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }

      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
      };
    }, [])
  );

  return (
    <ChatBoxItem
      headerTitle={title}
      chatId={chatId || null}
      onVoicePress={() => navigation.navigate('SummaryScreen', { chatId: chatId })}
      openDrawer={() => navigation.openDrawer()}
    />
  );
};

export default ChatScreen;
