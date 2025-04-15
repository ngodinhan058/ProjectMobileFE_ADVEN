import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, } from "react-native";
import { BallIndicator } from 'react-native-indicators';
import { LinearGradient } from 'expo-linear-gradient';
import { LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {
    const navigation = useNavigation();
    const [isConnected, setIsConnected] = useState(null);
    useEffect(() => {
        LogBox.ignoreLogs([
            'A props object containing a "key" prop is being spread into JSX'
        ]);
    }, []);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });
    
        const checkConnection = async () => {
          const state = await NetInfo.fetch();
          if (state.isConnected) {
            setTimeout(() => {
              navigation.replace('HomeScreen');
            }, 1500);
          }
        };
    
        checkConnection();
    
        return () => unsubscribe(); // cleanup
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

export default LoginScreen;
