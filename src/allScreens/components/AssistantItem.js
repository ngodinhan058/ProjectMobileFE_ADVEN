import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AssistantItem = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChatAssistantScreen', { title: data.title} )}>
      <View style={styles.cardImg}>
        <Image
          source={data.image} // 🖼️ lấy từ props data
          style={styles.icon}
        />
      </View>

      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: 183,
    height: 226,
    margin: 10,
  },
  cardImg: {
    width: 65,
    height: 65,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default AssistantItem;
