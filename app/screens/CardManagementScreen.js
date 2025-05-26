import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, Switch, Modal, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import cardService from '../services/cardService';
import walletService from '../services/walletService';

import styles from '../styles/CardManagementScreenStyles';

const CardManagementScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  // Card States
  const [userCard, setUserCard] = useState(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(true);
  const [internationalEnabled, setInternationalEnabled] = useState(false);
  const [atmWithdrawalsEnabled, setAtmWithdrawalsEnabled] = useState(true);
  
  // Recent Transactions from wallet API
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAssignCardModal, setShowAssignCardModal] = useState(false);
  
  // Form States
  const [pin, setPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [newCardUid, setNewCardUid] = useState('');
  const [newCardPin, setNewCardPin] = useState('');
  const [dailyLimit, setDailyLimit] = useState('2000');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load card data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCardData();
      loadRecentTransactions();
    }, [])
  );

  // Load user's card data from API
  const loadCardData = async () => {
    try {
      setIsLoadingCard(true);
      
      // First test the backend connection
      console.log('Testing backend connection...');
      const connectionTest = await cardService.testConnection();
      
      if (!connectionTest.success) {
        console.error('Backend connection failed:', connectionTest.message);
        Alert.alert(
          'Connection Error', 
          `Cannot connect to backend: ${connectionTest.message}\n\nPlease check:\n1. Backend server is running\n2. Correct BASE_URL in cardService.js\n3. Device/emulator network access`
        );
        setUserCard(null);
        setIsCardLocked(true);
        return;
      }
      
      console.log('Backend connection successful, getting cards...');
      const result = await cardService.getCustomerCards();
      
      if (result.success) {
        if (result.cards.length > 0) {
          // Get the active card or the most recent card
          const activeCard = result.cards.find(card => card.isActive && card.status === 'ACTIVE') || result.cards[0];
          setUserCard(activeCard);
          setIsCardLocked(cardService.isCardLocked(activeCard));
          console.log('Card loaded successfully:', activeCard);
        } else {
          console.log('No cards found for user');
          setUserCard(null);
          setIsCardLocked(true);
        }
      } else {
        console.error('Failed to get cards:', result.message);
        // Check if it's a route error
        if (result.message.includes('endpoint') || result.message.includes('HTML')) {
          Alert.alert(
            'API Error',
            'The card management endpoint is not available. This could mean:\n\n1. Device routes not set up in backend\n2. Wrong API endpoint\n3. Backend server issue\n\nFor now, showing demo card interface.'
          );
        }
        setUserCard(null);
        setIsCardLocked(true);
      }
    } catch (error) {
      console.error('Error loading card data:', error);
      Alert.alert('Error', `Failed to load card data: ${error.message}`);
      setUserCard(null);
      setIsCardLocked(true);
    } finally {
      setIsLoadingCard(false);
    }
  };

  // Load recent transactions from wallet API
  const loadRecentTransactions = async () => {
    try {
      const result = await walletService.getTransactionHistory(1, 3); // Get last 3 transactions
      
      if (result.success) {
        // Format transactions for card display
        const formattedTransactions = result.transactions.map(transaction => ({
          id: transaction._id,
          title: transaction.description || 'Transaction',
          amount: transaction.amount,
          date: new Date(transaction.createdAt).toISOString().split('T')[0],
          time: new Date(transaction.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          location: transaction.type === 'CREDIT' ? 'Deposit' : 'Card Payment'
        }));
        setRecentTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setRecentTransactions([]);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadCardData(), loadRecentTransactions()]);
    setRefreshing(false);
  };

  const navigateToProfile = () => {
    navigation.getParent()?.navigate('Settings', { 
      screen: 'SettingsMain' 
    });
  };

  // Handle Card Lock/Unlock
  const toggleCardLock = async () => {
    if (!userCard) return;

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
            onPress: async () => {
              setIsProcessing(true);
              const result = await cardService.deactivateCard(userCard._id, 'INACTIVE');
              
              if (result.success) {
                setIsCardLocked(true);
                Alert.alert("Success", "Your card has been locked successfully.");
                loadCardData(); // Reload to get updated status
              } else {
                Alert.alert("Error", result.message);
              }
              setIsProcessing(false);
            },
            style: "destructive"
          }
        ]
      );
    } else {
      Alert.alert(
        "Unlock Card", 
        "To unlock your card, please contact our customer support team for security verification.",
        [
          {
            text: "Contact Support",
            onPress: () => {
              Alert.alert(
                "Customer Support", 
                "Please call +977-1-234567 or email support@tapyze.com to unlock your card."
              );
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    }
  };

  // Reset PIN with current and new PIN
  const handleResetPin = async () => {
    // Validate inputs
    const currentPinValidation = cardService.validatePin(currentPin);
    const newPinValidation = cardService.validatePin(newPin);
    
    if (!currentPinValidation.valid) {
      Alert.alert('Error', `Current PIN: ${currentPinValidation.message}`);
      return;
    }
    
    if (!newPinValidation.valid) {
      Alert.alert('Error', `New PIN: ${newPinValidation.message}`);
      return;
    }
    
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New PIN and confirmation do not match');
      return;
    }
    
    if (currentPin === newPin) {
      Alert.alert('Error', 'New PIN must be different from current PIN');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await cardService.changeCardPin(userCard._id, currentPin, newPin);
      
      if (result.success) {
        setShowPinModal(false);
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        Alert.alert("Success", "Your PIN has been updated successfully.");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to change PIN. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Report Lost
  const handleReportLost = async () => {
    if (!userCard) return;

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
          onPress: async () => {
            setIsProcessing(true);
            const result = await cardService.deactivateCard(userCard._id, 'LOST');
            
            if (result.success) {
              setIsCardLocked(true);
              Alert.alert(
                "Card Reported", 
                "Your card has been deactivated. A replacement will be shipped to your address within 3-5 business days."
              );
              loadCardData(); // Reload to get updated status
            } else {
              Alert.alert("Error", result.message);
            }
            setIsProcessing(false);
          },
          style: "destructive"
        }
      ]
    );
  };

  // Handle card assignment with PIN
  const handleAssignCard = async () => {
    if (!newCardUid.trim()) {
      Alert.alert('Error', 'Please enter a valid card UID');
      return;
    }

    const pinValidation = cardService.validatePin(newCardPin);
    if (!pinValidation.valid) {
      Alert.alert('Error', pinValidation.message);
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await cardService.assignCardToCustomer(newCardUid.trim(), newCardPin);
      
      if (result.success) {
        setShowAssignCardModal(false);
        setNewCardUid('');
        setNewCardPin('');
        Alert.alert(
          'Success', 
          'TAPYZE card assigned successfully! Your card is now ready to use.',
          [
            {
              text: 'OK',
              onPress: () => loadCardData()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to assign card. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state
  if (isLoadingCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>TAPYZE</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ed7b0e" />
          <Text style={styles.loadingText}>Loading your card...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show no card state
  if (!userCard) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ed7b0e']}
              tintColor="#ed7b0e"
            />
          }
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>TAPYZE</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={navigateToProfile}
            >
              <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderTitle}>My TAPYZE Card</Text>
            <View style={styles.placeholderView} />
          </View>

          {/* No Card State */}
          <View style={styles.noCardContainer}>
            <View style={styles.noCardIcon}>
              <Ionicons name="card-outline" size={80} color="#cccccc" />
            </View>
            <Text style={styles.noCardTitle}>No TAPYZE Card Found</Text>
            <Text style={styles.noCardDescription}>
              You don't have a TAPYZE card assigned yet. Contact our support team or visit a TAPYZE location to get your card.
            </Text>
            
            <TouchableOpacity 
              style={styles.assignCardButton}
              onPress={() => setShowAssignCardModal(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.assignCardButtonText}>Assign Your Card</Text>
            </TouchableOpacity>

            <View style={styles.cardBenefitsContainer}>
              <Text style={styles.benefitsTitle}>TAPYZE Card Benefits</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="flash-outline" size={20} color="#ed7b0e" />
                <Text style={styles.benefitText}>Instant contactless payments</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#ed7b0e" />
                <Text style={styles.benefitText}>Secure RFID technology</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="star-outline" size={20} color="#ed7b0e" />
                <Text style={styles.benefitText}>Earn points on every purchase</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="wallet-outline" size={20} color="#ed7b0e" />
                <Text style={styles.benefitText}>Direct wallet integration</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Assign Card Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAssignCardModal}
          onRequestClose={() => setShowAssignCardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assign TAPYZE Card</Text>
                <TouchableOpacity onPress={() => setShowAssignCardModal(false)}>
                  <Ionicons name="close-circle" size={28} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  Enter your TAPYZE card UID to assign it to your account. You can find this on your physical card or card packaging.
                </Text>
                
                <Text style={styles.inputLabel}>Card UID</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter card UID (e.g., 04527AB2 or 04:52:7A:B2)"
                  value={newCardUid}
                  onChangeText={setNewCardUid}
                  autoCapitalize="characters"
                />
                
                <Text style={styles.inputLabel}>Set PIN</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 4-6 digit PIN"
                  value={newCardPin}
                  onChangeText={setNewCardPin}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={6}
                />
                
                <Text style={styles.securityNote}>
                  Make sure you have the physical TAPYZE card before assigning it. Choose a secure PIN that you can remember. Once assigned, this card will be linked to your account permanently.
                </Text>
                
                <TouchableOpacity 
                  style={[styles.submitButton, (!newCardUid.trim() || !newCardPin.trim() || isProcessing) && styles.disabledButton]}
                  onPress={handleAssignCard}
                  disabled={!newCardUid.trim() || !newCardPin.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <View style={styles.loadingButtonContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                        Assigning...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Assign Card</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // Show card management screen (your existing design with API data)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ed7b0e']}
            tintColor="#ed7b0e"
          />
        }
      >
        
      <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>TAPYZE</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>My TAPYZE Card</Text>
          <View style={styles.placeholderView} />
        </View>

        {/* Card Display - Using real data */}
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
              <Text style={styles.cardNumber}>
                {cardService.formatCardNumber(userCard.cardUid)}
              </Text>
              <View style={styles.rfidTag}>
                <Ionicons name="radio-outline" size={16} color="#FFFFFF" />
                <Text style={styles.rfidText}>Tap to Pay</Text>
              </View>
            </View>
            
            {isCardLocked && (
              <View style={styles.lockedOverlay}>
                <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
                <Text style={styles.lockedText}>CARD {cardService.getCardStatus(userCard).toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card Status - Using real data */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Card Status</Text>
            <View style={styles.statusValueContainer}>
              <View style={[styles.statusDot, isCardLocked ? styles.statusInactive : styles.statusActive]} />
              <Text style={[styles.statusValue, isCardLocked ? styles.textInactive : styles.textActive]}>
                {cardService.getCardStatus(userCard)}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Expiry Date</Text>
            <Text style={styles.statusValue}>
              {cardService.formatExpiryDate(userCard.expiryDate)}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Daily Limit</Text>
            <Text style={styles.statusValue}>Rs. {parseInt(dailyLimit).toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[
              styles.quickActionButton, 
              isCardLocked && styles.unlockButton,
              isProcessing && styles.disabledActionButton
            ]} 
            onPress={toggleCardLock}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name={isCardLocked ? "lock-open-outline" : "lock-closed-outline"} size={24} color="#FFFFFF" />
            )}
            <Text style={styles.quickActionText}>
              {isCardLocked ? 'Unlock Card' : 'Lock Card'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, isCardLocked && styles.disabledActionButton]} 
            onPress={() => setShowPinModal(true)}
            disabled={isCardLocked}
          >
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
          
        </View>

        {/* Recent Transactions - Real data from wallet API */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Statements', { screen: 'StatementsMain' })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="card-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDetails}>
                    {transaction.date} • {transaction.time} • {transaction.location}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  Rs. {Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Ionicons name="receipt-outline" size={40} color="#cccccc" />
              <Text style={styles.noTransactionsText}>No recent card transactions</Text>
            </View>
          )}
        </View>

        {/* Other Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Other Actions</Text>
        </View>
        
        <View style={styles.otherActionsContainer}>
          <TouchableOpacity 
            style={[styles.actionItem, isProcessing && styles.disabledActionButton]}
            onPress={handleReportLost}
            disabled={isProcessing}
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
                Change your card PIN for enhanced security. You'll need your current PIN to set a new one.
              </Text>
              
              <Text style={styles.inputLabel}>Current PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter current PIN"
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                value={currentPin}
                onChangeText={setCurrentPin}
              />
              
              <Text style={styles.inputLabel}>New PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new 4-6 digit PIN"
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                value={newPin}
                onChangeText={setNewPin}
              />
              
              <Text style={styles.inputLabel}>Confirm New PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm new PIN"
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
              
              <Text style={styles.securityNote}>
                For your security, never share your PIN with anyone, including TAPYZE employees. Choose a PIN that's easy for you to remember but hard for others to guess.
              </Text>
              
              <TouchableOpacity 
                style={[
                  styles.submitButton, 
                  (!currentPin || !newPin || !confirmPin || isProcessing) && styles.disabledButton
                ]}
                onPress={handleResetPin}
                disabled={!currentPin || !newPin || !confirmPin || isProcessing}
              >
                {isProcessing ? (
                  <View style={styles.loadingButtonContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                      Updating...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Update PIN</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default CardManagementScreen;