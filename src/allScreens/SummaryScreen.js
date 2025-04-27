import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import API from './api/axiosInstance';
import { LinearGradient } from 'expo-linear-gradient';


const screenWidth = Dimensions.get('window').width;

export default function SummaryScreen({ route, navigation }) {
  const { chatId } = route.params;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await API.get(`/progress/${chatId}`);
        if (response.data.length > 0) {
          // Mặc định lấy bản ghi đầu tiên
          console.log(response.data[0]);

          setResult(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [chatId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, color: '#6B7280' }}>Không tìm thấy kết quả!</Text>
      </View>
    );
  }

  const pieData = [
    {
      name: 'Fluency',
      population: result.fluency,
      color: 'rgba(255, 99, 132, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Grammar',
      population: result.grammar,
      color: 'rgba(54, 162, 235, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Vocabulary',
      population: result.vocab,
      color: 'rgba(255, 206, 86, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },

  ];
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F9FAFB', padding: 20, paddingTop: 40, }}>
      <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#1F2937', marginBottom: 30 }}>
        🎯 Tổng Kết Buổi Luyện
      </Text>

      {/* Card chứa biểu đồ */}
      <View style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
      }}>
        <PieChart
          data={pieData}
          width={320}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute // hoặc percentage nếu bạn thích hiện %
        />
      </View>
      {/* Card thông tin */}
      <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>📚 Chủ đề: <Text style={{ fontWeight: '400' }}>{result.topic}</Text></Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>⏱️ Thời gian: <Text style={{ fontWeight: '400' }}>{result.duration} phút</Text></Text>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>🔄 Lượt trao đổi: <Text style={{ fontWeight: '400' }}>{result.total_turns}</Text></Text>
      </View>

      {/* Card feedback */}
      <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#4F46E5', marginBottom: 10 }}>📢 Phản hồi từ AI</Text>
        <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#6B7280' }}>
          "{result.feedback}"
        </Text>
      </View>


      <TouchableOpacity onPress={() => navigation.navigate()} style={{
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 7,
      }}>
        <LinearGradient colors={['#7E92F8', '#6972F0']} style={{
          paddingVertical: 14,
          paddingHorizontal: 100,
          borderRadius: 30,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>🚀 Luyện tiếp nào!</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>

  );
}
