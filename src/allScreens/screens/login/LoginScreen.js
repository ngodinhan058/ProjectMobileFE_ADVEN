import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

// Import video từ thư mục nội bộ
import videoBg from "../../../assets/video.mp4";  // Đường dẫn đúng vào thư mục assets
import { useNavigation } from '@react-navigation/native';


// Lấy kích thước màn hình để căn chỉnh video
const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Video nền */}
      <Video
        source={videoBg}  // Sử dụng video từ thư mục nội bộ
        style={styles.video}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping={true}  // Tự động lặp lại video
      />

      {/* Overlay làm mờ video (tuỳ chỉnh độ mờ) */}
      <View style={styles.overlay} />

      {/* Nội dung giao diện đăng nhập */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>
          SpeakEZ AI <Text style={styles.emoji}>👋</Text>
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("InputLoginScreen")}>
          <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("SignUpScreen")}>
          <Text style={styles.buttonSecondaryText}>Đăng Ký</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: "absolute",
    width: width,
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Điều chỉnh độ mờ của overlay
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  appName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 34,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 130,
    borderRadius: 30,
    marginVertical: 20,
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 140,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonSecondaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
