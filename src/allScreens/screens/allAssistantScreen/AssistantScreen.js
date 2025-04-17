import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, Image, StyleSheet,
  FlatList, RefreshControl, TouchableOpacity, Animated, useWindowDimensions, ImageBackground, Platform
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
// import { BASE_URL } from './api/config';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';



const AssistantScreen = ({ route, }) => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 20,
          height: 60,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          paddingHorizontal: 20,
        },
      });

      return () => {
        parent?.setOptions({ tabBarStyle: { display: 'none' } });
      };
    }, [])
  );
  return (
    <View style={styles.container}>
      {/* Header Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')} // 👈 thay bằng icon bạn đang dùng
          style={styles.logoIcon}
        />
        <Text style={styles.headerTitle}>SpeakEZ AI</Text>
      </View>

      {/* Main Icon */}
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../../../assets/logo.png')} // 👈 thay bằng ảnh chính giữa
          style={styles.mainImage}
        />

        {/* Welcome text */}
        <Text style={styles.appTitle}>Welcome to</Text>
        <Text style={styles.appTitle}>SpeakEZ AI 👋</Text>
        <Text style={styles.description}>
        AssistantScreen. {"\n"}Bạn có thể hỏi tôi bất cứ điều gì.
        </Text>

        {/* Start button */}
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={styles.shadow}>
          <LinearGradient
            colors={['#7E92F8', '#6972F0']}
            style={styles.gradientButton}
          >
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
export default AssistantScreen;