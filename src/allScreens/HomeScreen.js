import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, 
  FlatList, RefreshControl, TouchableOpacity, Animated, useWindowDimensions, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// import { BASE_URL } from './api/config';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';



const HomeScreen = () => {
 
  return (
    <>
      <Text>asdasdsadasd</Text>
      {/* <AlertComponent
        title={alertType === 'success' ? "Success" : "Error"}
        description={
          alertType === 'success'
            ? titleAlert
            : titleAlert
        }
        alertType={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 16,
  },

  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerPro: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fafafa'
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#fafafa',
  },
  searchBar: {
    margin: 16,
    marginVertical: 20,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  decelerationRate: 0.98,
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    marginLeft: 12,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EEE',
    marginHorizontal: 12,
  },
  filterButton: {
    padding: 8,
  },
  iconCenter: {
    width: 20,
    height: 20,
    position: 'absolute',
    alignContent: 'center',
    top: 10,
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: '70%',
    top: 15,
  },
  whiteSection: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  greySection: {
    backgroundColor: '#fafafa',
    paddingTop: 20,
  },

  categories: {
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#e4f3ea',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  seeAll: {
    color: '#3669c9',
    marginBottom: 10,
    fontSize: 17,
  },
  productList: {
    marginBottom: 20,
  },
  subBanner: {
    backgroundColor: '#d3ffd3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  seeAllButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginTop: 20,
  },
  seeAllText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  skeletonText: {
    height: 200,
    width: '100%',
    marginBottom: 20,

  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

});

export default HomeScreen;