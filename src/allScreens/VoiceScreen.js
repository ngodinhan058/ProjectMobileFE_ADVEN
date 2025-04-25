import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebView_URL, BE_URL, token } from './api/config';
import Icon from 'react-native-vector-icons/FontAwesome';

const VoiceTest = ({ navigation, route }) => {
  const [webLoaded, setWebLoaded] = useState(false);
  const webViewRef = useRef(null);
  const { chatId } = route.params;
  // 🔁 Gửi dữ liệu sang Web khi WebView load xong
  useEffect(() => {
    if (webLoaded && webViewRef.current) {
      const payload = {
        token: token,
        id: chatId,
        url: BE_URL
      };

      webViewRef.current.postMessage(JSON.stringify(payload));
    }
  }, [webLoaded]);
  return (
    <>
      <View style={{ flex: 1, }}>
        {/* Header */}
        {webLoaded && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.header}
            activeOpacity={1}
          >
            <Icon name="close" size={24} color="#2b3356" style={styles.logoIcon} />
          </TouchableOpacity>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: WebView_URL }} // chỉnh theo local bạn
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          originWhitelist={['*']}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          allowsProtectedMedia={true}
          onLoadEnd={() => setWebLoaded(true)}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'log') {
                console.log("📨 Log từ WebView:", data.message);
              } else if (data.type === 'error') {
                console.error("❌ Error từ WebView:", data.message, data.detail);
              }
            } catch (e) {
              console.warn("Không parse được message từ WebView", e);
            }
          }}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    zIndex: 100,
    bottom: "5%",
    right: "15%",
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 65,
  },


});

export default VoiceTest;

