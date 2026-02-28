import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Home,
  BarChart3,
  PlusSquare,
  Settings,
  ArrowLeft,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const ReportStatus = () => {
  const navigation = useNavigation();

  // DEFAULT TAB = "Pending"
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded reports
  const hardcodedReports = [
    {
      id: 1,
      icon: "🕳️",
      title: "Pothole Report",
      location: "Faisal Town",
      status: "Pending",
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
      status: "In Progress",
      description: "Street light outage causing inconvenience in the area.",
      daysAgo: "6 days ago",
    },
  ];

  const tabs = ["Pending", "In Progress", "Assigned", "Unassigned"];

  // Fetch reports from server
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://192.168.0.11:3000/api/reports");
        console.log("Fetch response status:", response.status);

        if (!response.ok) throw new Error("Network response not ok");

        const data = await response.json();
        console.log("Fetched data:", data);

        if (!data.reports) {
          console.log("No reports array in response!");
          setFetchedReports([]);
          return;
        }

        const mappedReports = data.reports.map((r) => ({
          id: r.id,
          icon: "📌",
          title: r.description || "New Report",
          location: r.location?.address || "Unknown Location",
          status:
            r.status?.charAt(0).toUpperCase() + r.status?.slice(1) || "Pending",
          description: r.description || "",
          daysAgo: "Just now",
        }));

        setFetchedReports(mappedReports);
      } catch (error) {
        console.log("Error fetching reports:", error);
        setFetchedReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Merge hardcoded + fetched reports in Pending tab
  const getFilteredReports = () => {
    let reports = [...hardcodedReports];

    // Add fetched reports only to Pending
    if (selectedTab === "Pending") {
      reports = [
        ...reports,
        ...fetchedReports.filter((r) => r.status === "Pending"),
      ];
    } else {
      // For other tabs, show only matching hardcoded + fetched
      reports = [
        ...hardcodedReports.filter((r) => r.status === selectedTab),
        ...fetchedReports.filter((r) => r.status === selectedTab),
      ];
    }

    return reports;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("AdminDashboard")}
        >
          <ArrowLeft color="#ffffffff" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Report Status</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
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

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#5DC1D8" />}

      {/* Reports */}
      <ScrollView style={styles.reportsList}>
        {getFilteredReports().map((report) => (
          <View
            key={report.id}
            style={[styles.reportCard, { borderLeftColor: "#5DC1D8" }]}
          >
            <View style={styles.reportHeader}>
              <View style={styles.reportTitleRow}>
                <Text style={styles.reportIcon}>{report.icon}</Text>
                <Text style={styles.reportTitle}>{report.title}</Text>
              </View>
              <Text style={styles.daysAgo}>{report.daysAgo}</Text>
            </View>

            <Text style={styles.location}>{report.location}</Text>

            <View style={[styles.statusBadge]}>
              <Text style={styles.statusText}>{report.status}</Text>
            </View>

            <Text style={styles.description}>{report.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("AdminDashboard")}
        >
          <Home color="#95A5A6" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("History")}
        >
          <BarChart3 color="#95A5A6" size={24} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <PlusSquare color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("AdminSettings")}
        >
          <Settings color="#95A5A6" size={24} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Keep existing styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    borderColor: "#ffffffff",
    borderWidth: 2,
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 0,
  },
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
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reportTitleRow: { flexDirection: "row", alignItems: "center" },
  reportIcon: { fontSize: 20, marginRight: 8 },
  reportTitle: { fontSize: 16, fontWeight: "bold" },
  daysAgo: { fontSize: 12, color: "#9E9E9E" },
  location: { fontSize: 13, color: "#757575", marginBottom: 10 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#9E9E9E",
    marginBottom: 10,
  },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  description: { fontSize: 14, color: "#424242" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    justifyContent: "space-around",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "#757575", marginTop: 4 },
  navTextActive: { color: "#5DADE2", fontWeight: "600" },
});

export default ReportStatus;
