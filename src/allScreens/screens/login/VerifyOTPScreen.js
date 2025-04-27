import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BE_URL } from '../../api/config';


const VerifyOTPScreen = ({ route, navigation }) => {
  const { email } = route.params;
  
  // Log email để kiểm tra
  console.log('Email:', email);

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }
  
    setIsLoading(true);
    try {
      console.log('Sending OTP:', otp); // Debug log
      console.log('Sending new password:', newPassword); // Debug log
      const response = await axios.post(`${BE_URL}/reset_password`, {
        email,
        otp,
        new_password: newPassword,
      });
      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');  // Navigate back to login after password reset
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        console.log('Error response:', error.response.data);  // Debug log
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An error occurred while resetting password');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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

export default VerifyOTPScreen;
