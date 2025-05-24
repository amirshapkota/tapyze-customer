import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, FlatList, Modal, TextInput, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';

import styles from '../styles/DashboardScreenStyles';

// Sample promotional banners
const promotions = [
  {
    id: '1',
    title: 'Earn 2x Points',
    description: 'Double points on all purchases until May 1st',
    backgroundColor: '#ed7b0e',
    icon: 'star'
  },
  {
    id: '2',
    title: 'Refer & Earn',
    description: 'Get Rs.20 for every friend who joins TAPYZE',
    backgroundColor: '#000000',
    icon: 'people'
  },
  {
    id: '3',
    title: 'New Features',
    description: 'Check out our latest app update',
    backgroundColor: '#333333',
    icon: 'sparkles'
  }
];

// Sample data for linked cards
const linkedCards = [
  {
    id: '1',
    name: 'VISA Debit',
    number: '•••• •••• •••• 8912',
    type: 'LINKED CARD',
    color: '#0057b8',
    icon: 'card-outline'
  },
  {
    id: '2',
    name: 'Mastercard Credit',
    number: '•••• •••• •••• 3654',
    type: 'LINKED CARD',
    color: '#1a1f71',
    icon: 'card-outline'
  },
  {
    id: '3',
    name: 'American Express',
    number: '•••• •••• •••• 7612',
    type: 'LINKED CARD',
    color: '#006fcf',
    icon: 'card-outline'
  }
];

// Sample data for linked bank accounts
const linkedBankAccounts = [
  {
    id: '1',
    name: 'Primary Checking',
    number: '•••• 4521',
    type: 'SAVINGS',
    bankName: 'HDFC Bank',
    color: '#44a1e0',
    icon: 'wallet-outline'
  },
  {
    id: '2',
    name: 'Business Account',
    number: '•••• 9872',
    type: 'CURRENT',
    bankName: 'ICICI Bank',
    color: '#6c3dd5',
    icon: 'wallet-outline'
  }
];

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  
  // Wallet and transaction state
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('NPR');
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI state
  const [selectedTab, setSelectedTab] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  
  // Modal states
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  
  // Form states
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('VISA');
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('SAVINGS');

  // Load wallet data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadWalletData();
      loadRecentTransactions();
    }, [])
  );

  // Load wallet balance
  const loadWalletData = async () => {
    try {
      setIsLoadingWallet(true);
      const result = await walletService.getWalletBalance();
      
      if (result.success) {
        setBalance(result.balance);
        setCurrency(result.currency);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // Load recent transactions
  const loadRecentTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const result = await walletService.getTransactionHistory(1, 5); // Get last 5 transactions
      
      if (result.success) {
        const formattedTransactions = result.transactions.map(transaction => 
          walletService.formatTransactionForDisplay(transaction)
        );
        setTransactions(formattedTransactions);
        
        // Calculate total points from recent transactions
        const points = formattedTransactions.reduce((total, transaction) => {
          return total + (transaction.points || 0);
        }, 0);
        setTotalPoints(points);
      } else {
        console.error('Failed to load transactions:', result.message);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadWalletData(),
      loadRecentTransactions()
    ]);
    setRefreshing(false);
  };

  // Format card number input with spaces
  const formatCardNumber = (text) => {
    const digitsOnly = text.replace(/\D/g, '');
    const formatted = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  // Format expiry date input (MM/YY)
  const formatExpiryDate = (text) => {
    const digitsOnly = text.replace(/\D/g, '');
    
    if (digitsOnly.length > 2) {
      return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
    }
    return digitsOnly;
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Navigation functions
  const navigateToProfile = () => {
    navigation.getParent()?.navigate('Settings', { 
      screen: 'SettingsMain' 
    });
  };

  const navigateToCardManagement = () => {
    navigation.getParent()?.navigate('Card', { 
      screen: 'CardMain' 
    });
  };

  const navigateToDeposit = () => {
    navigation.navigate('Deposit');
  };

  const navigateToWithdraw = () => {
    navigation.navigate('Withdraw');
  };

  const navigateToAllTransactions = () => {
    navigation.getParent()?.navigate('Statements', { 
      screen: 'StatementsMain' 
    });
  };

  // Card and bank account handlers
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setShowCardDetailsModal(true);
  };

  const handleAddCard = () => {
    setNewCardName('');
    setNewCardNumber('');
    setExpiryDate('');
    setCvv('');
    setShowAddCardModal(true);
  };

  const handleSubmitNewCard = () => {
    setShowAddCardModal(false);
    Alert.alert('Success', 'Card added successfully!');
  };

  const handleRemoveCard = () => {
    setShowCardDetailsModal(false);
    Alert.alert('Success', 'Card removed successfully!');
  };

  const handleBankSelect = (account) => {
    setSelectedBankAccount(account);
    setShowBankDetailsModal(true);
  };

  const handleAddBankAccount = () => {
    setNewBankName('');
    setNewAccountNumber('');
    setIfscCode('');
    setSelectedAccountType('SAVINGS');
    setShowAddBankModal(true);
  };

  const handleSubmitNewBank = () => {
    setShowAddBankModal(false);
    Alert.alert('Success', 'Bank account linked successfully!');
  };

  // Filter transactions based on selected tab
  const filteredTransactions = selectedTab === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === selectedTab);

  const renderPromotion = ({ item }) => (
    <TouchableOpacity style={[styles.promotionBanner, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.promotionContent}>
        <Ionicons name={item.icon} size={28} color="#FFFFFF" style={styles.promotionIcon} />
        <View>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionDescription}>{item.description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  const renderLinkedCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.linkedCardItem}
      onPress={() => handleCardSelect(item)}
    >
      <View style={[styles.linkedCardIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.linkedCardInfo}>
        <Text style={styles.linkedCardName}>{item.name}</Text>
        <Text style={styles.linkedCardNumber}>{item.number}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
    </TouchableOpacity>
  );

  const renderLinkedBankAccount = ({ item }) => (
    <TouchableOpacity 
      style={styles.linkedCardItem}
      onPress={() => handleBankSelect(item)}
    >
      <View style={[styles.linkedCardIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.linkedCardInfo}>
        <Text style={styles.linkedCardName}>{item.name}</Text>
        <Text style={styles.linkedCardNumber}>{item.bankName} • {item.number}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }) => {
    const isPositive = item.amount > 0;
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIcon, 
          item.type === 'payment' ? styles.paymentIcon : 
          item.type === 'deposit' ? styles.depositIcon : styles.withdrawIcon]}>
          {item.type === 'payment' && <Ionicons name="cart-outline" size={24} color="#FFFFFF" />}
          {item.type === 'deposit' && <Ionicons name="arrow-down-outline" size={24} color="#FFFFFF" />}
          {item.type === 'withdraw' && <Ionicons name="arrow-up-outline" size={24} color="#FFFFFF" />}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category} • {item.date}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={[styles.transactionAmount, isPositive ? styles.positiveAmount : styles.negativeAmount]}>
            {isPositive ? '+' : ''}{Math.abs(item.amount).toFixed(2)}
          </Text>
          {item.points > 0 && (
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>+{item.points} pts</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

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
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, {user?.fullName || 'User'}</Text>
          <Text style={styles.greetingSubtext}>Welcome back to your wallet</Text>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.balanceRow}>
                {isLoadingWallet ? (
                  <ActivityIndicator size="small" color="#ed7b0e" />
                ) : (
                  <>
                    <Text style={styles.balanceAmount}>
                      {showBalance ? `${balance.toFixed(2)}` : '••••••'}
                    </Text>
                    <Text style={styles.statsCurrency}>{currency}.</Text>
                  </>
                )}
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowBalance(!showBalance)}
                >
                  <Ionicons 
                    name={showBalance ? "eye-outline" : "eye-off-outline"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.pointsBox}>
              <Text style={styles.pointsValue}>{totalPoints}</Text>
              <Text style={styles.pointsLabel}>POINTS</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.depositButton]}
              onPress={navigateToDeposit}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={navigateToWithdraw}
            >
              <Ionicons name="remove-circle-outline" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAPYZE Card Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My TAPYZE Card</Text>
          <TouchableOpacity onPress={navigateToCardManagement}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={navigateToCardManagement}>
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
          </TouchableOpacity>
        </View>

        {/* Linked Cards Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Cards</Text>
        </View>

        <View style={styles.linkedCardsContainer}>
          <FlatList
            horizontal
            data={linkedCards}
            renderItem={renderLinkedCard}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.linkedCardsList}
          />
          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={handleAddCard}
          >
            <Ionicons name="add-circle" size={24} color="#ed7b0e" />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Linked Bank Accounts Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Bank Accounts</Text>
        </View>

        <View style={styles.linkedCardsContainer}>
          <FlatList
            horizontal
            data={linkedBankAccounts}
            renderItem={renderLinkedBankAccount}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.linkedCardsList}
          />
          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={handleAddBankAccount}
          >
            <Ionicons name="add-circle" size={24} color="#ed7b0e" />
            <Text style={styles.addCardText}>Add Bank Account</Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Banners */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={promotions}
          renderItem={renderPromotion}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promotionsList}
        />
        
        {/* Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={navigateToAllTransactions}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Filter Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={selectedTab === 'all' ? styles.activeTabText : styles.tabText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'payment' && styles.activeTab]}
            onPress={() => setSelectedTab('payment')}
          >
            <Text style={selectedTab === 'payment' ? styles.activeTabText : styles.tabText}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'deposit' && styles.activeTab]}
            onPress={() => setSelectedTab('deposit')}
          >
            <Text style={selectedTab === 'deposit' ? styles.activeTabText : styles.tabText}>Deposits</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'withdraw' && styles.activeTab]}
            onPress={() => setSelectedTab('withdraw')}
          >
            <Text style={selectedTab === 'withdraw' ? styles.activeTabText : styles.tabText}>Withdrawals</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {isLoadingTransactions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ed7b0e" />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <View key={transaction.id}>
                {renderTransaction({item: transaction})}
              </View>
            ))
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Ionicons name="receipt-outline" size={60} color="#CCCCCC" />
              <Text style={styles.noTransactionsText}>No transactions yet</Text>
            </View>
          )}
        </View>
        
      </ScrollView>

      {/* All Modal Components - keeping them the same */}
      {/* Add New Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCardModal}
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setShowAddCardModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Card Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Work Credit Card"
                value={newCardName}
                onChangeText={setNewCardName}
              />
              
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric"
                maxLength={19}
                value={newCardNumber}
                onChangeText={(text) => setNewCardNumber(formatCardNumber(text))}
              />
              
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  />
                </View>
                
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="XXX"
                    keyboardType="numeric"
                    maxLength={3}
                    value={cvv}
                    onChangeText={setCvv}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              
              <View style={styles.cardTypeSelector}>
                <Text style={styles.inputLabel}>Card Type</Text>
                <View style={styles.cardTypeOptions}>
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedCardType === 'VISA' && styles.selectedCardType]}
                    onPress={() => setSelectedCardType('VISA')}
                  >
                    <Ionicons name="card-outline" size={24} color={selectedCardType === 'VISA' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedCardType === 'VISA' ? styles.selectedCardTypeText : styles.cardTypeText}>VISA</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedCardType === 'MasterCard' && styles.selectedCardType]}
                    onPress={() => setSelectedCardType('MasterCard')}
                  >
                    <Ionicons name="card-outline" size={24} color={selectedCardType === 'MasterCard' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedCardType === 'MasterCard' ? styles.selectedCardTypeText : styles.cardTypeText}>MasterCard</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedCardType === 'Amex' && styles.selectedCardType]}
                    onPress={() => setSelectedCardType('Amex')}
                  >
                    <Ionicons name="card-outline" size={24} color={selectedCardType === 'Amex' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedCardType === 'Amex' ? styles.selectedCardTypeText : styles.cardTypeText}>Amex</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitNewCard}
              >
                <Text style={styles.submitButtonText}>Add Card</Text>
              </TouchableOpacity>
              
              <Text style={styles.securityNote}>
                Your card details are securely encrypted. We never store your full card number.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Card Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCardDetailsModal}
        onRequestClose={() => setShowCardDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Card Details</Text>
              <TouchableOpacity onPress={() => setShowCardDetailsModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedCard && (
              <View style={styles.modalContent}>
                <View style={[styles.cardDetailIcon, { backgroundColor: selectedCard.color }]}>
                  <Ionicons name={selectedCard.icon} size={36} color="#FFFFFF" />
                </View>
                
                <Text style={styles.cardDetailTitle}>{selectedCard.name}</Text>
                <Text style={styles.cardDetailNumber}>{selectedCard.number}</Text>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Type</Text>
                  <Text style={styles.cardDetailValue}>{selectedCard.type}</Text>
                </View>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Status</Text>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Last Used</Text>
                  <Text style={styles.cardDetailValue}>Today, 9:45 AM</Text>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.cardActionButton}>
                    <Ionicons name="refresh-outline" size={20} color="#ed7b0e" />
                    <Text style={styles.cardActionText}>Update</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cardActionButton}>
                    <Ionicons name="lock-closed-outline" size={20} color="#ed7b0e" />
                    <Text style={styles.cardActionText}>Lock</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardActionButton, styles.removeButton]}
                    onPress={handleRemoveCard}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Add New Bank Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddBankModal}
        onRequestClose={() => setShowAddBankModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bank Account</Text>
              <TouchableOpacity onPress={() => setShowAddBankModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Account Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Primary Savings"
                value={newBankName}
                onChangeText={setNewBankName}
              />
              
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Account Number"
                keyboardType="numeric"
                value={newAccountNumber}
                onChangeText={setNewAccountNumber}
              />
              
              <View style={styles.accountTypeSelector}>
                <Text style={styles.inputLabel}>Account Type</Text>
                <View style={styles.cardTypeOptions}>
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedAccountType === 'SAVINGS' && styles.selectedCardType]}
                    onPress={() => setSelectedAccountType('SAVINGS')}
                  >
                    <Ionicons name="wallet-outline" size={24} color={selectedAccountType === 'SAVINGS' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedAccountType === 'SAVINGS' ? styles.selectedCardTypeText : styles.cardTypeText}>Savings</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedAccountType === 'CURRENT' && styles.selectedCardType]}
                    onPress={() => setSelectedAccountType('CURRENT')}
                  >
                    <Ionicons name="briefcase-outline" size={24} color={selectedAccountType === 'CURRENT' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedAccountType === 'CURRENT' ? styles.selectedCardTypeText : styles.cardTypeText}>Current</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardTypeOption, selectedAccountType === 'FIXED' && styles.selectedCardType]}
                    onPress={() => setSelectedAccountType('FIXED')}
                  >
                    <Ionicons name="lock-closed-outline" size={24} color={selectedAccountType === 'FIXED' ? "#ed7b0e" : "#777"} />
                    <Text style={selectedAccountType === 'FIXED' ? styles.selectedCardTypeText : styles.cardTypeText}>Fixed</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitNewBank}
              >
                <Text style={styles.submitButtonText}>Link Account</Text>
              </TouchableOpacity>
              
              <Text style={styles.securityNote}>
                Your bank account information is end-to-end encrypted and securely stored. We never share your information with third parties.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bank Account Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBankDetailsModal}
        onRequestClose={() => setShowBankDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bank Account Details</Text>
              <TouchableOpacity onPress={() => setShowBankDetailsModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedBankAccount && (
              <View style={styles.modalContent}>
                <View style={[styles.cardDetailIcon, { backgroundColor: selectedBankAccount.color }]}>
                  <Ionicons name={selectedBankAccount.icon} size={36} color="#FFFFFF" />
                </View>
                
                <Text style={styles.cardDetailTitle}>{selectedBankAccount.name}</Text>
                <Text style={styles.cardDetailNumber}>{selectedBankAccount.bankName} • {selectedBankAccount.number}</Text>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Account Type</Text>
                  <Text style={styles.cardDetailValue}>{selectedBankAccount.type}</Text>
                </View>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Status</Text>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                
                <View style={styles.cardDetailItem}>
                  <Text style={styles.cardDetailLabel}>Last Transaction</Text>
                  <Text style={styles.cardDetailValue}>Today, 11:23 AM</Text>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.cardActionButton}>
                    <Ionicons name="sync-outline" size={20} color="#ed7b0e" />
                    <Text style={styles.cardActionText}>Refresh</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cardActionButton}>
                    <Ionicons name="card-outline" size={20} color="#ed7b0e" />
                    <Text style={styles.cardActionText}>Transfer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.cardActionButton, styles.removeButton]}
                    onPress={() => setShowBankDetailsModal(false)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DashboardScreen;