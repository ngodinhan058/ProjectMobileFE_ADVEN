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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { DotIndicator } from 'react-native-indicators';
import { BlurView } from 'expo-blur'

const ChatBox = ({ onBackPress, headerTitle, onVoicePress }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [aiAnswer, setAIAnswer] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const flatListRef = useRef(null);
  const timeoutRef = useRef(null);
  const pressTimerRef = useRef(null);
  const messageRefs = useRef({})

  useEffect(() => {
    const greeting = {
      id: Date.now().toString(),
      text: "Xin chào! Mình là AI trợ lý của bạn. Có gì mình giúp được không?",
      isSender: false,
    };
    setMessages([greeting]);
  }, []);

  const getAIResponse = (userMessage) => {
    const responses = [
      "Mình hiểu rồi! Bạn muốn hỏi thêm gì không?",
      "Haha, câu đó thú vị đó!",
      "Tôi là AI đây, bạn cần giúp gì?",
      "Câu hỏi hay đấy! Nhưng hơi khó nha 🤔",
      "Cho mình suy nghĩ chút nhé...",
    ];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isSender: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setAIAnswer(true);
    timeoutRef.current = setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isSender: false,
      };
      setMessages(prev => [...prev, aiMessage]);
      setAIAnswer(false);
    }, 3000);
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
          <TouchableOpacity
            onPress={() => copyToClipboard(item.text)}
            style={styles.copyText}
          >
            <Image source={require('../../assets/copy.png')} style={{ width: 16, height: 18 }} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBackPress}>
                <Icon name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{headerTitle ? headerTitle : "ChatBox AI"}</Text>
            </View>

            <View style={{ maxHeight: '90%' }}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
              {aiAnswer && (
                <View style={{ width: 80, height: 40, backgroundColor: "#f1f1f1", alignItems: 'center', borderRadius: 100 }}>
                  <DotIndicator color='#000' size={8} count={3} />
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
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
                    <Image source={require('../../assets/stop.png')} style={{ width: 18, height: 18 }} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              isInputEmpty ? (
                <TouchableOpacity style={styles.sendButton} onPress={onVoicePress}>
                  <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.sendButton}>
                    <Icon name="barcode-outline" size={23} color={'#fff'} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <LinearGradient colors={['#7E92F8', '#6972F0']} style={styles.sendButton}>
                    <Image source={require('../../assets/send.png')} style={{ width: 18, height: 18 }} />
                  </LinearGradient>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
              <Image source={require('../../assets/copy.png')} style={{ width: 16, height: 18, tintColor: '#0e0e0e', marginRight: 5 }} />
              <Text style={{ color: '#0e0e0e', fontWeight: 'bold', textAlign: 'center' }}>Sao chép</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
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
    maxWidth: '85%',

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
    top: 15,
    right: -30,
  },
  copyTextSender: {
    position: 'absolute',
    top: 15,
    left: -30,
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
    marginRight: 12
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
    marginRight: 12
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
});
export default ChatBox;
