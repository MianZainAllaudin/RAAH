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

export default function ReportDashboard() {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [reports, setReports] = useState([]);

  const API_URL = "http://192.168.0.11:3000"; // change to your backend URL

  // Hardcoded recent high priority report
  const hardcodedReports = [
    {
      id: 1,
      icon: "🕳️",
      title: "Major Pothole",
      location: "Johar Town, Lahore",
      status: "Pending",
      description: "Large pothole causing traffic issue.",
    },
  ];

  // Fetch reports from backend JSON
  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`);
      const data = await response.json();

      if (Array.isArray(data.reports)) {
        const backendReports = data.reports.map((r) => ({
          id: r.id,
          icon: "📄",
          title: r.description || "No Title",
          location: r.location?.address || "Unknown Location",
          status: r.status || "Pending",
          description: r.description || "No Description",
        }));
        setReports([...backendReports, ...hardcodedReports]);
      } else {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("AdminLogin")}
        >
          <ArrowLeft color="#ffffffff" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Welcome!</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reports.length}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reports.filter((r) => r.status === "Pending").length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reports.filter((r) => r.status === "In Progress").length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reports.filter((r) => r.status === "Completed").length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Recent High Priority Reports */}
        <Text style={styles.sectionTitle}>Recent High Priority Reports</Text>

        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.reportIcon}>{report.icon}</Text>
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportLocation}>{report.location}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.pendingButton,
                  report.status === "Completed"
                    ? { backgroundColor: "#4CAF50" }
                    : {},
                ]}
              >
                <Text style={styles.pendingButtonText}>{report.status}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.assignButtonText}>Assign Team</Text>
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownBox}>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text>Assign Team</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text>Mark Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export Data</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("History")}
        >
          <BarChart3 color="#95A5A6" size={24} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ReportStatus")}
        >
          <PlusSquare color="#95A5A6" size={24} />
          <Text style={styles.navText}>Report</Text>
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
    borderColor: "#ffffffff",
    borderWidth: 2,
  },
  content: { flex: 1, padding: 16 },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5DC1D8",
    marginBottom: 8,
  },
  statLabel: { fontSize: 14, color: "#34495E", textAlign: "center" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D6D7E",
    marginTop: 8,
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#ECF0F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reportIcon: { fontSize: 24, textAlign: "center" },
  reportInfo: { flex: 1 },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  reportLocation: { fontSize: 14, color: "#7F8C8D" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  pendingButton: {
    backgroundColor: "#5DC1D8",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center",
  },
  pendingButtonText: { color: "white", fontWeight: "600", textAlign: "center" },
  assignButton: {
    backgroundColor: "#BDC3C7",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  assignButtonText: {
    color: "#2C3E50",
    fontWeight: "600",
    textAlign: "center",
  },
  dropdownBox: {
    backgroundColor: "#fff",
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  generateButton: {
    backgroundColor: "#5DC1D8",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  generateButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  exportButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#5DC1D8",
    alignItems: "center",
  },
  exportButtonText: { color: "#5DC1D8", fontSize: 16, fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 12, color: "#95A5A6", marginTop: 4 },
  navTextActive: { fontSize: 12, color: "#5DC1D8", marginTop: 4 },
});
