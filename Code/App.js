import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./components/WelcomeScreen";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminSettings from "./components/AdminSettings";
import TrackReportsScreen from "./components/TrackReportsScreen";
import Settings from "./components/Settings";
import UserDashboardScreen from "./components/UserDashboardScreen";
import UserReportScreen from "./components/UserReportScreen";
import History from "./components/History";
import ReportStatus from "./components/ReportStatus";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Admin */}
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="AdminSettings" component={AdminSettings} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="ReportStatus" component={ReportStatus} />
        
        {/* Admin */}
        <Stack.Screen name="UserDashboardScreen" component={UserDashboardScreen} />
        <Stack.Screen name="UserReportScreen" component={UserReportScreen} />
        <Stack.Screen name="TrackReportsScreen" component={TrackReportsScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="LogIn" component={LogIn} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

