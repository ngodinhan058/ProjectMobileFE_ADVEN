import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VoiceTest() {

  return (
    <ImageBackground style={{ flex: 1, }}
      source={require('../assets/bg_voice.png')}
      resizeMode="cover">
      <WebView
        source={{ uri: 'https://f61b-2405-4802-8151-df90-5484-c485-b2a3-7ff5.ngrok-free.app' }} // chỉnh theo local bạn
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        allowsFullscreenVideo={true}
        allowsProtectedMedia={true}
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
    </ImageBackground>
  );
}

