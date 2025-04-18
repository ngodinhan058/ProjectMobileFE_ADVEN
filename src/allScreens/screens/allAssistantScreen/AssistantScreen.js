import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AssistantItem from '../../components/AssistantItem';
import { ScrollView } from 'react-native-gesture-handler';

const AssistantAIScreen = ({ route, navigation }) => {
  const assistantData = [
    {
      category: 'Writing',
      items: [
        {
          id: '1',
          title: 'Write an Articles',
          description: 'Generate well-written articles on any topic you want.',
          image: require('../../../assets/writing.png'),
        },
        {
          id: '2',
          title: 'Summarize (TL;DR)',
          description: 'Extract key points from long texts.',
          image: require('../../../assets/writing.png'),
        },
        {
          id: '3',
          title: 'Game Test Ex',
          description: 'Extract key points from long texts.',
          image: require('../../../assets/writing.png'),
        },
      ],
    },
    {
      category: 'Creative',
      items: [
        {
          id: '3',
          title: 'Storyteller',
          description: 'Generate stories from any given topic.',
          image: require('../../../assets/writing.png'),
        },
        {
          id: '4',
          title: 'Poems',
          description: 'Generate poems in different styles.',
          image: require('../../../assets/writing.png'),
        },
      ],
    },
    {
      category: 'Game',
      items: [
        {
          id: '1',
          title: 'Write an Articles',
          description: 'Generate well-written articles on any topic you want.',
          image: require('../../../assets/writing.png'),
        },
        {
          id: '2',
          title: 'Summarize (TL;DR)',
          description: 'Extract key points from long texts.',
          image: require('../../../assets/writing.png'),
        },
      ],
    },

  ];


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
  const layout = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const getItemLayout = (data, index) => ({
    length: 30, // Chiều cao của mỗi item (cần thay đổi theo chiều cao thực tế của item)
    offset: 150 * index, // Offset dựa trên index của item
    index,
  });



  const AllRoute = () => {
    // Gộp tất cả các items trong tất cả category
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 70, marginTop: 50 }}>
        {assistantData.map((assistantItem) => (
          <View key={assistantItem.category} style={{ marginBottom: 20 }}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>{assistantItem.category}</Text>
            <FlatList
              data={assistantItem?.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <AssistantItem data={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
              }
            />
          </View>
        ))}
      </ScrollView>

    );
  };

  const WritingRoute = () => {
    const writingCategory = assistantData.find(cat => cat.category === 'Writing');
    return (
      <FlatList
        data={writingCategory?.items || []}
        renderItem={({ item }) => <AssistantItem data={item} />}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
        }
      />
    );
  };

  const CreativeRoute = () => {
    const creativeCategory = assistantData.find(cat => cat.category === 'Creative');
    return (
      <FlatList
        data={creativeCategory?.items || []}
        renderItem={({ item }) => <AssistantItem data={item} />}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
        }
      />
    );
  };





  // State để quản lý tab hiện tại
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'writing', title: 'Viết Văn' },
    { key: 'creative', title: 'Sáng Tạo' },


  ]);
  useEffect(() => {
    const { initialRoute } = route?.params || {};
    if (initialRoute) {
      const tabIndex = routes.findIndex(r => r.key === initialRoute);
      if (tabIndex !== -1) {
        setIndex(tabIndex);
      }
    } else {
      setIndex(0);
    }
  }, [route.params]);

  useEffect(() => {
    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.3,
      });
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')} // 👈 thay bằng icon bạn đang dùng
          style={styles.logoIcon}
        />
        <Text style={styles.headerTitle}>SpeakEZ AI</Text>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          all: AllRoute,
          writing: WritingRoute,
          creative: CreativeRoute,
        })}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <FlatList
            style={{ position: 'absolute', zIndex: 99 }}
            ref={flatListRef}
            data={props.navigationState.routes}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index: tabIndex }) => (
              <TouchableOpacity onPress={() => props.jumpTo(item.key)} style={{ paddingHorizontal: 10, }}>
                <Text style={{
                  color: tabIndex === props.navigationState.index ? '#fff' : '#000', width: 'auto', height: 30, backgroundColor: tabIndex === props.navigationState.index ? '#6972F0' : '#fafafa',
                  paddingHorizontal: 20, lineHeight: 28, borderRadius: 30,
                }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
            getItemLayout={getItemLayout}

          />
        )}
      />

      {/* {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
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

  line: {
    width: '95%',
    height: 1,
    backgroundColor: '#ededed',
    marginVertical: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  productList: {
    flex: 1,
    marginTop: 50,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ededed',
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,

  },
  productIcon: {
    width: 55,
    height: 55,
    marginLeft: 5,
    marginTop: 5,
  },
  rankIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    right: 0,
  },
  productDetails: {
    flex: 1,
  },
  productCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productStatus: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default AssistantAIScreen;