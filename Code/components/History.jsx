import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Home, BarChart3, PlusSquare, Settings, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const History = () => {
  const navigation=useNavigation();

  const reports = [
    {
      id: 1,
      icon: "💡",
      title: "Street Light",
      location: "Neelam Block Allama Iqbal Town",
      status: "Completed",
      description: "Street light outage causing inconvenience in the area.",
      daysAgo: "1 day ago",
    },
    {
      id: 2,
      icon: "🗑️",
      title: "Garbage Report",
      location: "Canal Road",
      status: "Completed",
      description: "Area affected due to uncollected garbage.",
      daysAgo: "5 days ago",
    },
    {
      id: 3,
      icon: "🕳️",
      title: "Pothole Report",
      location: "Faisal Town",
      status: "Completed",
      description: "Large pothole causing traffic issue.",
      daysAgo: "7 days ago",
    },
  ];

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
        onPress={() => navigation.navigate("AdminDashboard")}>
          <ArrowLeft color="#ffffffff" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerText}>History</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Reports ONLY */}
      <ScrollView style={styles.reportsList}>
        {reports.map((report) => (
          <View
            key={report.id}
            style={[
              styles.reportCard,
              { borderLeftColor: "#5DC1D8" },
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

            {/* Completed Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: "#5DC1D8" },
              ]}
            >
              <Text style={styles.statusText}>Completed</Text>
            </View>

            <Text style={styles.description}>{report.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("AdminDashboard")}>
          <Home color="#95A5A6" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <BarChart3 color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("ReportStatus")}>
          <PlusSquare color="#95A5A6" size={24} />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate("AdminSettings")}>
          <Settings color="#95A5A6" size={24} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    width: "100%",
    height: "100%",
  },

  header: {
    backgroundColor: '#5DC1D8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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

  /* CARDS */
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

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

  reportTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  reportIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  daysAgo: {
    fontSize: 12,
    color: "#9E9E9E",
  },

  location: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 10,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 10,
  },

  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  description: {
    fontSize: 14,
    color: "#424242",
  },

  /* Bottom Nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    justifyContent: "space-around",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },

  navTextActive: {
    color: "#5DADE2",
    fontWeight: "600",
  },
});
export default History;