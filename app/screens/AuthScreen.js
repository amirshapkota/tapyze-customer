import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isLogin) {
      console.log('Login with:', {
        emailOrPhone: formData.email || formData.phone,
        password: formData.password
      });
      // navigation.navigate('Home');
    } else {
      console.log('Sign up with:', formData);
      // navigation.navigate('Verification');
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
                />
              </View>
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
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
              <TouchableOpacity style={styles.googleButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    position: 'relative',
    marginBottom: 30,
  },
  sliderIndicator: {
    position: 'absolute',
    top: 5,
    width: width / 2 - 30,
    height: 40,
    backgroundColor: '#ed7b0e',
    borderRadius: 20,
    zIndex: 1,
  },
  sliderOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeOption: {
    // No styles needed as indicator handles the highlighting
  },
  sliderOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  activeOptionText: {
    color: '#ffffff',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 55,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeGenderOption: {
    backgroundColor: '#fff3e8',
    borderColor: '#ed7b0e',
  },
  genderText: {
    fontSize: 14,
    color: '#666666',
  },
  activeGenderText: {
    color: '#ed7b0e',
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#ed7b0e',
    fontWeight: '500',
  },
  submitButton: {
    height: 55,
    backgroundColor: '#ed7b0e',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ed7b0e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  alternativeAuthContainer: {
    marginVertical: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 14,
    color: '#666666',
    paddingHorizontal: 10,
  },
  socialButtonsContainer: {
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    width: '40%',
    height: 45,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 12,
    textAlign: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
});
export default AuthScreen;
