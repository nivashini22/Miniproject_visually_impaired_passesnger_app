import SyncStorage from "sync-storage";
import {
  BOOK_TICKET,
  CANCELS,
  CARD_CVV,
  CARD_DATE,
  CARD_NUMBER,
  CONFIRM,
  CONFIRMS,
  DATE,
  DATES,
  DESTINATION,
  DESTINATIONS,
  GET_HISTORIES,
  GET_HISTORIES_MONTH,
  HOME_PAGE,
  IP_ADDRESS,
  MONTH,
  MONTHS,
  NAME,
  SOURCE,
  SOURCES,
  TICKET_BOOKED,
  WRONG,
  YEAR,
  YEARS,
} from "../pages/constant";
import * as Speech from "expo-speech";

export const setIsVIUser = async (val) => {
  try {
    SyncStorage.set("isVIUser", val);
  } catch (error) {
    // Error saving data
  }
};

export const getIsVIUser = async (val) => {
  try {
    return SyncStorage.get("isVIUser");
  } catch (error) {
    // Error saving data
  }
};

export const removeIsVIUser = async (val) => {
  try {
    return SyncStorage.remove("isVIUser");
  } catch (error) {
    // Error saving data
  }
};

export const bookingHelper = async (transcript) => {
  transcript = transcript.toLowerCase();
  console.log(`transcript-${transcript}`);
  console.log("page ", SyncStorage.get("page"));
  console.log("bookingPage ", SyncStorage.get("bookingPage"));
  console.log("historyPage ", SyncStorage.get("historyPage"));
  if (["reset"].includes(transcript) || HOME_PAGE.includes(transcript)) {
    SyncStorage.remove("page");
    SyncStorage.remove("bookingPage");
    SyncStorage.remove("historyPage");
    SyncStorage.remove("bookingDetails");
    return "reset";
  }

  // if (!SyncStorage.get("page")) {
  if (BOOK_TICKET.includes(transcript)) {
    SyncStorage.set("page", "booking");
    SyncStorage.set("bookingPage", "1");
    SyncStorage.remove("historyPage");
    Speech.speak(DESTINATION);
  } else if (GET_HISTORIES.includes(transcript)) {
    SyncStorage.set("page", "history");
    SyncStorage.set("historyPage", "1");
    SyncStorage.remove("bookingPage");
    SyncStorage.remove("bookingDetails");
    Speech.speak(GET_HISTORIES_MONTH);
  } else {
    if (SyncStorage.get("page") == "booking") {
      // Destination
      if (SyncStorage.get("bookingPage") == "1") {
        if (DESTINATIONS.includes(transcript)) {
          SyncStorage.set(
            "bookingDetails",
            JSON.stringify({ destination: transcript })
          );
          await SyncStorage.set("bookingPage", "2");
          Speech.speak(SOURCE);
        } else {
          Speech.speak(WRONG);
        }
      }
      // Source
      else if (SyncStorage.get("bookingPage") == "2") {
        if (SOURCES.includes(transcript)) {
          let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
          bookingDetails.source = transcript;
          SyncStorage.set("bookingDetails", JSON.stringify(bookingDetails));
          await SyncStorage.set("bookingPage", "3");
          Speech.speak(YEAR);
        } else {
          Speech.speak(WRONG);
        }
      }
      // Year of journey
      else if (SyncStorage.get("bookingPage") == "3") {
        if (YEARS.includes(transcript)) {
          let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
          bookingDetails.year = transcript;
          SyncStorage.set("bookingDetails", JSON.stringify(bookingDetails));
          await SyncStorage.set("bookingPage", "4");
          Speech.speak(MONTH);
        } else {
          Speech.speak(WRONG);
        }
      }
      // Month of journey
      else if (SyncStorage.get("bookingPage") == "4") {
        if (MONTHS.includes(transcript)) {
          let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
          let month = MONTHS.findIndex((m) => transcript == m) + 1;
          bookingDetails.month = month.length == 1 ? "0" + month : month;
          SyncStorage.set("bookingDetails", JSON.stringify(bookingDetails));
          SyncStorage.set("bookingPage", "5");
          Speech.speak(DATE);
        } else {
          Speech.speak(WRONG);
        }
      }
      // Date of journey
      else if (SyncStorage.get("bookingPage") == "5") {
        if (DATES.includes(transcript)) {
          let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
          bookingDetails.date =
            DATES.findIndex((date) => transcript == date) + 1;
          SyncStorage.set("bookingDetails", JSON.stringify(bookingDetails));
          SyncStorage.set("bookingPage", "6");
          Speech.speak(NAME);
        } else {
          Speech.speak(WRONG);
        }
      }
      // Name
      else if (SyncStorage.get("bookingPage") == "6") {
        let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
        bookingDetails.name = transcript;
        SyncStorage.set("bookingDetails", JSON.stringify(bookingDetails));
        SyncStorage.set("bookingPage", "7");
        Speech.speak(CARD_NUMBER);
      }
      //CARD NUMBER
      else if (SyncStorage.get("bookingPage") == "7") {
        if (transcript.replaceAll(" ", "").length === 16) {
          SyncStorage.set("bookingPage", "8");
          Speech.speak(CARD_DATE);
        } else {
          Speech.speak(WRONG);
        }
      }
      //CARD EXPIRY DATE
      else if (SyncStorage.get("bookingPage") == "8") {
        if (true) {
          SyncStorage.set("bookingPage", "9");
          Speech.speak(CARD_CVV);
        } else {
          Speech.speak(WRONG);
        }
      }
      //CARD CVV
      else if (SyncStorage.get("bookingPage") == "9") {
        if (transcript.replaceAll(" ", "").length === 3) {
          SyncStorage.set("bookingPage", "10");
          Speech.speak(CONFIRM);
        } else {
          Speech.speak(WRONG);
        }
      }
      // CONFIRM
      else if (SyncStorage.get("bookingPage") == "10") {
        if (CONFIRMS.includes(transcript)) {
          let bookingDetails = JSON.parse(SyncStorage.get("bookingDetails"));
          SyncStorage.set("bookingPage", "11");
          const data = {
            destination:
              bookingDetails.destination.charAt(0).toUpperCase() +
              bookingDetails.destination.slice(1),
            source:
              bookingDetails.source.charAt(0).toUpperCase() +
              bookingDetails.source.slice(1),
            date: `${bookingDetails.date}/${bookingDetails.month}/${bookingDetails.year}`,
            name: bookingDetails.name,
            address: "",
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
          Speech.speak(TICKET_BOOKED);
          SyncStorage.remove("page");
          SyncStorage.remove("bookingPage");
          SyncStorage.remove("historyPage");
          SyncStorage.remove("bookingDetails");
          return "reset";
        } else {
          Speech.speak(WRONG);
        }
      }
    }
    if (SyncStorage.get("page") == "history") {
      const bookings = await getBookings();
      if (SyncStorage.get("historyPage") == "1") {
        if (MONTHS.includes(transcript)) {
          let month = MONTHS.findIndex((month) => transcript == month) + 1;
          month = month.length == 1 ? "0" + month : month;
          let result = bookings.data.filter((booking) => {
            let bookingMonth = booking.date.split("/")[1];
            if (bookingMonth == month) {
              return booking;
            }
          });
          if (result.length) {
            result.map((booking, i) => {
              const { id, address, date, destination, name, source, status } =
                booking;
              Speech.speak("Ticket ID: " + id);
              Speech.speak("Source: " + source);
              Speech.speak("Destination: " + destination);
              Speech.speak("Date: " + date);
              Speech.speak("Name: " + name);
              Speech.speak("Address: " + address);
              Speech.speak("Status: " + status);
              if (i == result.length - 1) {
                Speech.speak("Booking for " + transcript + "is over");
              } else {
                Speech.speak("Next ticket....");
              }
              Speech.speak(
                'Say "cancel" to cancel a ticket or say month to get the bookings of that month'
              );
            });
          } else {
            Speech.speak(
              "No booking for " +
                transcript +
                'month. Please say another month or "cancel" to cancel a ticket'
            );
          }
        } else if (CANCELS.includes(transcript)) {
          Speech.speak("Say the ticket ID to cancel the ticket");
          await SyncStorage.set("historyPage", "2");
        } else {
          Speech.speak(WRONG);
        }
      }
      else if (SyncStorage.get("historyPage") == "2") {
        if (parseInt(transcript) >= 1 && parseInt(transcript) < 100) {
          const booking = bookings.data.find(
            (booking) => booking.id == transcript
          );
          if (!booking) {
            Speech.speak("Wrong ticket ID, try again");
          } else {
            await cancelTicket(transcript);
            Speech.speak("Ticket cancelled successfully");
          }
        } else if (GET_HISTORIES.includes(transcript)) {
          await SyncStorage.set("historyPage", "1");
          Speech.speak(GET_HISTORIES_MONTH);
        } else {
          Speech.speak(WRONG);
        }
      }
    }
  }
  // }
};

const getBookings = async () => {
  const response = await fetch(`http://${IP_ADDRESS}:9000/bookings`);
  const data = await response.json();
  return data;
};

const cancelTicket = async (id) => {
  await fetch(`http://${IP_ADDRESS}:9000/bookings/cancel`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { id } }),
  });
};
