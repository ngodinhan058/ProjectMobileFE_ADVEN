import React, { useState } from 'react';
import { View, Text, Alert, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BE_URL, token } from './api/config';

const HomeScreen = ({ title }) => {
  const navigation = useNavigation();

  const startNewChat = async () => {
    try {
      const response = await axios.post(
        `${BE_URL}/chats`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        }
      );

      const data = response.data;

      if (response.status === 201 && data.new_chat_id) {
        console.log(data.new_chat_id);
        
        navigation.navigate(`ChatScreen`, { chatId: data.new_chat_id });
      } else {
        Alert.alert('Không thể tạo cuộc trò chuyện mới');
      }
    } catch (error) {
      console.error('Lỗi tạo chat:', error);
      Alert.alert('Đã xảy ra lỗi khi tạo cuộc trò chuyện');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={require('../assets/logo.png')} style={styles.logoIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/logo.png')} style={styles.mainImage} />
        <Text style={styles.appTitle}>Welcome to</Text>
        <Text style={styles.appTitle}>SpeakEZ AI 👋</Text>
        <Text style={styles.description}>
          Bắt đầu trò chuyện với AI ngay bây giờ. {"\n"}Bạn có thể hỏi tôi bất cứ điều gì.
        </Text>
        <TouchableOpacity onPress={startNewChat} style={styles.shadow}>
          <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Bắt Đầu Trò Chuyện</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,

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
  mainImage: {
    width: 150,
    height: 150,
    marginTop: 80,
    marginBottom: 30,
    resizeMode: 'contain',
  },

  appTitle: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 40,
    paddingHorizontal: 20,
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
  },
});
export default HomeScreen
