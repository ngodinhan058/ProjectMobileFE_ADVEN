import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert, Button, ImageBackground } from "react-native";
import { Video, Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import axios from "axios";
import LottieView from "lottie-react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import videoBg from "../../assets/video.mp4";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
    const navigation = useNavigation();
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState();
    const [AIResponse, setAIResponse] = useState(false);
    const [AISpeaking, setAISpeaking] = useState(false);
    const lottieRef = useRef(null);
    useFocusEffect(
        useCallback(() => {
            return () => {
                stopRecordingNotSend();
            };
        }, [])
    );

    // get microphone permission
    const getMicrophonePermission = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();

            if (!granted) {
                Alert.alert(
                    "Permission",
                    "Please grant permission to access microphone"
                );
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    const recordingOptions = {
        android: {
            extension: ".wav",
            outPutFormat: Audio.AndroidOutputFormat.MPEG_4,
            androidEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: ".wav",
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };
    const startRecording = async () => {
        const hasPermission = await getMicrophonePermission();
        if (!hasPermission) return;
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            setIsRecording(true);
            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
        } catch (error) {
            console.log("Failed to start Recording", error);
            Alert.alert("Error", "Failed to start recording");
        }
    };
    const stopRecording = async () => {
        try {
            setIsRecording(false);
            setLoading(true);
            if (recording) {
                await recording.stopAndUnloadAsync();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            const uri = recording ? recording.getURI() : null;
            if (!uri) throw new Error("Recording URI is null");
            // await playRecording(uri);
            // Send audio to Whisper API for transcription
            const transcript = await sendAudioToWhisper(uri);
            setText(transcript);

            // Send the transcript to GPT-4 API for response
            await sendToGpt(transcript);
        } catch (error) {
            // console.log("thông báo từ stopRecording Failed to stop Recording", error);

        }
    };
    const stopRecordingNotSend = async () => {
        try {
            setIsRecording(false);
            if (recording) {
                await recording.stopAndUnloadAsync();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            const uri = recording ? recording.getURI() : null;
            if (!uri) throw new Error("Recording URI is null");
        } catch (error) {

        }
    };
    const sendAudioToWhisper = async (uri) => {
        console.log(uri);
        
        try {
            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "audio/wav",
                name: "recording.wav",
            });
            formData.append("model", "whisper-1");

            const response = await axios.post(
                "", // bỏ api để upload file ghi âm
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("thông báo từ sendAudioToWhisper", response.data.text);

            return response.data.text;
        } catch (error) {
            console.log(error);
        }
    };
    // Send text to GPT-4 API
    const sendToGpt = async (text) => {
        console.log("text", text);

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are Artifonia, a friendly AI assistant who responds naturally and referes to yourself as Artifonia when asked for your name. You are a helpful assistant who can answer questions and help with tasks. You must always respond in English, no matter the input language,and provide helpful, clear answers",
                        },
                        {
                            role: "user",
                            content: text,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setAIResponse(true);
            await speakText(response.data.choices[0].message.content);
            setText(response.data.choices[0].message.content);
        } catch (error) {
            console.error("Error sending text to GPT-3.5:", error.response?.data || error.message);
            Alert.alert("API Error", "thông báo từ sendToGpt: Failed to send request to GPT-3.5.");
        } finally {
            setLoading(false);
            setAIResponse(true);
        };
    }
    const speakText = async (text) => {
        setAISpeaking(true);
        const options = {
            language: "vi-VN",
            pitch: 1.2,
            rate: 1,
            onDone: () => setAISpeaking(false),
        };

        Speech.speak(text, options);
    };
    useEffect(() => {
        if (AISpeaking) {
            lottieRef.current?.play();
        } else {
            lottieRef.current?.reset();
        }
    }, [AISpeaking]);
    // Check Recroding
    const playRecording = async (uri) => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: true }
          );
      
          // Optional: Lưu sound để có thể dừng lại sau
          // setSound(sound);
      
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              console.log("✅ Ghi âm đã phát xong");
              sound.unloadAsync(); // cleanup bộ nhớ
            }
          });
      
        } catch (error) {
          console.error("❌ Lỗi khi phát lại ghi âm:", error);
        }
    };
    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/bg_voice.png')}
            resizeMode="cover">
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
            <View>
                <LottieView
                    ref={lottieRef}
                    source={require("../../assets/animations/ai-speaking.json")}
                    autoPlay={false}
                    loop={false}
                    style={{ width: 350, height: 450 }}
                />
            </View>
            <View style={styles.overText}>
                <Text style={styles.text}>{loading ? "..." : text || "Hãy bấm vào Micro để bắt đầu nói chuyện"}</Text>
            </View>
            <View style={styles.action}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-outline" size={28}></Ionicons>
                </TouchableOpacity>


                {!isRecording ? (
                    <TouchableOpacity
                        style={{
                            width: 48,
                            height: 48,
                            backgroundColor: "#bbbbbb",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 48,
                        }}
                        onPress={startRecording}
                    >
                        <FontAwesome
                            name="microphone"
                            size={24}
                            color="#2b3356"
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={stopRecording}>
                        <LottieView
                            source={require("../../assets/animations/animation.json")}
                            autoPlay
                            loop
                            speed={1.3}
                            style={{ width: 48, height: 48, }}
                        />
                    </TouchableOpacity>
                )}



                {/* <TouchableOpacity
                        onPress={startRecording}>

                        <Image
                            source={require('../../assets/mic.png')}
                            style={{ width: 24, height: 24 }} // URL hình ảnh đại diện
                        />
                    </TouchableOpacity> */}


                <Ionicons name="settings-outline" size={28}></Ionicons>

            </View>
            {/* Nội dung giao diện đăng nhập */}
            <Button title="🗣 Test Speak" onPress={() => speakText("xin chào tôi là AI speak EZ. tôi có thể giúp gì cho bạn")} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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

    action: {
        position: "absolute",
        flexDirection: "row",
        width: 200,
        height: 65,
        backgroundColor: "#fff",
        borderRadius: 65,
        bottom: "5%",
        justifyContent: "center",
        alignItems: 'center',
        gap: 25,
    },
    overText: {
        width: 350,
        marginTop: "10%"

    },
    text: {
        fontSize: 30,
        textAlign: "center"
    }

});

export default LoginScreen;
