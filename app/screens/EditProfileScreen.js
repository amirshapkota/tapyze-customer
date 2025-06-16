import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import styles from '../styles/EditProfileScreenStyles';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser, token } = useAuth();
  
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setGender(user.gender || '');
    }
  }, [user]);

  // Check if there are changes
  useEffect(() => {
    if (user) {
      const changes = (
        fullName !== (user.fullName || '') ||
        phone !== (user.phone || '') ||
        gender !== (user.gender || '')
      );
      setHasChanges(changes);
    }
  }, [fullName, phone, gender, user]);

  // Validate form inputs
  const validateInputs = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name cannot be empty");
      return false;
    }
    
    if (!phone.trim()) {
      Alert.alert("Error", "Phone number cannot be empty");
      return false;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert("Error", "Please enter a valid phone number (10-15 digits)");
      return false;
    }

    if (!gender) {
      Alert.alert("Error", "Please select a gender");
      return false;
    }
    
    return true;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare update data (only editable fields)
      const updateData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender: gender
      };

      const response = await authService.apiCall('/auth/customer/profile', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      if (response.status === 'success') {
        // Update user data in context
        const updatedUser = { ...user, ...updateData };
        await updateUser(updatedUser);
        
        Alert.alert(
          "Success",
          response.message || "Profile updated successfully",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error", 
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle go back
  const handleGoBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Gender selection component
  const GenderSelector = () => {
    const genderOptions = ['Male', 'Female', 'Other'];
    
    return (
      <View style={styles.genderContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderOption,
              gender === option && styles.genderOptionSelected
            ]}
            onPress={() => setGender(option)}
          >
            <Text style={[
              styles.genderOptionText,
              gender === option && styles.genderOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Format member since date
  const formatMemberSince = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return 'Unknown';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>TAPYZE</Text>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="chevron-back" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.screenTitle}>Edit Profile</Text>
            <Text style={styles.screenSubtitle}>Update your personal information</Text>
          </View>

          {/* Profile Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.disabledInputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={styles.disabledText}>{email}</Text>
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender *</Text>
              <GenderSelector />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Member Since</Text>
              <View style={styles.disabledInputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={styles.disabledText}>{formatMemberSince()}</Text>
              </View>
              <Text style={styles.helperText}>This field cannot be changed</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (isLoading || !hasChanges) ? styles.saveButtonDisabled : {}
            ]}
            onPress={handleSaveChanges}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Updating...</Text>
            ) : (
              <Text style={styles.saveButtonText}>
                {hasChanges ? 'Save Changes' : 'No Changes to Save'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Required fields note */}
          <Text style={styles.requiredNote}>* Required fields</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;