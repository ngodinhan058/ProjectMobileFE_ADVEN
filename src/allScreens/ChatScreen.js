import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { DotIndicator } from 'react-native-indicators';
import { BlurView } from 'expo-blur'
import axios from 'axios';
import * as Speech from 'expo-speech';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BE_URL, getToken } from '../allScreens/api/config';
import API from '../allScreens/api/axiosInstance';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const ChatBox = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatId, title, status } = route.params;
  // console.log("status", chatId);

  const backPressCount = useRef(0);
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (backPressCount.current === 0) {
          backPressCount.current += 1;
          ToastAndroid.show('Nhấn thêm lần nữa để thoát ứng dụng', ToastAndroid.SHORT);

          timeoutRef.current = setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);

          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }

      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
      };
    }, [])
  );
  const [chatNewId, setChatNewId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [endChat, setEndChat] = useState('');
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [aiAnswer, setAIAnswer] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [AISpeaking, setAISpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const flatListRef = useRef(null);
  const timeoutRef = useRef(null);
  const pressTimerRef = useRef(null);
  const messageRefs = useRef({})

  // useEffect(() => {
  //   const greeting = {
  //     id: Date.now().toString(),
  //     text: "Hello! I'm AI assisting you. How can I help?",
  //     isSender: false, // false là Ai, true là user
  //   };
  //   setMessages([greeting]);
  // }, []);

  const getChatContent = async (chatId) => {
    try {
      setLoading(true);

      const [questionsRes, answersRes] = await Promise.all([
        API.get(`/questions/${chatId}`),

        API.get(`/answers/${chatId}`),
      ]);

      const combined = combineMessages(questionsRes.data, answersRes.data);

      setMessages(combined);
    } catch (err) {
      // console.error("Error fetching questions or answers:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const combineMessages = (questions, answers) => {
    const messages = [];

    questions.forEach((q) => {
      messages.push({
        id: `q-${q.id}`,
        text: q.content,
        isSender: true, // user
        time: new Date(q.time),
      });

    });
    answers.forEach((a) => {
      messages.push({
        id: `a-${a.id}`,
        text: a.content,
        isSender: false, // AI
        time: new Date(a.time),
        language: a.language,
      });
    });

    // sort theo thời gian
    return messages.sort((a, b) => a.time - b.time);
  };

  useEffect(() => {

    if (chatId) getChatContent(chatId);
  }, [chatId]);

  const speakText = async (text, language) => {
    if (language) {
      setAISpeaking(true);
      const options = {
        language: language,
        pitch: 1.2,
        rate: 1,
        onDone: () => setAISpeaking(false),
      };

      Speech.speak(text, options);
    }
    else {
      console.log("language", "null");

    }

  };

  const stopSpeaking = () => {
    Speech.stop();
    setAISpeaking(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    setIsInputEmpty(true)
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isSender: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setAIAnswer(true);
    setError(false)


    try {
      const response = await API.post(`/questions/${chatId}`, { content: inputText.trim() });

      // Xử lý phản hồi từ API
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.content,
        isSender: false,
        language: response.data.language,
      };
      console.log("mess", "old " + response.data.status);

      setEndChat(response.data.status)
      setMessages(prev => [...prev, aiMessage]);
      setAIAnswer(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(true)
      setAIAnswer(false);
    }
  };

  const sendNewMessage = async () => {
    if (!inputText.trim()) return;

    setIsInputEmpty(true);

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isSender: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAIAnswer(true);
    setError(false);
    try {
      let currentChatId = chatNewId;
      if (!currentChatId) {
        const responseNew = await API.post(`/chats`, {});
        if (responseNew.status === 201 && responseNew.data.new_chat_id) {
          currentChatId = responseNew.data.new_chat_id;
          setChatNewId(currentChatId);
          navigation.setParams({ chatId: currentChatId });

        } else {
          Alert.alert('Không thể tạo cuộc trò chuyện mới');
          setAIAnswer(false);
          return;
        }
      }
      // Gửi câu hỏi tới chat hiện tại
      console.log("mess", "new " + currentChatId);

      const response = await API.post(`/questions/${currentChatId}`, { content: userMessage.text });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.content,
        isSender: false,
        language: response.data.language,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(true);
    } finally {
      setAIAnswer(false);
    }
  };

  const stopAI = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAIAnswer(false);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: 'Đã sao chép!',
      text2: 'Tin nhắn đã được lưu',
      visibilityTime: 1500,
    });
  };

  const renderMessage = ({ item, index }) => {
    const messageRef = messageRefs.current[index] || React.createRef();
    messageRefs.current[index] = messageRef;

    const handleLongPress = () => {
      if (messageRef.current) {
        messageRef.current.measureInWindow((x, y, width, height) => {
          const modalTop = y + 90;
          const modalLeft = item.isSender ? x + width - 160 : x + width - 140;
          setModalPosition({ top: modalTop, left: modalLeft });
          setSelectedMessage(item.text);
          setShowCopyModal(true);
        });
      }
    };

    return (
      <>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <View
            style={[
              styles.messageContainer,
              item.isSender ? styles.sender : styles.receiver,
            ]}
            ref={messageRef}
          >
            <TouchableOpacity
              onPressIn={() => pressTimerRef.current = setTimeout(handleLongPress, 300)}
              onPressOut={() => clearTimeout(pressTimerRef.current)}
            >
              <Text style={item.isSender ? styles.messageTextSender : styles.messageText}>
                {item.text}
              </Text>
            </TouchableOpacity>
            {!item.isSender && (
              <>
                <TouchableOpacity
                  onPress={() => copyToClipboard(item.text)}
                  style={styles.copyText}
                >
                  <Image source={require('../assets/copy.png')} style={{ width: 16, height: 18 }} />


                </TouchableOpacity>
                {AISpeaking ? (
                  <TouchableOpacity
                    onPress={() => stopSpeaking()}
                    style={styles.micText}
                  >

                    <Ionicons
                      name="mic-off-circle-outline"
                      size={22}
                      color="#2b3356"
                    />

                  </TouchableOpacity>) :
                  (<TouchableOpacity
                    onPress={() => speakText(item.text, item.language)}
                    style={styles.micText}
                  >

                    <Ionicons
                      name="mic-circle-outline"
                      size={22}
                      color="#2b3356"
                    />

                  </TouchableOpacity>
                  )}
              </>
            )
            }

          </View >
        </TouchableWithoutFeedback>
      </>

    );
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // delay nhẹ để chắc chắn FlatList đã cập nhật
    }
  }, [messages]);
  useEffect(() => {
    if (isFocused && !aiAnswer) {
      // AI đã trả lời xong và input đang được focus
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // delay nhẹ để chắc chắn FlatList đã cập nhật
    }
  }, [aiAnswer, isFocused]);
  const searchInputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, []);
  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="list-outline" size={28} color="#000" style={styles.logoIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title ? title : "New Chat"}</Text>
          </View>
          {/* maxHeight: "100%", marginBottom: aiAnswer ? "23%" : 36, */}
          <View style={{ flex: 1, marginBottom: aiAnswer ? 0 : -15, }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
            {/* Loading */}
            {aiAnswer && (
              <View style={{ width: 60, height: 30, backgroundColor: "#f1f1f1", alignItems: 'center', borderRadius: 100, position: 'absolute', bottom: 0 }}>
                <DotIndicator color='#000' size={7} count={3} />
              </View>
            )}
            {/* Error */}
            {error && (
              <View style={styles.error}>
                <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu.</Text>
              </View>
            )}
          </View>
        </View>
        {endChat == "end" || status == "end" ?
          (<View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('SummaryScreen', { chatId: chatId })}
              style={{
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
                width: screenWidth - 40,
                borderRadius: 30,
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center'
                }}>🎯 Tổng Kết Buổi Luyện</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>) :

          (<View style={styles.inputContainer}>
            <TextInput
              style={isFocused ? styles.inputFocused : styles.input}
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setIsInputEmpty(text.trim().length === 0);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              ref={searchInputRef}
            />

            {aiAnswer ? (
              <TouchableOpacity onPress={stopAI}>
                <LinearGradient colors={['#FED29F', '#FFA83F']} style={styles.stopButton}>
                  <View style={styles.innerStopButton}>
                    <Image source={require('../assets/stop.png')} style={{ width: 18, height: 18 }} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              isInputEmpty ? (
                <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('VoiceScreen', { chatId: chatId })}>
                  <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.sendButton}>
                    <Icon name="barcode-outline" size={23} color={'#fff'} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.sendButton} onPress={chatId ? sendMessage : sendNewMessage}>
                  <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.sendButton}>
                    <Image source={require('../assets/send.png')} style={{ width: 18, height: 18 }} />
                  </LinearGradient>
                </TouchableOpacity>
              )
            )}
          </View>)}


      </View >
      {showCopyModal && (
        <BlurView intensity={50} tint="light" style={styles.blurOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowCopyModal(false)}
          />
          <View style={[styles.copyModal, { top: modalPosition.top, left: modalPosition.left }]}>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(selectedMessage);
                setShowCopyModal(false);
              }}
              style={{ width: '100%', flexDirection: 'row' }}
            >
              <Image source={require('../assets/copy.png')} style={{ width: 16, height: 18, tintColor: '#0e0e0e', marginRight: 5 }} />
              <Text style={{ color: '#0e0e0e', fontWeight: 'bold', textAlign: 'center' }}>Sao chép</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )
      }

    </>
  );
};

const styles = StyleSheet.create({
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  copyModal: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  copyButton: {
    backgroundColor: '#6972F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20
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

  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 5,
  },
  onlineText: {
    color: 'green',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',

  },
  sender: {
    backgroundColor: '#201D67',
    alignSelf: 'flex-end',
  },
  receiver: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  messageTextSender: {
    color: '#fff',
    fontSize: 16,
  },
  copyText: {
    position: 'absolute',
    top: 10,
    right: -30,
  },
  micText: {
    position: 'absolute',
    top: 30,
    right: -33,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderColor: "#F5F5F5",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  input: {
    flex: 1,
    borderRadius: 50,
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginRight: 12,
    marginVertical: 5,
  },
  inputFocused: {
    flex: 1,
    borderRadius: 50,
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(113, 127, 243, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#6972F0",
    marginRight: 12,
    marginVertical: 5,
  },
  sendButton: {
    alignItems: 'flex-end',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerStopButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    marginVertical: 16,
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '500',
  },
});
export default ChatBox;

