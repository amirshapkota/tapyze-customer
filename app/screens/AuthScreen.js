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
  Image
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

  // Animation value for the slider
  const [sliderPosition] = useState(new Animated.Value(0));

  const handleSliderToggle = (loginMode) => {
    Animated.timing(sliderPosition, {
      toValue: loginMode ? 0 : width / 2 - 20,
      duration: 300,
      useNativeDriver: false
    }).start();
    setIsLogin(loginMode);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleGenderSelect = (gender) => {
    setActiveGender(gender);
    handleInputChange('gender', gender);
  };

  const handleSubmit = () => {
    // Handle form submission based on isLogin state
    if (isLogin) {
      console.log('Login with:', {
        emailOrPhone: formData.email || formData.phone,
        password: formData.password
      });
      // Navigate to home screen or handle login API call
      // navigation.navigate('Home');
    } else {
      console.log('Sign up with:', formData);
      // Handle signup API call
      // Then navigate to verification or home screen
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome to TapPay</Text>
            <Text style={styles.headerSubtitle}>
              {isLogin ? 'Login to access your wallet' : 'Create a new account'}
            </Text>
          </View>

          {/* Login/Signup Slider Toggle */}
          <View style={styles.sliderContainer}>
            <Animated.View 
              style={[
                styles.sliderIndicator, 
                { left: sliderPosition }
              ]} 
            />
            <TouchableOpacity
              style={[
                styles.sliderOption,
                isLogin && styles.activeOption
              ]}
              onPress={() => handleSliderToggle(true)}
            >
              <Text style={[
                styles.sliderOptionText,
                isLogin && styles.activeOptionText
              ]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sliderOption,
                !isLogin && styles.activeOption
              ]}
              onPress={() => handleSliderToggle(false)}
            >
              <Text style={[
                styles.sliderOptionText,
                !isLogin && styles.activeOptionText
              ]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Sign Up Fields */}
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {isLogin ? 'Email / Phone Number' : 'Email'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={isLogin ? "Enter email or phone number" : "Enter your email"}
                placeholderTextColor="#999"
                keyboardType={isLogin ? "default" : "email-address"}
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
                  placeholderTextColor="#999"
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
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      activeGender === 'Male' && styles.activeGenderOption
                    ]}
                    onPress={() => handleGenderSelect('Male')}
                  >
                    <Text style={[
                      styles.genderText,
                      activeGender === 'Male' && styles.activeGenderText
                    ]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      activeGender === 'Female' && styles.activeGenderOption
                    ]}
                    onPress={() => handleGenderSelect('Female')}
                  >
                    <Text style={[
                      styles.genderText,
                      activeGender === 'Female' && styles.activeGenderText
                    ]}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      activeGender === 'Other' && styles.activeGenderOption
                    ]}
                    onPress={() => handleGenderSelect('Other')}
                  >
                    <Text style={[
                      styles.genderText,
                      activeGender === 'Other' && styles.activeGenderText
                    ]}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
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

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alternative Auth Methods */}
          <View style={styles.alternativeAuthContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.googleButton}>
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
    width: '60%',
    height: 50,
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
  },
});

export default AuthScreen;