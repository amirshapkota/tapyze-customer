import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/DashboardScreenStyles';

// Sample data for transactions
const initialTransactions = [
  { id: '1', type: 'payment', title: 'Netflix Subscription', amount: -12.99, date: '2025-04-18', category: 'Entertainment', points: 13 },
  { id: '2', type: 'deposit', title: 'Paycheck Deposit', amount: 1250.00, date: '2025-04-15', category: 'Income', points: 0 },
  { id: '3', type: 'payment', title: 'Grocery Store', amount: -65.43, date: '2025-04-14', category: 'Groceries', points: 65 },
  { id: '4', type: 'withdraw', title: 'ATM Withdrawal', amount: -100.00, date: '2025-04-10', category: 'Cash', points: 0 },
  { id: '5', type: 'payment', title: 'Gas Station', amount: -35.50, date: '2025-04-09', category: 'Transportation', points: 36 },
];

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

const DashboardScreen = () => {
  // Get the navigation object
  const navigation = useNavigation();
  
  const [balance, setBalance] = useState(2580.75);
  const [totalPoints, setTotalPoints] = useState(1842);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  
  // Add state for modals
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // New card form state
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('VISA');

  // Format card number input with spaces
  const formatCardNumber = (text) => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limit to 16 digits plus spaces
  };

  // Format expiry date input (MM/YY)
  const formatExpiryDate = (text) => {
    const digitsOnly = text.replace(/\D/g, '');
    
    if (digitsOnly.length > 2) {
      return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
    }
    return digitsOnly;
  };

  // Handle card selection for details popup
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setShowCardDetailsModal(true);
  };

  // Handle adding a new card
  const handleAddCard = () => {
    // Reset form fields and show modal
    setNewCardName('');
    setNewCardNumber('');
    setExpiryDate('');
    setCvv('');
    setShowAddCardModal(true);
  };

  // Handle submitting the new card form
  const handleSubmitNewCard = () => {
    // validate and save the new card
    setShowAddCardModal(false);
    
    // add the card to your linked cards array and update state/database
  };

  // Handle removing a card
  const handleRemoveCard = () => {
    // remove the card from your data
    setShowCardDetailsModal(false);
  };

  // Filter transactions based on selected tab
  const filteredTransactions = selectedTab === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === selectedTab);

  // Navigate to profile/settings screen
  const navigateToProfile = () => {
    navigation.navigate('Settings');
  };

  // Navigate to card management screen
  const navigateToCardManagement = () => {
    navigation.navigate('Card');
  };

  // Navigate to deposit screen
  const navigateToDeposit = () => {
    navigation.navigate('Deposit');
  };

  // Navigate to withdraw screen
  const navigateToWithdraw = () => {
    navigation.navigate('Withdraw');
  };

  // Navigate to see all transactions
  const navigateToAllTransactions = () => {
    navigation.navigate('Statements');
  };

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
            {isPositive ? '+' : ''}{item.amount.toFixed(2)}
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
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={navigateToProfile}
          >
            <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, John</Text>
          <Text style={styles.greetingSubtext}>Welcome back to your wallet</Text>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {showBalance ? `Rs. ${balance.toFixed(2)}` : '••••••'}
                </Text>
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
          <TouchableOpacity onPress={handleAddCard}>
            <Text style={styles.seeAllText}>Link New</Text>
          </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Transactions</Text>
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
          {filteredTransactions.map(transaction => (
            <View key={transaction.id}>
              {renderTransaction({item: transaction})}
            </View>
          ))}
        </View>
        
      </ScrollView>

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
    </SafeAreaView>
  );
};

export default DashboardScreen;