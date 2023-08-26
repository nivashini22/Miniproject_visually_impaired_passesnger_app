import React, { useState } from "react";

import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Keyboard,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Button,
  ImageBackground,
  Pressable,
} from "react-native";
import {
  CARD_BACKGROUND,
  DISTRICTS,
  HOME_SCREEN_BACKGROUND,
  IP_ADDRESS,
} from "./constant";
import { Picker } from "@react-native-picker/picker";

export default function Booking({ navigation }) {
  const [state, setState] = React.useState({
    destination: "",
    source: "",
    startingIndex: 0,
    lastIndex: 0,
    date: "",
    name: "",
    address: "",
    cardNumber: "",
    cardDate: "",
    cardCVV: "",
  });
  bookTicket = async () => {
    if (!state.source || state.source == "None") {
      Alert.alert("Warning", "Please select source", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (!state.destination || state.destination == "None") {
      Alert.alert("Warning", "Please select destination", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (state.destination == state.source) {
      Alert.alert("Warning", "Source and destination are same", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (!validDate(state.date)) {
      Alert.alert("Warning", "Please enter valid date in DD/MM/YYYY format", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (!state.name || state.name.replaceAll(" ", "").length === 0) {
      Alert.alert("Warning", "Please enter passenger's name", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (!state.address || state.address.replaceAll(" ", "").length === 0) {
      Alert.alert("Warning", "Please enter address", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (
      !state.cardNumber ||
      state.cardNumber.replaceAll(" ", "").length === 0 ||
      state.cardNumber.replaceAll(" ", "").length !== 16
    ) {
      Alert.alert("Warning", "Please enter valid card number", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (!validCardDate(state.cardDate)) {
      Alert.alert("Warning", "Please enter valid expiry date", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    if (
      !state.cardCVV ||
      state.cardCVV.replaceAll(" ", "").length === 0 ||
      state.cardCVV.replaceAll(" ", "").length !== 3
    ) {
      Alert.alert("Warning", "Please enter valid card CVV", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    let [date, month, year] = state.date.split("/");
    month = month.length == 1 ? "0" + month : month;
    const bookingDate = [date, month, year].join("/");
    setState({ ...state, date: bookingDate });
    const data = {
      destination: state.destination,
      source: state.source,
      date: state.date,
      name: state.name,
      address: state.address,
      status: "BOOKED",
    };
    await fetch(`http://${IP_ADDRESS}:9000/book`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    setState({
      destination: "",
      source: "",
      date: "",
      name: "",
      address: "",
    });
    Alert.alert("Book a ticket", "Ticket booked successfully", [
      { text: "OK", onPress: success },
    ]);
  };
  success = () => {
    navigation.navigate("History");
  };

  validDate = (stateDate) => {
    const [date, month, year] = stateDate.split("/");
    if (
      !date ||
      !month ||
      !year ||
      month == 0 ||
      month > 12 ||
      year < 2023 ||
      date == 0 ||
      date > 31
    ) {
      return false;
    }
    var d = new Date(year + "-" + month + "-" + date + "T00:00:00.000Z");
    return (
      d.toDateString() != "Invalid Date" &&
      d instanceof Date &&
      d.getTime() >= new Date().getTime()
    );
  };

  validCardDate = (stateDate) => {
    const [month, year] = stateDate.split("/");
    if (
      !month ||
      !year ||
      month == 0 ||
      month > 12 ||
      year < 23 ||
      year > 29 ||
      month.length !== 2 ||
      year.length !== 2
    ) {
      return false;
    }
    return true;
  };

  return (
    <ImageBackground source={HOME_SCREEN_BACKGROUND} style={{ height: "100%" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Book a ticket</Text>
        <Text style={styles.label}>Source</Text>
        <Picker
          style={styles.input}
          selectedValue={state.source}
          onValueChange={(itemValue, itemIndex) =>
            setState({ ...state, source: itemValue, startingIndex: itemIndex })
          }
        >
          <Picker.Item label="None" value="None" />
          {DISTRICTS.map((val, i) => {
            return <Picker.Item label={val} value={val} key={i} />;
          })}
        </Picker>
        <Text style={styles.label}>Destination</Text>
        <Picker
          style={styles.input}
          selectedValue={state.destination}
          onValueChange={(itemValue, itemIndex) =>
            setState({ ...state, destination: itemValue, lastIndex: itemIndex })
          }
        >
          <Picker.Item label="None" value="None" />
          {DISTRICTS.map((val, i) => {
            return <Picker.Item label={val} value={val} key={i} />;
          })}
        </Picker>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={"white"}
          onChangeText={(date) => setState({ ...state, date: date })}
          value={state.date}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setState({ ...state, name: name })}
          value={state.name}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          onChangeText={(address) => setState({ ...state, address: address })}
          value={state.address}
        />
        <Text style={styles.title}>Card details</Text>
        <ImageBackground
          source={CARD_BACKGROUND}
          style={{ padding: 20, marginTop: 20 }}
        >
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXX XXXX XXXX XXXX"
            onChangeText={(cardNumber) =>
              setState({ ...state, cardNumber: cardNumber })
            }
            placeholderTextColor={"white"}
            value={state.cardNumber}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                onChangeText={(cardDate) =>
                  setState({ ...state, cardDate: cardDate })
                }
                placeholderTextColor={"white"}
                value={state.cardDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="XXX"
                onChangeText={(cardCVV) =>
                  setState({ ...state, cardCVV: cardCVV })
                }
                placeholderTextColor={"white"}
                value={state.cardCVV}
              />
            </View>
          </View>
        </ImageBackground>
        <Pressable style={styles.button} onPress={bookTicket}>
          {/* <Pressable style={styles.button} onPress={() => console.log(state)}> */}
          <Text style={styles.buttonText}>
            Pay ₹{Math.abs(state.lastIndex - state.startingIndex) * 33 || 0}
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
    height: "100%",
  },
  title: {
    paddingTop: 50,
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    color: "#841584",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  label: {
    marginBottom: 2,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
    backgroundColor: "#c1c1c1",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  input: {
    borderColor: "#c1c1c1",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 2,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 20,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    margin: 20,
    padding: 20,
    backgroundColor: "#841584",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
