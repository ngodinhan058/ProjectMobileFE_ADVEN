// Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', icon: 'chatbubble-ellipses-outline' },
    { name: 'Search', icon: 'grid-outline' },
    { name: 'Action', icon: 'mic-outline' },
    { name: 'Notifications', icon: 'time-outline' },
    { name: 'Settings', icon: 'person-outline' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(tab.name)}
          style={styles.tabButton}
        >
          <Ionicons
            name={tab.icon}
            size={23}
            color={route.name === tab.name ? '#6972F0' : 'gray'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    height: 60,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 10, height: 10 },
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default Footer;
