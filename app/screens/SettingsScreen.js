import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/SettingsScreenStyles';

const SettingsScreen = () => {
  // Get user data and logout function from AuthContext
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  
  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Use real user data from backend, with fallbacks
  const userProfile = {
    name: user?.fullName || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+977 98765 43210',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : 'March 2024',
    accountType: 'Premium'
  };

  // Handle logout with AuthContext
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
            // Navigation will be handled automatically by AuthContext
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            Alert.alert("Verification Required", "For security reasons, we need to verify your identity. A verification code has been sent to your registered email address.");
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>Settings</Text>
          <Text style={styles.screenSubtitle}>Manage your account preferences</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarContainer}>
              <Ionicons name="person" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileType}>{userProfile.accountType} Member</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('EditProfile', { userProfile })}
            >
              <Ionicons name="pencil" size={20} color="#ed7b0e" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileDetails}>
            <View style={styles.profileDetailItem}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.profileDetailText}>{userProfile.email}</Text>
            </View>
            <View style={styles.profileDetailItem}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.profileDetailText}>{userProfile.phone}</Text>
            </View>
            <View style={styles.profileDetailItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.profileDetailText}>Member since {userProfile.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#d1d1d6", true: "#FFCAA3" }}
              thumbColor={notificationsEnabled ? "#ed7b0e" : "#f4f3f4"}
              onValueChange={() => setNotificationsEnabled(prev => !prev)}
              value={notificationsEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cash-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Currency</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>NPR (Rs.)</Text>
              <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Two-Factor Authentication</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color="#333" />
              <Text style={styles.settingText}>About TAPYZE</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.versionText}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout and Delete Account */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;