import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    description: 'Get $20 for every friend who joins TAPYZE',
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
          <TouchableOpacity style={styles.profileButton}>
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
                  {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
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
            <TouchableOpacity style={[styles.actionButton, styles.depositButton]}>
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
              <Ionicons name="remove-circle-outline" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAPYZE Card Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My TAPYZE Card</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
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
          </View>
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
          <TouchableOpacity>
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
        
        {/* Bottom Navigation Spacer */}
        <View style={styles.bottomNavSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#ed7b0e" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="card-outline" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text-outline" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>Statements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

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
                
                <View style={styles.transactionSummary}>
                  <Text style={styles.transactionSummaryTitle}>Recent Transactions</Text>
                  <View style={styles.transactionSummaryItem}>
                    <Text style={styles.transactionSummaryText}>Grocery Store</Text>
                    <Text style={styles.transactionSummaryAmount}>-$65.43</Text>
                  </View>
                  <View style={styles.transactionSummaryItem}>
                    <Text style={styles.transactionSummaryText}>Gas Station</Text>
                    <Text style={styles.transactionSummaryAmount}>-$35.50</Text>
                  </View>
                  <TouchableOpacity style={styles.viewAllTransactions}>
                    <Text style={styles.viewAllText}>View All Card Transactions</Text>
                    <Ionicons name="chevron-forward" size={16} color="#ed7b0e" />
                  </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    height: 45,
    width: 45,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  profileButton: {
    padding: 5,
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 7,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  eyeButton: {
    marginLeft: 10,
    padding: 5,
  },
  pointsBox: {
    backgroundColor: '#ed7b0e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 90,
  },
  pointsValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  pointsLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  depositButton: {
    backgroundColor: '#ed7b0e',
  },
  withdrawButton: {
    backgroundColor: '#000000',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#ed7b0e',
    fontWeight: '500',
  },
  cardContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  card: {
    height: 180,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLogo: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ed7b0e',
    borderRadius: 6,
  },
  cardLogoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardNumber: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  cardType: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '500',
  },
  rfidTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(237, 123, 14, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rfidText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  linkedCardsContainer: {
    marginBottom: 10,
  },
  linkedCardsList: {
    paddingHorizontal: 15,
  },
  linkedCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  linkedCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0057b8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  linkedCardInfo: {
    flex: 1,
  },
  linkedCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  linkedCardNumber: {
    fontSize: 14,
    color: '#666666',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ed7b0e',
    marginLeft: 10,
  },
  promotionsList: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  promotionBanner: {
    width: 280,
    borderRadius: 14,
    padding: 16,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  promotionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promotionIcon: {
    marginRight: 12,
  },
  promotionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  promotionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    width: 170,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#ed7b0e',
  },
  tabText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  transactionsList: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentIcon: {
    backgroundColor: '#000000',
  },
  depositIcon: {
    backgroundColor: '#ed7b0e',
  },
  withdrawIcon: {
    backgroundColor: '#555555',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#666',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  positiveAmount: {
    color: '#ed7b0e',
  },
  negativeAmount: {
    color: '#000000',
  },
  pointsContainer: {
    backgroundColor: 'rgba(237, 123, 14, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  pointsText: {
    color: '#ed7b0e',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomNavSpacer: {
    height: 80, // This creates space at the bottom so content isn't hidden behind nav
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#ed7b0e',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalContent: {
    paddingBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  halfInput: {
    width: '48%',
  },
  cardTypeSelector: {
    marginTop: 16,
  },
  cardTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardTypeOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '30%',
  },
  selectedCardType: {
    borderColor: '#ed7b0e',
    backgroundColor: 'rgba(237, 123, 14, 0.05)',
  },
  cardTypeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
  selectedCardTypeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ed7b0e',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ed7b0e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  securityNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  cardDetailIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardDetailTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  cardDetailNumber: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  cardDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardDetailLabel: {
    fontSize: 16,
    color: '#666',
  },
  cardDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    marginRight: 8,
  },
  statusText: {
    color: '#4CD964',
    fontWeight: '600',
  },
  transactionSummary: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  transactionSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transactionSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  transactionSummaryText: {
    fontSize: 14,
    color: '#666',
  },
  transactionSummaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F7F8FA',
    flex: 1,
    marginHorizontal: 4,
  },
  cardActionText: {
    color: '#ed7b0e',
    fontWeight: '600',
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  removeButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DashboardScreen;