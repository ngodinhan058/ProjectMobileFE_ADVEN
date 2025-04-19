import React, { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import ChatBoxItem from './components/ChatBoxItem';

const ChatScreen = ({ navigation, title }) => {
  const backPressCount = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show('Nhấn thêm lần nữa để thoát ứng dụng', ToastAndroid.SHORT);

        // Reset lại sau 2 giây
        timeoutRef.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; // chặn thoát app ngay
      } else {
        BackHandler.exitApp(); // thoát app
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
  }, []);

  return (
    <ChatBoxItem
      headerTitle={title}
      onVoicePress={() => navigation.navigate('VoiceScreen')}
    />
  );
};

export default ChatScreen;
