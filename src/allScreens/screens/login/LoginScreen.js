import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

// Import video từ thư mục nội bộ
import videoBg from "../../../assets/video.mp4";  // Đường dẫn đúng vào thư mục assets

// Lấy kích thước màn hình để căn chỉnh video
const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
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

        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or continue with</Text>

        <View style={styles.socialContainer}>
          <FontAwesome name="google" size={32} color="#DB4437" style={styles.icon} />
          <FontAwesome name="apple" size={32} color="#000" style={styles.icon} />
          <FontAwesome name="facebook" size={32} color="#1877F2" style={styles.icon} />
        </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 28,
  },
  buttonPrimary: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 15,
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
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonSecondaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default LoginScreen;
