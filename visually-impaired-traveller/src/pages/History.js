import React, { useState } from "react";
import { ImageBackground, Pressable, Alert } from "react-native";
import { Text, View, FlatList, StyleSheet, Modal } from "react-native";
import { HOME_SCREEN_BACKGROUND, IP_ADDRESS } from "./constant";
import { useEffect } from "react";

function History({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValue, setModalValue] = useState({});
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    navigation.addListener("focus", () => {
      setReload(!reload);
    });
    getBookings().then((res) => {
      setData(res.data);
    });
  }, [reload]);

  const getBookings = async () => {
    const response = await fetch(`http://${IP_ADDRESS}:9000/bookings`);
    const data = await response.json();
    return data;
  };
  const cancelTicket = (id) => {
    Alert.alert("Confirmation", "Ticket cancelled cannot be again restored", [
      { text: "OK", onPress: () => success(id) },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const success = async (id) => {
    await fetch(`http://${IP_ADDRESS}:9000/bookings/cancel`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { id } }),
    });
    setModalVisible(false);
    setReload(!reload);
  };
  return (
    <ImageBackground source={HOME_SCREEN_BACKGROUND} style={{ height: "100%" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ ...styles.heading, width: "100%" }}>Source</Text>
            <Text style={styles.modalText}>{modalValue.source}</Text>
            <Text style={{ ...styles.heading, width: "100%" }}>
              Destination
            </Text>
            <Text style={styles.modalText}>{modalValue.destination}</Text>
            <Text style={{ ...styles.heading, width: "100%" }}>Date</Text>
            <Text style={styles.modalText}>{modalValue.date}</Text>
            <Text style={{ ...styles.heading, width: "100%" }}>Name</Text>
            <Text style={styles.modalText}>{modalValue.name}</Text>
            <Text style={{ ...styles.heading, width: "100%" }}>Address</Text>
            <Text style={styles.modalText}>{modalValue.address}</Text>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => cancelTicket(modalValue.id)}
            >
              <Text style={styles.textStyle}>Cancel Ticket</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Text style={styles.title}>Booking histories</Text>
        <View style={styles.headings}>
          <Text style={styles.heading}>Source</Text>
          <Text style={styles.heading}>Destination</Text>
          <Text style={styles.heading}>Date</Text>
          <Text style={styles.heading}>Status</Text>
        </View>
        {data && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.headings}>
                <Text style={styles.value}>{item.source}</Text>
                <Text style={styles.value}>{item.destination}</Text>
                <Text style={styles.value}>{item.date}</Text>
                {item.status === "CANCELLED" && (
                  <Pressable
                    style={[styles.button, styles.buttonCancelStatus]}
                    onPress={() => {}}
                  >
                    <Text style={styles.textStyle}>CANCELLED</Text>
                  </Pressable>
                )}
                {item.status === "PASSED" && (
                  <Pressable
                    style={[styles.button, styles.buttonView]}
                    onPress={() => {}}
                  >
                    <Text style={styles.textStyle}>View</Text>
                  </Pressable>
                )}
                {item.status === "BOOKED" && (
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => {
                      setModalValue(item);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.textStyle}>View</Text>
                  </Pressable>
                )}
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}

export default History;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headings: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderRadius: 2,
  },
  heading: {
    width: "25%",
    textAlign: "center",
    color: "#841584",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "monospace",
    borderColor: "#FFFFFF",
    borderRadius: 2,
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  value: {
    width: "25%",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  centeredView: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    width: "25%",
    textAlign: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonCancel: {
    backgroundColor: "red",
    marginBottom: 50,
    width: "100%",
  },
  buttonCancelStatus: {
    backgroundColor: "red",
    opacity: 0.5,
  },
  buttonView: {
    backgroundColor: "grey",
    opacity: 0.5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
