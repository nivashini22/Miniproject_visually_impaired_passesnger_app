import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import Home from './src/pages/Home';
import Booking from './src/pages/Booking';
import History from './src/pages/History';
import TextToSpeech from "./src/helper/TextToSpeech";
import SyncStorage from 'sync-storage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  console.log("CAME HERE ")
  SyncStorage.remove('isVIUser')
  SyncStorage.remove('page')
  SyncStorage.remove('bookingPage')
  SyncStorage.remove('historyPage')
  SyncStorage.remove('bookingDetails')

  function HomeScreen() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: () => {
            let iconName = "";

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Booking") {
              iconName = "bus";
            } else if (route.name === "History") {
              iconName = "history";
            }
            return <FontAwesome5 name={iconName} size={24} color="black" />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Booking" component={Booking} />
        <Tab.Screen name="History" component={History} />
        {/* <Tab.Screen name="TextToSpeech" component={TextToSpeech} /> */}
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TextToSpeech" component={TextToSpeech} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}