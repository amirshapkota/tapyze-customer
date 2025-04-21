import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, Switch, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from '../styles/CardManagementScreenStyles';
import BottomNav from '../components/BottomNav';

const CardManagementScreen = ({ navigation }) => {
  // Card States
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(true);
  const [internationalEnabled, setInternationalEnabled] = useState(false);
  const [atmWithdrawalsEnabled, setAtmWithdrawalsEnabled] = useState(true);
  
  // Recent Transactions
  const recentTransactions = [
    { id: '1', title: 'Netflix Subscription', amount: -12.99, date: '2025-04-18', time: '09:34 AM', location: 'Online' },
    { id: '2', title: 'Grocery Store', amount: -65.43, date: '2025-04-14', time: '02:15 PM', location: 'Local' },
    { id: '3', title: 'Gas Station', amount: -35.50, date: '2025-04-09', time: '11:20 AM', location: 'Local' },
  ];

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  
  // Form States
  const [pin, setPin] = useState('');
  const [dailyLimit, setDailyLimit] = useState('2000');

  // Handle Card Lock/Unlock
  const toggleCardLock = () => {
    if (!isCardLocked) {
      Alert.alert(
        "Lock Card",
        "Are you sure you want to lock your TAPYZE Premium Card? You won't be able to make any transactions while locked.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Lock Card", 
            onPress: () => setIsCardLocked(true),
            style: "destructive"
          }
        ]
      );
    } else {
      setIsCardLocked(false);
    }
  };

  // Reset PIN
  const handleResetPin = () => {
    // Validation would go here
    setShowPinModal(false);
    Alert.alert("Success", "Your PIN has been updated successfully.");
  };


  // Handle Report Lost
  const handleReportLost = () => {
    Alert.alert(
      "Report Lost Card",
      "Are you sure you want to report your card as lost? This will permanently deactivate your card and we'll issue a replacement.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Report Lost", 
          onPress: () => {
            setIsCardLocked(true);
            Alert.alert("Card Reported", "Your card has been deactivated. A replacement will be shipped to your address within 3-5 business days.");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My TAPYZE Card</Text>
          <View style={styles.placeholderView} />
        </View>

        {/* Card Display */}
        <View style={styles.cardContainer}>
          <View style={[styles.card, isCardLocked && styles.lockedCard]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLogo}>
                <Text style={styles.cardLogoText}>TAPYZE</Text>
              </View>
              <Text style={styles.cardType}>RFID ENABLED</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardName}>TAPYZE Premium</Text>
              <Text style={styles.cardNumber}>•••• •••• •••• 4327</Text>
              <View style={styles.rfidTag}>
                <Ionicons name="radio-outline" size={16} color="#FFFFFF" />
                <Text style={styles.rfidText}>Tap to Pay</Text>
              </View>
            </View>
            
            {isCardLocked && (
              <View style={styles.lockedOverlay}>
                <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
                <Text style={styles.lockedText}>CARD LOCKED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Card Status</Text>
            <View style={styles.statusValueContainer}>
              <View style={[styles.statusDot, isCardLocked ? styles.statusInactive : styles.statusActive]} />
              <Text style={[styles.statusValue, isCardLocked ? styles.textInactive : styles.textActive]}>
                {isCardLocked ? 'Locked' : 'Active'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Expiry Date</Text>
            <Text style={styles.statusValue}>04/28</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Daily Limit</Text>
            <Text style={styles.statusValue}>Rs. {parseInt(dailyLimit).toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, isCardLocked && styles.unlockButton]} 
            onPress={toggleCardLock}
          >
            <Ionicons name={isCardLocked ? "lock-open-outline" : "lock-closed-outline"} size={24} color="#FFFFFF" />
            <Text style={styles.quickActionText}>{isCardLocked ? 'Unlock Card' : 'Lock Card'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowPinModal(true)}>
            <Ionicons name="key-outline" size={24} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Reset PIN</Text>
          </TouchableOpacity>
        </View>

        {/* Card Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Card Settings</Text>
        </View>
        
        <View style={styles.settingsContainer}>
          <View style={styles.settingsItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="radio-outline" size={24} color="#ed7b0e" />
              <Text style={styles.settingLabel}>Contactless Payments</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "rgba(237, 123, 14, 0.3)" }}
              thumbColor={contactlessEnabled ? "#ed7b0e" : "#f4f3f4"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setContactlessEnabled}
              value={contactlessEnabled}
              disabled={isCardLocked}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="globe-outline" size={24} color="#ed7b0e" />
              <Text style={styles.settingLabel}>Online Payments</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "rgba(237, 123, 14, 0.3)" }}
              thumbColor={onlinePaymentsEnabled ? "#ed7b0e" : "#f4f3f4"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setOnlinePaymentsEnabled}
              value={onlinePaymentsEnabled}
              disabled={isCardLocked}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cash-outline" size={24} color="#ed7b0e" />
              <Text style={styles.settingLabel}>ATM Withdrawals</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D6", true: "rgba(237, 123, 14, 0.3)" }}
              thumbColor={atmWithdrawalsEnabled ? "#ed7b0e" : "#f4f3f4"}
              ios_backgroundColor="#D1D1D6"
              onValueChange={setAtmWithdrawalsEnabled}
              value={atmWithdrawalsEnabled}
              disabled={isCardLocked}
            />
          </View>
          
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsList}>
          {recentTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDetails}>
                  {transaction.date} • {transaction.time} • {transaction.location}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>{transaction.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Other Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Other Actions</Text>
        </View>
        
        <View style={styles.otherActionsContainer}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="download-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Download Statement</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Add to Digital Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleReportLost}
          >
            <View style={[styles.actionIcon, styles.redIcon]}>
              <Ionicons name="alert-circle-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Report Lost Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* PIN Reset Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPinModal}
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset PIN</Text>
              <TouchableOpacity onPress={() => setShowPinModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Enter your new 4-digit PIN for your TAPYZE Premium Card.
              </Text>
              
              <Text style={styles.inputLabel}>New PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter 4-digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={pin}
                onChangeText={setPin}
              />
              
              <Text style={styles.securityNote}>
                For your security, never share your PIN with anyone, including TAPYZE employees.
              </Text>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleResetPin}
              >
                <Text style={styles.submitButtonText}>Update PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
};

export default CardManagementScreen;