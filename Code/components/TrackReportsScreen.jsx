import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  ArrowLeft,
  Home,
  BarChart3,
  PlusSquare,
  Settings,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function TrackReportsScreen() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("All");
  const [reports, setReports] = useState([]);

  const API_URL = "http://192.168.0.11:3000"; // your backend URL

  // Hardcoded reports
  const hardcodedReports = [
    {
      id: 1,
      icon: "🕳️",
      title: "Pothole Report",
      location: "Faisal Town",
      status: "Completed",
      description: "Large pothole causing traffic issue.",
      daysAgo: "2 days ago",
    },
    {
      id: 2,
      icon: "🗑️",
      title: "Garbage Report",
      location: "Canal Road",
      status: "Pending",
      description: "Area affected due to uncollected garbage.",
      daysAgo: "5 days ago",
    },
    {
      id: 3,
      icon: "💡",
      title: "Street Light",
      location: "Neelam Block Allama Iqbal Town",
      status: "Completed",
      description: "Street light outage causing inconvenience in the area.",
      daysAgo: "6 days ago",
    },
  ];

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`);
      const data = await response.json();

      if (Array.isArray(data.reports)) {
        // Combine backend reports with hardcoded ones
        const backendReports = data.reports.map((r) => ({
          id: r.id,
          icon: "📄",
          title: r.description || "No Title",
          location: r.location?.address || "Unknown Location",
          status: r.status || "Pending",
          description: r.description || "No Description",
          daysAgo: getDaysAgo(r.timestamp),
        }));

        setReports([...backendReports, ...hardcodedReports]);
      } else {
        console.log("Invalid data format from backend:", data);
        setReports(hardcodedReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports(hardcodedReports);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Calculate days ago
  const getDaysAgo = (timestamp) => {
    if (!timestamp) return "";
    const reportDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - reportDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : `${diffDays} days ago`;
  };

  const tabs = ["All", "Pending", "In Progress", "Completed"];

  const getFilteredReports = () => {
    if (selectedTab === "All") return reports;
    return reports.filter((report) => report.status === selectedTab);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "Pending":
        return "#9E9E9E";
      case "In Progress":
        return "#FF9800";
      default:
        return "#2196F3";
    }
  };

  const getCardBorderColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "Pending":
        return "#FFA500";
      default:
        return "#2196F3";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("UserDashboardScreen")}
        >
          <ArrowLeft color="#ffffff" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Track Reports</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredReports().map((report) => (
          <View
            key={report.id}
            style={[
              styles.reportCard,
              { borderLeftColor: getCardBorderColor(report.status) },
            ]}
          >
            <View style={styles.reportHeader}>
              <View style={styles.reportTitleRow}>
                <Text style={styles.reportIcon}>{report.icon}</Text>
                <Text style={styles.reportTitle}>{report.title}</Text>
              </View>
              <Text style={styles.daysAgo}>{report.daysAgo}</Text>
            </View>

            <Text style={styles.location}>{report.location}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(report.status) },
              ]}
            >
              <Text style={styles.statusText}>{report.status}</Text>
            </View>

            <Text style={styles.description}>{report.description}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("UserDashboardScreen")}
        >
          <Home color="#95A5A6" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <BarChart3 color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Track</Text>
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
  header: {
    backgroundColor: "#5DC1D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerText: { color: "white", fontSize: 24, fontWeight: "bold" },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ffffff",
    borderWidth: 2,
  },
  tabsWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  tabContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#5DC1D8" },
  tabText: { fontSize: 15, color: "#424242", fontWeight: "600" },
  activeTabText: { color: "#FFFFFF", fontWeight: "700" },
  reportsList: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitleRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  reportIcon: { fontSize: 20, marginRight: 8 },
  reportTitle: { fontSize: 16, fontWeight: "bold", color: "#2C3E50" },
  daysAgo: { fontSize: 12, color: "#95A5A6" },
  location: { fontSize: 13, color: "#7F8C8D", marginBottom: 12 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  statusText: { fontSize: 12, color: "#FFFFFF", fontWeight: "600" },
  description: { fontSize: 14, color: "#34495E", lineHeight: 20 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    elevation: 5,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 12, color: "#95A5A6", marginTop: 4 },
  navTextActive: {
    fontSize: 12,
    color: "#5DC1D8",
    marginTop: 4,
    fontWeight: "600",
  },
});
