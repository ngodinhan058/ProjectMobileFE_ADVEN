export const BE_URL = `https://3669-2405-4802-8151-df90-bc4c-3a83-68a1-72ac.ngrok-free.app`;
export const WebView_URL = `https://ngodinhan058.github.io/webview-audio/`;

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('userToken', token);
    
    return token;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
};
