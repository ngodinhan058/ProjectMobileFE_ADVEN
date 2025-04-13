import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, } from "react-native";
import { SkypeIndicator } from 'react-native-indicators';
  import { LinearGradient } from 'expo-linear-gradient';
  import { LogBox } from 'react-native';
  const LoginScreen = () => {
    useEffect(() => {
        LogBox.ignoreLogs([
            'A props object containing a "key" prop is being spread into JSX'
        ]);
    }, []);
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: 200, height: 200, }} // URL hình ảnh đại diện
            />
            <Text style={styles.text}>Speak EZ</Text>
            <SkypeIndicator color='#6972F0' size={90} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: "20%"
    },
    text: {
        fontSize: 40,
        paddingTop: 50,

        fontFamily: 'Urbanist-Bold',
    }

});

export default LoginScreen;
