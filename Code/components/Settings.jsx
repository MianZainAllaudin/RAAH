// SettingsScreen.js - Complete React Native Settings Page (NO SafeAreaView)
import React, { useState } from "react";
import { View,Text,StyleSheet,TouchableOpacity,ScrollView,Switch } from "react-native";
import { ArrowLeft,Moon,MapPin,Bell,Globe,User,Lock,HelpCircle,Info,Home,BarChart3,PlusSquare,Settings } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function SettingsApp() {
  const navigation=useNavigation();
  const [darkTheme, setDarkTheme] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
        onPress={() => navigation.navigate("UserDashboardScreen")}>
          <ArrowLeft color="#ffffffff" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Settings</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dark Theme Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon color="#5D6D7E" size={24} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Dark Theme</Text>
              <Text style={styles.settingSubtitle}>Toggle Dark/Light mode</Text>
            </View>
          </View>

          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: "#D5D8DC", true: "#5DC1D8" }}
            thumbColor="white"
          />
        </View>

        {/* Location Services Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MapPin color="#5D6D7E" size={24} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Location Services</Text>
              <Text style={styles.settingSubtitle}>Allow Location Access</Text>
            </View>
          </View>

          <Switch
            value={locationServices}
            onValueChange={setLocationServices}
            trackColor={{ false: "#D5D8DC", true: "#5DC1D8" }}
            thumbColor="white"
          />
        </View>

        {/* Push Notifications Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell color="#5D6D7E" size={24} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>
                Get updates on your reports
              </Text>
            </View>
          </View>

          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#D5D8DC", true: "#5DC1D8" }}
            thumbColor="white"
          />
        </View>

        {/* Language Section */}
        <View style={styles.languageSection}>
          <View style={styles.languageHeader}>
            <Globe color="#5D6D7E" size={24} />
            <Text style={styles.languageTitle}>Language</Text>
          </View>

          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>English</Text>
            <Text style={styles.dropdownArrow}>⌄</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <User color="#34495E" size={24} />
          <Text style={styles.menuText}>Profile Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Lock color="#34495E" size={24} />
          <Text style={styles.menuText}>Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <HelpCircle color="#34495E" size={24} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Info color="#34495E" size={24} />
          <Text style={styles.menuText}>About RAAH</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}
        onPress={() => navigation.navigate("LogIn")}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("UserDashboardScreen")}>
          <Home color="#95A5A6" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("TrackReportsScreen")}>
          <BarChart3 color="#95A5A6" size={24} />
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("UserReportScreen")}>
          <PlusSquare color="#95A5A6" size={24} />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Settings color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    width: "100%",
    height: "100%",
  },

  // -------- HEADER --------
  header: {
    backgroundColor: "#5DC1D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50, // handles notch without SafeAreaView
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ffffffff",
    borderWidth: 2,
  },

  // -------- CONTENT --------
  content: {
    flex: 1,
    padding: 20,
  },

  // Setting items
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#7F8C8D",
  },

  // Language section
  languageSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
    marginLeft: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D5D8DC",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 15,
    color: "#5D6D7E",
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#5D6D7E",
  },

  // Menu items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  menuText: {
    fontSize: 16,
    color: "#34495E",
    marginLeft: 16,
    fontWeight: "500",
  },

  // Logout
  logoutButton: {
    backgroundColor: "#5DC1D8",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // ------- Bottom Navigation -------
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: "#5DC1D8",
    marginTop: 4,
  },
});
