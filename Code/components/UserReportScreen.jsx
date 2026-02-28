import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Camera,
  Home,
  BarChart3,
  PlusSquare,
  Settings,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function UserReportScreen() {
  const navigation = useNavigation();
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low - Minor inconvenience");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({
    address: "Faisal Town, Lahore, Punjab",
    coordinates: null,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const severityOptions = [
    "Low - Minor inconvenience",
    "Medium - Noticeable issue",
    "High - Significant problem",
    "Critical - Urgent attention required",
  ];

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to get your current location.",
          [{ text: "OK" }]
        );
        setLoadingLocation(false);
        return;
      }

      // Get current position with highest accuracy
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Try using Google's Geocoding API for better results
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address;
          setLocation({
            address: formattedAddress,
            coordinates: { latitude, longitude },
          });
          console.log("Location updated (Google):", formattedAddress);
        } else {
          throw new Error("No results from Google");
        }
      } catch (googleError) {
        // Fallback to Expo's reverse geocoding
        console.log("Using Expo geocoding fallback");
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];

          // Build a more detailed address string
          const addressParts = [
            address.name,
            address.street,
            address.streetNumber,
            address.district,
            address.subregion,
            address.city,
            address.region,
            address.postalCode,
            address.country,
          ].filter((part) => part && part.trim() !== "");

          // Remove duplicates
          const uniqueParts = [...new Set(addressParts)];

          const formattedAddress =
            uniqueParts.length > 0
              ? uniqueParts.join(", ")
              : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setLocation({
            address: formattedAddress,
            coordinates: { latitude, longitude },
          });

          console.log("Location updated (Expo):", formattedAddress);
          console.log("Address details:", address);
        } else {
          // If no address found, show coordinates
          setLocation({
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            coordinates: { latitude, longitude },
          });
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location. Please try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLocationPress = () => {
    Alert.alert(
      "Update Location",
      "Do you want to update your current location?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: getCurrentLocation,
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos. Please enable it in your device settings.",
        [{ text: "OK" }]
      );
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhoto = result.assets[0];
      setPhoto(selectedPhoto);
      console.log("Photo captured:", selectedPhoto.uri);
    }
  };

  const handleSeveritySelect = (selectedSeverity) => {
    setSeverity(selectedSeverity);
    setShowSeverityModal(false);
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert("Missing Photo", "Please take a photo of the issue");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please describe the issue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use fetch to read the image file
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      // Convert blob to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Prepare the report data
      const reportData = {
        location: {
          address: location.address,
          coordinates: location.coordinates,
        },
        image: base64, // Already has the data:image/jpeg;base64, prefix
        description: description.trim(),
        severity: severity,
      };

      console.log("Submitting report to server...");

      // Send to backend API
      const apiResponse = await fetch("http://192.168.0.11:3000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await apiResponse.json();

      if (apiResponse.ok) {
        Alert.alert("Success", "Report submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setPhoto(null);
              setDescription("");
              setSeverity("Low - Minor inconvenience");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert(
        "Error",
        "Failed to submit report. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
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

        <Text style={styles.headerText}>Report</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        <TouchableOpacity
          style={styles.locationCard}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <MapPin color="#34495E" size={24} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.locationSubtitle}>
              {loadingLocation ? "Getting location..." : location.address}
            </Text>
          </View>
          {loadingLocation && (
            <ActivityIndicator size="small" color="#5DC1D8" />
          )}
        </TouchableOpacity>

        {/* Take Photo Section */}
        <TouchableOpacity
          style={styles.photoContainer}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          {photo ? (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handleTakePhoto}
                disabled={isSubmitting}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Camera color="#5DC1D8" size={48} />
              <Text style={styles.photoTitle}>Take Photo</Text>
              <Text style={styles.photoSubtitle}>Tap to capture the issue</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Describe the issue in detail..."
          placeholderTextColor="#BDC3C7"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
          editable={!isSubmitting}
        />

        {/* Severity Level */}
        <Text style={styles.label}>Severity Level</Text>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setShowSeverityModal(true)}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={styles.dropdownText}>{severity}</Text>
          <Text style={styles.dropdownArrow}>⌄</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Severity Level Modal */}
      <Modal
        visible={showSeverityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSeverityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSeverityModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Severity Level</Text>
              <TouchableOpacity
                onPress={() => setShowSeverityModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {severityOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalOption,
                  severity === option && styles.modalOptionSelected,
                ]}
                onPress={() => handleSeveritySelect(option)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    severity === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {severity === option && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("UserDashboardScreen")}
        >
          <Home color="#95A5A6" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TrackReportsScreen")}
        >
          <BarChart3 color="#95A5A6" size={24} />
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <PlusSquare color="#5DC1D8" size={24} />
          <Text style={styles.navTextActive}>Report</Text>
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

  // Location Card
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F6F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#5D6D7E",
  },

  // Photo Container
  photoContainer: {
    borderWidth: 2,
    borderColor: "#D5D8DC",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    minHeight: 200,
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  photoSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },

  // Photo Preview
  photoPreviewContainer: {
    width: "100%",
    alignItems: "center",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changePhotoButton: {
    backgroundColor: "#5DC1D8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  changePhotoText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // Labels and Inputs
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D8DC",
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: "#34495E",
    minHeight: 120,
    marginBottom: 24,
  },

  // Dropdown
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D8DC",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  dropdownText: {
    fontSize: 15,
    color: "#34495E",
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 20,
    color: "#5D6D7E",
  },

  // Submit Button
  submitButton: {
    backgroundColor: "#5DC1D8",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#95A5A6",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
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
    fontWeight: "600",
  },

  // ------- Modal Styles -------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 18,
    color: "#7F8C8D",
    fontWeight: "bold",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F8F9FA",
  },
  modalOptionSelected: {
    backgroundColor: "#E8F6F8",
    borderWidth: 2,
    borderColor: "#5DC1D8",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#34495E",
    flex: 1,
  },
  modalOptionTextSelected: {
    color: "#2C3E50",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#5DC1D8",
    fontWeight: "bold",
  },
});
