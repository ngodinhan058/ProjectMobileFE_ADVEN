// config.js
export const BE_URL = `https://cfd9-2405-4802-8151-df90-b175-dfe0-7fca-8ae6.ngrok-free.app`;
export const WebView_URL = `https://ngodinhan058.github.io/webview-audio/`;

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
};
