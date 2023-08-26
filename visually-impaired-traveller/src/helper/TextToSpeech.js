import React from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from "expo-av/build/Audio";
import { blobToTranscript } from "./helpers";
import { Text } from "react-native";
import { Image } from "react-native";
import * as Speech from "expo-speech";
import { bookingHelper } from "./shared";
import SyncStorage from "sync-storage";
import {
  HOME_SCREEN_BACKGROUND_BLIND,
  REDIRECT_BOOK_HISTORY,
  REDIRECT_BOOK_TICKET,
  VI_USER_SELECTED,
  WELCOME_MESSAGE_NAVIGATION,
} from "../pages/constant";

function TextToSpeech({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [transcript, setTranscript] = React.useState("");
  const HIGH_QUALITY = {
    isMeteringEnabled: true,
    android: {
      extension: ".mp3",
      outputFormat: AndroidOutputFormat.MPEG_4,
      audioEncoder: AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: IOSOutputFormat.MPEG4AAC,
      audioQuality: IOSAudioQuality.MAX,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    },
  };

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(HIGH_QUALITY);
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const audioURI = recording.getURI();
    const results = await blobToTranscript(audioURI);

    console.log("Recording stopped and stored at", results.filename);
    setTranscript(results.transcript);
    Speech.speak(`You said, ${results.transcript}`);
    const res = await bookingHelper(results.transcript);
    if (res === "reset") {
      Speech.speak(WELCOME_MESSAGE_NAVIGATION);
      navigation.navigate("Home");
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={HOME_SCREEN_BACKGROUND_BLIND}>
        <View style={styles.containerTop}>
          <Text style={styles.containerText}>You said: {transcript}</Text>
          {/* <Text style={styles.containerText}>isVIUser - {SyncStorage.get('isVIUser')}</Text>
        <Text style={styles.containerText}>page - {SyncStorage.get('page')}</Text>
        <Text style={styles.containerText}>bookingPage - {SyncStorage.get('bookingPage')}</Text>
        <Text style={styles.containerText}>bookingDetails - {SyncStorage.get('bookingDetails')}</Text> */}
        </View>
        <TouchableOpacity
          style={styles.containerBottom}
          onPress={recording ? stopRecording : startRecording}
        >
          {recording ? (
            <Image
              source={require("../assets/pause.png")}
              style={styles.recordButton}
            />
          ) : (
            <Image
              source={require("../assets/play.png")}
              style={styles.recordButton}
            />
          )}
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

export default TextToSpeech;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c1c1c1",
    height: "100%",
    width: "100%",
  },
  containerTop: {
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  containerBottom: {
    display: "flex",
    alignItems: "center",
    height: "50%",
    justifyContent: "center",
  },
  recordButton: {
    height: "50%",
    width: "50%",
  },
  containerText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "serif",
    color: "white",
  },
});
