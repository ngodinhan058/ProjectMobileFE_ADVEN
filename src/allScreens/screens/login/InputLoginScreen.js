import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import IconI from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BE_URL, } from '../../api/config';


const InputLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      const response = await axios.post(`${BE_URL}/login`, {
        email: email,
        password: password
      });

      if (response.status === 201 && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        // Điều hướng tới màn hình chính hoặc dashboard
        navigation.replace('MainApp'); // sửa theo tên màn hình bạn muốn
      } else {
        Alert.alert('Lỗi', 'Đăng nhập thất bại!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Lỗi', 'Tài khoản không tồn tại!');
      } else if (error.response?.status === 403) {
        Alert.alert('Lỗi', 'Mật khẩu không đúng!');
      } else {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ!');
      }
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconI name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Xin Chào 👋</Text>
        <Text style={styles.subtitle}>
          Vui Lòng Nhập Email và Mật Khẩu Của Bạn
        </Text>


        <Text style={styles.label}>Địa Chỉ Email: </Text>
        <View style={styles.input}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Địa Chỉ Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <IconI name="mail-outline" size={22} color="#000" />
        </View>
        <Text style={styles.label}>Mật Khẩu: </Text>
        <View style={styles.input}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Mật Khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <IconI
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#000"
            />
          </TouchableOpacity>
        </View>


        <Text style={styles.loginText}>
          Chưa có tài khoản?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("SignUpScreen")}>
            Đăng Ký
          </Text>
        </Text>
        <Text style={styles.loginText}>
        <Text style={styles.link} onPress={() => navigation.navigate("ForgotPasswordScreen")}>
          Quên Mật Khẩu
        </Text>
      </Text>

      </ScrollView>
      <TouchableOpacity onPress={handleLogin} style={styles.shadow}>
        <LinearGradient
          colors={['#7E92F8', '#6972F0']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    marginHorizontal: 5,
  },

  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  link: {
    color: "#201D67",
    fontWeight: 'bold',
    fontSize: 16,

  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    borderTopWidth: 1,
    borderColor: '#E1E1E1',
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 20,
  },
  continueBtn: {
    backgroundColor: "#4B00FF",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,

  },
  shadow: {
    marginTop: 100,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 7,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InputLoginScreen;
