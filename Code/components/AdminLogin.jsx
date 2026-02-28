import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dummy admin credentials
  const DUMMY_ADMIN = {
    email: 'admin@raah.com',
    password: 'admin123'
  };

  const handleAdminLogin = () => {
    if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
      // Successful login
      navigation.navigate("AdminDashboard");
    } else {
      // Invalid credentials
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  const handleBack = () => {
    navigation.navigate("Welcome");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5DC1D8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#ffffffff" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      {/* Form Section */}
      <KeyboardAvoidingView 
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#B0B0B0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Login as Admin Button */}
            <TouchableOpacity 
              style={styles.adminLoginButton}
              onPress={handleAdminLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.adminLoginButtonText}>Login as Admin</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
    height: '100%',
  },
  formWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#5DC1D8',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 120,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 55 : 55,
  },
  backIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    color: '#2C2C2C',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  adminLoginButton: {
    backgroundColor: '#5DC1D8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  adminLoginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});