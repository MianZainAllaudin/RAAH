import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function WelcomeScreen({navigation}) {
  const handleGetStarted = () => {
    console.log('Get Started pressed');
    navigation.navigate("SignUp");
    // Navigate to user flow
  };

  const handleContinueAsAdmin = () => {
    console.log('Continue as Admin pressed');
    navigation.navigate("AdminLogin");
    // Navigate to admin flow
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>RAAH</Text>
          <Text style={styles.subtitle}>Road Assessment And Hazards</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.welcomeText}>Welcome to RAAH</Text>
        <Text style={styles.description}>
          Report road issues, track progress, and help build safer communities together.
        </Text>

        {/* Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleContinueAsAdmin}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Continue as Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: '40%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    letterSpacing: 1,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#7CD4E8',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7CD4E8',
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7CD4E8',
    fontSize: 16,
    fontWeight: '600',
  },
});