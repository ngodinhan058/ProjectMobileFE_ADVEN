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
import IconI from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import API from './api/axiosInstance';
import { BE_URL } from './api/config';
import * as ImagePicker from 'expo-image-picker'; // thêm dòng này nha

const BiodataScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    userPhone: '',
    userBirthday: '',
    userFullName: '',
    userGender: '',
  });
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await API.get(`/users`);
        setUserData(response.data);
        setFormData({
          userFullName: response.data.name || '',
          userPhone: response.data.phone_number || '',
          userGender: response.data.gender || '',
        });
        console.log('User data loaded:', response.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    };
    getUser();
  }, []);


  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectGender = (value) => {
    handleInputChange('userGender', value);
    setModalVisible(false);
  };
  const renderGenderText = () => {
    if (userData?.gender === 'male') {
      return 'Nam';
    } else if (userData?.gender === 'female') {
      return 'Nữ';
    }
    return 'Chưa chọn';
  };



  // Thêm hàm chọn ảnh
  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Bạn cần cấp quyền truy cập thư viện ảnh để chọn avatar.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setAvatar(pickerResult.assets[0]); // ảnh mới chọn
    }
  };

  // Hàm lưu thông tin
  const handleSave = async () => {
    setLoading(true);
    try {
      // Gửi form thông tin user
      await API.put('/users', {
        name: formData.userFullName || userData?.name,
        phone_number: formData.userPhone || userData?.phone_number,
        gender: formData.userGender || userData?.gender,
      });

      // Nếu có chọn avatar mới
      if (avatar) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('file', {
          uri: avatar.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });

        await API.put('/avatars', formDataAvatar, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      navigation.goBack();
    } catch (error) {
      console.log('Lỗi update:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
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
              <TouchableOpacity onPress={handlePickAvatar}>
                <Image
                  source={
                    avatar
                      ? { uri: avatar.uri }
                      : userData?.avatar
                        ? { uri: `${BE_URL}/${userData.avatar}` }
                        : require("../assets/image.png")
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>

              {/* <Text style={styles.nameText}>{formData.username || 'Tên người dùng'}</Text> */}
            </View>
            {/* Full Name */}
            <View style={styles.input}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Nhập Họ Tên Của Bạn"
                value={formData.name}
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
                value={formData.phone_number}
                onChangeText={(text) => handleInputChange('userPhone', text)}
                keyboardType="phone-pad"
              />
              <IconI name="call-outline" size={22} color="#000" />
            </View>

            {/* Gender */}
            <Text style={styles.textTitle}>Giới Tính: </Text>
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
              <View style={{ paddingVertical: 10, paddingHorizontal: 2 }}>
                <Text style={{ flex: 1, color: formData.gender ? '#000' : '#999' }}>
                  {renderGenderText()}
                </Text>
              </View>
              <IconI name="chevron-down" size={22} color="#5f5f73" />
            </TouchableOpacity>

          </ScrollView>

          {/* Update Button */}
          <TouchableOpacity onPress={handleSave} style={styles.shadow}>
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