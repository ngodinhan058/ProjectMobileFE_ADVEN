import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BE_URL } from '../../api/config';


const VerifyOTPScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BE_URL}/reset_password`, {
        email,
        otp: Number(otp),
        new_password: newPassword,
      });
      Alert.alert('Thành công', response.data.message);
      navigation.navigate('LoginScreen');
    } catch (error) {
      // console.error('Lỗi reset mật khẩu:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        Alert.alert('Lỗi', "Sai Mã OTP");
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt lại mật khẩu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác Thực OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
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
