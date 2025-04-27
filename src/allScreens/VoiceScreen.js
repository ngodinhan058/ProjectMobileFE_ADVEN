import { Audio, Video } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import API from './api/axiosInstance';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BE_URL, getToken } from './api/config';
import IconI from 'react-native-vector-icons/Ionicons';
import videoBg from "../assets/video.mp4";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");
const UploadAudio = ({ navigation, route }) => {
  const { chatId } = route.params;
  const widthAnim = useRef(new Animated.Value(0)).current; // width bắt đầu từ 0
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [recording, setRecording] = useState();
  const [text, setText] = useState('Tôi Có Thể Giúp Gì Cho Bạn');
  const [sound, setSound] = useState();
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const bassProfile = [
    { time: 0, intensity: 0.5 },
    { time: 1.2, intensity: 1.0 },
    { time: 2.5, intensity: 0.3 },
    { time: 3.0, intensity: 0.9 },
    { time: 5.0, intensity: 1.2 },
    { time: 7.0, intensity: 0.6 },
  ];
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);  // Xóa sound khi dừng
    }
  };
  async function startRecording() {
    await stopSound();
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    // Upload file
    await uploadAudio(uri);
  }

  // async function uploadAudio(uri) {
  //   let formData = new FormData();
  //   formData.append('file', {
  //     uri,
  //     type: 'audio/m4a', // hoặc audio/wav, tùy định dạng
  //     name: 'recording.m4a'
  //   });

  //   const response = await fetch('https://3669-2405-4802-8151-df90-bc4c-3a83-68a1-72ac.ngrok-free.app/questions_voices/2', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzQ1NzMyODgzfQ.va-sJG2Me6UmUpFtBkwqUO5HH-59OOo9ZlFaE5xtvI0', // nếu cần token
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     body: formData,
  //   });

  //   const data = await response.json();
  //   console.log('Response:', data);

  //   if (data.audio_url) {
  //     playSound('https://3669-2405-4802-8151-df90-bc4c-3a83-68a1-72ac.ngrok-free.app/' + data.audio_url);
  //   }
  // }
  async function uploadAudio(uri) {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });

    try {
      const response = await API.post(
        `/questions_voices/${chatId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);

      if (response.data.audio_url) {
        playSound(BE_URL + '/' + response.data.audio_url);
        setText(response.data.text)
      }
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
    }
  }

  async function playSound(url) {
    console.log('Loading Sound', url);
    const { sound } = await Audio.Sound.createAsync(
      { uri: url }
    );
    setSound(sound);
    sound.setOnPlaybackStatusUpdate(setPlaybackStatus);

    console.log('Playing Sound');
    await sound.playAsync();
  }
  useEffect(() => {
    if (playbackStatus?.isPlaying) {
      const currentTime = playbackStatus.positionMillis / 1000;

      const closestBass = bassProfile.findLast((b) => b.time <= currentTime);
      if (closestBass) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1 + closestBass.intensity * 0.5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [playbackStatus]);
  const handleBack = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 100, backgroundColor: '#fff' }}>
      {/* Video nền */}
      <Animated.View
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          overflow: 'hidden',
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Ảnh placeholder */}
        {!isVideoReady && (
          <Image
            source={require('../assets/bg_voice.png')} // đổi path tới ảnh bạn muốn
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}

        {/* Video nền */}
        <Video
          source={videoBg}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          resizeMode="cover"
          shouldPlay
          isLooping={true}
          onReadyForDisplay={() => setIsVideoReady(true)} // Khi video sẵn sàng thì tắt placeholder
        />
      </Animated.View>
      <View style={{ height: 350, width: '90%', paddingTop: 50 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.textVoice}>{text}</Text>
        </ScrollView>
      </View>

      {/* Nút ghi âm */}
      {recording ? (
        <TouchableOpacity
          onPress={stopRecording}
          style={styles.micStopButton}
          activeOpacity={1}
        >
          <IconI name="mic-off-outline" size={30} color="#b91c1c" style={styles.logoIcon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={startRecording}
          style={styles.micButton}
          activeOpacity={1}
        >
          <IconI name="mic-outline" size={30} color="#2b3356" style={styles.logoIcon} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        activeOpacity={1}
      >
        <IconI name="close-outline" size={30} color="#2b3356" style={styles.logoIcon} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({

  textVoice: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "#00000099",
    textAlign: 'center',
    paddingTop: 120,
    paddingHorizontal: 20
  },
  backButton: {
    position: 'absolute',
    zIndex: 100,
    bottom: "5%",
    right: "15%",
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 65,
  },
  micButton: {
    position: 'absolute',
    zIndex: 100,
    bottom: "5%",
    left: "15%",
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 65,
  },
  micStopButton: {
    position: 'absolute',
    zIndex: 100,
    bottom: "5%",
    left: "15%",
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 65,
  },

});
export default UploadAudio;
