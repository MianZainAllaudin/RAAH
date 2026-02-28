import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Home,
  BarChart3,
  PlusSquare,
  Settings,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function UserDashboardScreen() {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickReportItems = [
    { id: 1, title: "Pothole", icon: "🕳️" },
    { id: 2, title: "Traffic Signal", icon: "🚦" },
    { id: 3, title: "Garbage", icon: "🗑️" },
    { id: 4, title: "Street Light", icon: "💡" },
    { id: 5, title: "Road Signs", icon: "🚧" },
    { id: 6, title: "Blocked Drains", icon: "🚰" },
  ];

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://192.168.0.11:3000/api/reports");
        if (!response.ok) throw new Error("Network response not ok");
        const data = await response.json();
        setReports(data.reports || []);
      } catch (error) {
        console.log("Error fetching reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Compute dynamic counts
  const totalReports = reports.length;
  const resolvedReports = reports.filter(
    (r) => r.status?.toLowerCase() === "resolved"
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("LogIn")}
        >
          <ArrowLeft color="#ffffff" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome!</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports or locations"
            placeholderTextColor="#95A5A6"
          />
          <Search color="#7F8C8D" size={20} />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#5DC1D8" />
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalReports}</Text>
                <Text style={styles.statLabel}>Your Reports</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{resolvedReports}</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
            </>
          )}
        </View>

        {/* Quick Report Section */}
        <Text style={styles.sectionTitle}>Quick Report</Text>
        <View style={styles.quickReportGrid}>
          {quickReportItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.reportItem}>
              <View style={styles.reportIconContainer}>
                <Text style={styles.reportEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.reportTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TrackReportsScreen")}
        >
          <BarChart3 color="#95A5A6" size={24} />
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("UserReportScreen")}
        >
          <PlusSquare color="#95A5A6" size={24} />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <Settings color="#95A5A6" size={24} />
          <Text style={styles.navText}>Settings</Text>
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
    paddingTop: 50,
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
    borderColor: "#ffffff",
    borderWidth: 2,
  },

  // -------- CONTENT --------
  content: {
    flex: 1,
    padding: 20,
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECF0F1",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2C3E50",
    paddingVertical: 0,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5DC1D8",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "center",
  },

  // Quick Report Grid
  quickReportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reportItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  reportEmoji: {
    fontSize: 36,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
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
    fontWeight: "600",
  },
});
