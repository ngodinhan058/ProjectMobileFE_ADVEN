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
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IconI from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const BiodataScreen = ({ navigation, route }) => {
  // const { userData } = route.params;
  const [formData, setFormData] = useState({
    userPhone: '',
    userBirthday: '',
    userFullName: '',
    userGender: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(userData?.userImagePath);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const userData = await AsyncStorage.getItem('userData');
  //       if (!userData) throw new Error('No user token found');

  //       const { token } = JSON.parse(userData);
  //       const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const userInfo = await response.json();
  //         const userData = userInfo.data;

  //         setFormData({
  //           userPhone: userData.userPhone,
  //           userBirthday: userData.userBirthday
  //             ? new Date(userData.userBirthday).toISOString().slice(0, 10)
  //             : '',
  //           userLastName: userData.userLastName,
  //           userFirstName: userData.userFirstName,
  //           userAddress: userData.address
  //             ? `${userData.address.addressName}, ${userData.address.ward}, ${userData.address.district}, ${userData.address.city}`
  //             : 'No Address Found',
  //         });

  //         setAvatar(userData.userImagePath || null);
  //       } else {
  //         Alert.alert('Error', 'Failed to fetch user information');
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user info:', error);
  //       Alert.alert('Error', 'Failed to fetch user information');
  //     }
  //   };

  //   fetchUserInfo();
  // }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     setLoading(true);
  //     const userData = await AsyncStorage.getItem('userData');
  //     if (!userData) throw new Error('No user token found');

  //     const { token } = JSON.parse(userData);

  //     const formDataToSend = new FormData();

  //     const requestPayload = {
  //       userPhone: formData.userPhone,
  //       userBirthday: formData.userBirthday,
  //       userLastName: formData.userLastName,
  //       userFirstName: formData.userFirstName,
  //     };
  //     formDataToSend.append('request', JSON.stringify(requestPayload));

  //     if (selectedImage) {
  //       const fileType = selectedImage.split('.').pop();

  //       const newFile = {
  //         uri: selectedImage,
  //         name: `user-image.${fileType}`,
  //         type: `image/${fileType}`,
  //       };
  //       formDataToSend.append('image', newFile);
  //     }

  //     const response = await axios.put(
  //       `${BASE_URL}auth/customer/myInfo`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       Alert.alert('Success', 'Profile updated successfully!');
  //       navigation.goBack();
  //     } else {
  //       console.error('Response error data:', response.data);
  //       Alert.alert(
  //         'Error',
  //         `Failed to update profile. Status: ${response.status}`
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     if (error.response) {
  //       console.error('Response error:', error.response.data);
  //     }
  //     Alert.alert('Error', 'Unable to update profile due to a network error.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || userBirthday;
    setShowDatePicker(false);
    handleInputChange('userBirthday', currentDate);
  };

  const hasPermission = (role) =>
    userData?.roles.filter((r) => r.roleName === role);
  const [modalVisible, setModalVisible] = useState(false);

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconI name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account</Text>
          </View>
          {/* Avatar */}


          <ScrollView style={{ flex: 1, marginTop: 30, marginHorizontal: 2 }} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarContainer}>
              {/* <UploadImage
          onImagesSelected={setSelectedImage}
          image={selectedImage}
        /> */}
              <Image
                source={require("../assets/logo.png")}
                style={styles.avatar}
              />

              {/* <Text style={styles.nameText}>{formData.username || 'Tên người dùng'}</Text> */}
            </View>
            {/* Full Name */}
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Nhập Họ Tên Của Bạn"
                value={formData.userFullName}
                onChangeText={(text) => handleInputChange('userFullName', text)}
                keyboardType="phone-pad"
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

            {/* Date of Birth */}
            <Text style={styles.textTitle}>Ngày Sinh: </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={{ paddingVertical: 10, paddingHorizontal: 2 }}>
                <Text>
                  {formData.userBirthday
                    ? new Date(formData?.userBirthday).toLocaleDateString('vi-VN')
                    : 'Nhập Ngày Sinh Của Bạn'}
                </Text>
              </View>
              <IconI name="calendar-outline" size={22} color="#000" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData?.userBirthday)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </ScrollView>

          {/* Update Button */}
          <TouchableOpacity onPress={'save'} style={styles.shadow}>
            <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Sửa Thông Tin Của Bạn</Text>
            </LinearGradient>
          </TouchableOpacity>

          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#3669c9" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
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
    fontSize: 14,
    fontWeight: '600',
  },
});
export default BiodataScreen;