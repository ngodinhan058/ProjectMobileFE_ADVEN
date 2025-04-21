import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, Modal } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileSrceen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  handleLogout
  const handleSelectGender = (value) => {
    handleInputChange('userGender', value);
    setModalVisible(false);
  };
  const handleLogout = () => {
    console.log("Logout");
    setModalVisible(false);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        {/* User Info */}
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.5} onPress={() => navigation.navigate('BioScreen')}>
          <View style={{ justifyContent: 'space-between', flexDirection: "row", alignItems: 'center' }}>
            <Image
              source={require("../assets/logo.png")} // Bạn có thể thay ảnh avatar bằng ảnh thực tế
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>Full Name</Text>
              <Text style={styles.email}>email_example@gmail.com</Text>
            </View>
          </View>
          <View style={styles.settingLeft}>
            <Ionicons name="chevron-forward" size={20} color="#000" />
          </View>
        </TouchableOpacity>
        {/* General Settings */}
        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem icon="person-outline" label="Thông Tin Người Dùng" navi="BioScreen" />
        <SettingItem icon="shield-checkmark-outline" label="Security" />
        <SettingItem icon="language-outline" label="Ngôn Ngữ" value="Tiếng Việt" />
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="eye-outline" size={20} color="#000" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem icon="help-circle-outline" label="Help Center" />
        <SettingItem icon="lock-closed-outline" label="Privacy Policy" />
        <SettingItem icon="information-circle-outline" label="About Speak EZ" />

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={() => setModalVisible(true)}>
          <Ionicons name="log-out-outline" size={20} color="#f44" />
          <Text style={styles.logoutText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.containerLog}>
            <View style={{ width: '100%', borderBottomWidth: 1, borderColor: '#EEEEEE', marginBottom: 24, marginTop: 16 }}>
              <Text style={styles.title}>Đăng Xuất</Text>
            </View>
            <Text style={styles.message}>Bạn có chắc muốn đăng xuất không?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtnModal} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelTextModal}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtnModal} onPress={handleLogout}>
                <Text style={styles.logoutTextModal}>Đăng Xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const SettingItem = ({ icon, label, value, navi }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.settingItem} onPress={navi ? () => navigation.navigate(navi) : ""}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color="#000" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20
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

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'space-between'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  email: {
    color: '#ccc',
  },

  sectionTitle: {
    color: '#aaa',
    fontWeight: '600',
    marginVertical: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,

  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingLabel: {
    color: '#000',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  settingValue: {
    color: '#aaa',
    marginRight: 10,
    fontSize: 14,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: '#f44',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  containerLog: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtnModal: {
    flex: 1,
    backgroundColor: '#eef1f9',
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 8,
    alignItems: 'center',
  },
  logoutBtnModal: {
    flex: 1,
    backgroundColor: '#6A5AE0',
    paddingVertical: 12,
    borderRadius: 30,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelTextModal: {
    color: '#6A5AE0',
    fontWeight: '600',
  },
  logoutTextModal: {
    color: '#fff',
    fontWeight: '600',
  },
});
export default ProfileSrceen
