import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, Image, StyleSheet, ImageBackground } from "react-native";
import {
  HOME_SCREEN_BACKGROUND,
  NORMAL_USER_SELECTED,
  REDIRECT_BOOK_HISTORY,
  REDIRECT_BOOK_TICKET,
  VI_USER_SELECTED,
  VI_USER_SELECTED_2,
  VI_USER_SELECTED_3,
  VI_USER_SELECTED_4,
  WELCOME_MESSAGE,
  WELCOME_MESSAGE_NAVIGATION,
} from "./constant";
import { getIsVIUser, removeIsVIUser, setIsVIUser } from "../helper/shared";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { Button } from "react-native";
import TextToSpeech from "../helper/TextToSpeech";

export default function Home({ navigation }) {
  const [userSelected, setUserSelected] = useState(false);

  useEffect(() => {
    Speech.speak(WELCOME_MESSAGE);
    Speech.speak(WELCOME_MESSAGE_NAVIGATION);
  }, []);

  normalUser = async () => {
    // if (!userSelected) {
    await setIsVIUser(false);
    setUserSelected(true);
    Speech.speak(NORMAL_USER_SELECTED);
    const res = await getIsVIUser();
    console.log("DEMO nu", res);
    navigation.navigate("Booking");
    // }
  };
  viUser = async () => {
    // if (!userSelected) {
    await setIsVIUser(true);
    setUserSelected(true);
    Speech.speak(VI_USER_SELECTED);
    Speech.speak(VI_USER_SELECTED_2);
    Speech.speak(VI_USER_SELECTED_3);
    Speech.speak(VI_USER_SELECTED_4);
    const res = await getIsVIUser();
    console.log("DEMO vi", res);
    Speech.speak(REDIRECT_BOOK_TICKET);
    Speech.speak(REDIRECT_BOOK_HISTORY);
    navigation.navigate("TextToSpeech");
    // }
  };
  getIsVIUser().then((res) => {
    if (userSelected && res) {
      console.log("getIsVIUser ", getIsVIUser());
      console.log("vi user flow s");
      return <TextToSpeech />;
    } else {
      console.log("normal user flow s");
    }
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={HOME_SCREEN_BACKGROUND}>
        <TouchableOpacity onPress={normalUser} style={styles.containerTop}>
          <Text style={styles.containerWelcomeText}>Welcome to</Text>
          <Text style={styles.containerText}>Visually Impaired Passenger</Text>
          <Text style={styles.containerSlogan}>
            Even without sight there is stil vision!!!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={viUser} style={styles.containerBottom}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.containerImage}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c1c1c1",
    height: "100%",
  },
  containerTop: {
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  containerBottom: {
    display: "flex",
    alignItems: "center",
    height: "50%",
    justifyContent: "flex-start",
  },
  containerImage: {
    height: 200,
    width: 150,
    resizeMode: "stretch",
  },
  containerWelcomeText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  containerText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  containerSlogan: {
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
