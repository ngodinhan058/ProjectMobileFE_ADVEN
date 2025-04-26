import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IconI from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { BE_URL, } from '../../api/config';

const SignUpScreen = ({ navigation, route }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
    userPhone: '',
    userBirthday: '',
    userFullName: '',
    userGender: '',
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = async () => {
    if (!formData.userEmail || !formData.userPassword || !formData.userFullName || !formData.userPhone || !formData.userGender) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BE_URL}/signup`, {
        email: formData.userEmail,
        password: formData.userPassword,
        name: formData.userFullName,
        phone_number: formData.userPhone,
        gender: formData.userGender,
      });

      if (response.status === 201) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
        navigation.goBack(); // hoặc chuyển sang trang đăng nhập
      } else if (response.status === 202) {
        Alert.alert('Thông báo', 'Email người dùng đã tồn tại!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ!');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSelectGender = (value) => {
    handleInputChange('userGender', value);
    setModalVisible(false);
  };
  const renderGenderText = () => {
    switch (formData.userGender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chọn Giới Tính';
    }
  };
  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconI name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Xin Chào 👋</Text>
        <Text style={styles.subtitle}>
          Vui Lòng Nhập Thông Tin Của Bạn Để Bạo Tài Khoản
        </Text>


        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{ flex: 1, marginTop: 30, marginHorizontal: 2 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.textTitle}>Địa Chỉ Email: </Text>
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Địa Chỉ Email"
                value={formData.userEmail}
                onChangeText={(text) => handleInputChange('userEmail', text)}
                keyboardType="email-address"
              />
              <IconI name="mail-outline" size={22} color="#000" />
            </View>
            <Text style={styles.textTitle}>Mật Khẩu: </Text>
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Mật Khẩu"
                value={formData.userPassword}
                onChangeText={(text) => handleInputChange('userPassword', text)}
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
            {/* Full Name */}
            <Text style={styles.textTitle}>Họ Và Tên: </Text>
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Nhập Họ Tên Của Bạn"
                value={formData.userFullName}
                onChangeText={(text) => handleInputChange('userFullName', text)}
              />
              <IconI name="person-outline" size={22} color="#000" />
            </View>

            {/* Phone Number */}
            <Text style={styles.textTitle}>Số Điện Thoại: </Text>
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Nhập Số Điện Thoại Của Bạn"
                value={formData.userPhone}
                onChangeText={(text) => handleInputChange('userPhone', text)}
                keyboardType="phone-pad"
              />
              <IconI name="call-outline" size={22} color="#000" />
            </View>

            {/* Gender */}
            <Text style={styles.textTitle}>Giới Tính: </Text>
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
              <View style={{ paddingVertical: 10, paddingHorizontal: 2 }}>
                <Text style={{ flex: 1, color: formData.userGender ? '#000' : '#999' }}>
                  {renderGenderText()}
                </Text>
              </View>
              <IconI name="chevron-down" size={22} color="#5f5f73" />
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Update Button */}
        <TouchableOpacity onPress={handleSignUp} style={styles.shadow}>
          <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </LinearGradient>
        </TouchableOpacity>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#3669c9" />
          </View>
        )}
      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectGender('male')}>
              <Text>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectGender('female')}>
              <Text>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectGender('other')}>
              <Text>Khác</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20
  },
  logoIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    justifyContent: 'flex-start'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    width: '80%',
    textAlign: 'center'
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
  },
  emailText: {
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ABABAB',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    marginHorizontal: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 5,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 18,
  },
  updateButton: {
    backgroundColor: '#3669c9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  shadow: {
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
});
export default SignUpScreen;