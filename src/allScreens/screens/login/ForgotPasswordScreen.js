// ForgotPasswordScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BE_URL } from '../../api/config';


const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
        const response = await axios.post(`${BE_URL}/forgot_password`, { email });  // Use BE_URL
        Alert.alert('Success', response.data.message);
      navigation.navigate('VerifyOTPScreen', { email });  // Navigate to OTP verification screen
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An error occurred while sending OTP');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={isLoading}>
        <Text style={styles.buttonText}>Gửi OTP</Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', // màu đen mờ 40%
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // đảm bảo nằm trên hết
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: '#3669c9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
