import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import authService from '../services/authService';
import styles from '../styles/AuthScreenStyles';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [activeGender, setActiveGender] = useState(null);
  const [sliderPosition] = useState(new Animated.Value(0));

  const handleSliderToggle = (loginMode) => {
    Animated.timing(sliderPosition, {
      toValue: loginMode ? 0 : width / 2 - 20,
      duration: 300,
      useNativeDriver: false
    }).start();

    // Reset form fields
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      password: '',
      confirmPassword: ''
    });

    setActiveGender(null);
    setIsLogin(loginMode);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGenderSelect = (gender) => {
    setActiveGender(gender);
    handleInputChange('gender', gender);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email.trim() && !formData.phone.trim()) {
        Alert.alert('Error', 'Email or phone number is required.');
        return false;
      }
      if (!formData.password.trim()) {
        Alert.alert('Error', 'Password is required.');
        return false;
      }
    } else {
      if (!formData.fullName.trim()) {
        Alert.alert('Error', 'Full name is required.');
        return false;
      }
      if (!formData.email.trim() || !validateEmail(formData.email)) {
        Alert.alert('Error', 'A valid email is required.');
        return false;
      }
      if (!formData.phone.trim() || !validatePhone(formData.phone)) {
        Alert.alert('Error', 'A valid phone number is required (10–15 digits).');
        return false;
      }
      if (!formData.gender) {
        Alert.alert('Error', 'Please select your gender.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const credentials = {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password
        };

        const result = await authService.customerLogin(credentials);

        if (result.success) {
          Alert.alert(
            'Success',
            result.message || 'Login successful!',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to Dashboard/Home screen
                  navigation.replace('Dashboard'); // or navigation.navigate('Home')
                }
              }
            ]
          );
        } else {
          Alert.alert('Login Failed', result.message);
        }
      } else {
        // Handle Signup
        const signupData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };

        const result = await authService.customerSignup(signupData);

        if (result.success) {
          Alert.alert(
            'Success',
            result.message || 'Account created successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to Dashboard/Home screen or Verification screen
                  navigation.replace('Dashboard'); // or navigation.navigate('Verification')
                }
              }
            ]
          );
        } else {
          Alert.alert('Signup Failed', result.message);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Error', 
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome to TAPYZE</Text>
            <Text style={styles.headerSubtitle}>
              {isLogin ? 'Login to access your wallet' : 'Create a new account'}
            </Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Animated.View style={[styles.sliderIndicator, { left: sliderPosition }]} />
            <TouchableOpacity style={styles.sliderOption} onPress={() => handleSliderToggle(true)}>
              <Text style={[styles.sliderOptionText, isLogin && styles.activeOptionText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sliderOption} onPress={() => handleSliderToggle(false)}>
              <Text style={[styles.sliderOptionText, !isLogin && styles.activeOptionText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{isLogin ? 'Email / Phone Number' : 'Email'}</Text>
              <TextInput
                style={styles.input}
                placeholder={isLogin ? "Enter email or phone number" : "Enter your email"}
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  editable={!isLoading}
                />
              </View>
            )}

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        activeGender === gender && styles.activeGenderOption
                      ]}
                      onPress={() => handleGenderSelect(gender)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.genderText,
                        activeGender === gender && styles.activeGenderText
                      ]}>{gender}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                editable={!isLoading}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  editable={!isLoading}
                />
              </View>
            )}

            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPasswordContainer} 
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot your current password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                    {isLogin ? 'Logging in...' : 'Creating Account...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Auth */}
          <View style={styles.alternativeAuthContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={styles.googleButton}
                disabled={isLoading}
              >
                <Image source={require('../assets/google-icon.png')} style={styles.icon} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;