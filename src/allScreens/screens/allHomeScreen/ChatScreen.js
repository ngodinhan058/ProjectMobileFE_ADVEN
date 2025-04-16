import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { DotIndicator } from 'react-native-indicators';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

const ChatScreen = ({ navigation, route }) => {
    useFocusEffect(
        useCallback(() => {
            // Ẩn tab bar khi vào màn hình này
            const parent = navigation.getParent();
            parent?.setOptions({ tabBarStyle: { display: 'none' } });
            route.params?.setShowTabBar(false);

            return () => {
                // Hiện lại tab bar khi rời khỏi
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
                route.params?.setShowTabBar(true);
            };
        }, [])
    );


    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [aiAnswer, setAIAnswer] = useState(false);

    const flatListRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const greeting = {
            id: Date.now().toString(),
            text: "Xin chào! Mình là AI trợ lý của bạn. Có gì mình giúp được không?",
            isSender: false,
        };
        setMessages([greeting]);
    }, []);
    const AI_EMAIL = "ai-assistant@openai.com";

    // Hàm tạo phản hồi giả của AI
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

    // Gửi tin nhắn + phản hồi giả của AI
    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isSender: true, // là user
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');

        // Tạo phản hồi AI sau 1.5 giây
        setAIAnswer(true)
        timeoutRef.current = setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                text: getAIResponse(inputText),
                isSender: false,
            };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
            setAIAnswer(false);
        }, 5000);
    };
    const stopAI = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setAIAnswer(false);
    };
    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.isSender ? styles.sender : styles.receiver,
            ]}
        >
            <Text
                style={item.isSender ? styles.messageTextSender : styles.messageText}
            >
                {item.text}
            </Text>
            <TouchableOpacity
                onPress={() => copyToClipboard(item.text)}
                style={item.isSender ? styles.copyTextSender : styles.copyText}
            >
                <Image
                    source={require('../../../assets/copy.png')}
                    style={{ width: 18, height: 20, }}
                />
            </TouchableOpacity>

        </View>
    );

    // Hàm Copy
    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Toast.show({
            type: 'success',
            text1: 'Đã sao chép!',
            text2: 'Tin nhắn đã được lưu',
            visibilityTime: 1500,
        });

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
                searchInputRef.current.focus(); // Focus vào ô nhập liệu sau khi render
            }
        }, 100);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={28} color="#000" style={styles.logoIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>SpeakEZ AI</Text>
                </View>
                <View style={{ maxHeight: '90%' }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                    {aiAnswer ? (<>
                        <View style={{ width: 80, height: 40, backgroundColor: "#f1f1f1", alignItems: 'center', borderRadius: 100 }}>
                            <DotIndicator color='#000' size={8} count={3} />
                        </View>
                    </>) : (<></>)}
                </View>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={isFocused ? styles.inputFocused : styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    ref={searchInputRef}
                />
                {aiAnswer ? (<>
                    <TouchableOpacity onPress={stopAI}>
                        <LinearGradient
                            colors={['#FED29F', '#FFA83F']}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 90,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <View style={{
                                backgroundColor: 'white', // hoặc màu nền màn hình
                                width: 55,
                                height: 55,
                                borderRadius: 90, // nhỏ hơn chút để lộ viền
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image
                                    source={require('../../../assets/stop.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                </>) : (<TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <LinearGradient
                        colors={['#7E92F8', '#6972F0']}
                        style={styles.sendButton}>
                        <Image
                            source={require('../../../assets/send.png')}
                            style={{ width: 20, height: 20 }}
                        />
                    </LinearGradient>
                </TouchableOpacity>)}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
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
        height: 65,
        paddingHorizontal: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        marginRight: 12
    },
    inputFocused: {
        flex: 1,
        borderRadius: 50,
        height: 65,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(113, 127, 243, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#6972F0",
        marginRight: 12
    },
    sendButton: {
        alignItems: 'flex-end',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 90,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ChatScreen;