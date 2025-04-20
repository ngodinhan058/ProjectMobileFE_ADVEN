import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const AlertComponent = ({
  title,
  description,
  alertType,
  visible,
  onClose,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Opacity animation
  const [translateYAnim] = useState(new Animated.Value(0)); // Slide animation

  useEffect(() => {
    if (visible) {
      // Hiện alert với animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 2 giây sau, tự động ẩn alert
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20, // Đi lên trên
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onClose) onClose(); // Gọi hàm onClose sau khi ẩn
        });
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      // Ẩn ngay khi visible = false
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Kiểm tra kiểu alert và áp dụng style cho tương ứng
  const alertStyles =
    alertType === 'error' ? styles.errorAlert : styles.successAlert;

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        alertStyles, // Style cho error hoặc success
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Kiểm tra kiểu alert để chọn icon */}
        {alertType === 'error' ? (
          <Icon name="alert-circle-outline" size={30} color="#fff" />
        ) : (
          <Icon name="checkmark-circle-outline" size={30} color="#fff" />
        )}
        <Text style={styles.alertDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 999,
  },
  errorAlert: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
    borderWidth: 1,
    color: '#fff',
  },
  successAlert: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
    borderWidth: 1,
    color: '#fff',
  },
  // alertTitle: {
  //     fontWeight: 'bold',
  //     fontSize: 16,
  //     marginBottom: 8,
  //     color: '#fff',
  // },
  alertDescription: {
    flexWrap: 'wrap',
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AlertComponent;
