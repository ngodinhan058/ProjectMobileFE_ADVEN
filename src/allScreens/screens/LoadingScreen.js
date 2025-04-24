import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, } from "react-native";
import { BallIndicator } from 'react-native-indicators';
import { LinearGradient } from 'expo-linear-gradient';
import { LogBox } from 'react-native';
import * as Network from 'expo-network';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    LogBox.ignoreLogs([
      'A props object containing a "key" prop is being spread into JSX'
    ]);
  }, []);
  useEffect(() => {
    const checkConnection = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(status.isConnected);

      if (status.isConnected) {
        setTimeout(() => {
          navigation.replace('MainApp');
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Kết Nối Thất Bại',
          text2: 'Vui Lòng Kiểm Tra Lại Mạng Của Bạn',
          visibilityTime: 20000,
        });
      }
    };

    checkConnection();
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 150, height: 150, }}
      />
      <Text style={styles.text}>Speak EZ</Text>
      <BallIndicator color='#6972F0' size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "50%"
  },
  text: {
    fontSize: 40,
    paddingTop: 50,
    fontWeight: "bold"
  }


});

export default LoadingScreen;
