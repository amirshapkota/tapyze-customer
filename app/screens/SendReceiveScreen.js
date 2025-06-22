import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';
import styles from '../styles/SendReceiveScreenStyles';

const SendReceiveScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('send');
  const [amount, setAmount] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientUser, setRecipientUser] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [scannerModalVisible, setScannerModalVisible] = useState(false);
  const [sendType, setSendType] = useState('user');
  const [recipientLookupLoading, setRecipientLookupLoading] = useState(false);
  const [phoneValidationError, setPhoneValidationError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState(null);
  
  const quickAmounts = [500, 1000, 2000, 5000];

  useEffect(() => {
    loadUserBalance();
  }, []);

  const loadUserBalance = async () => {
    try {
      setBalanceLoading(true);
      const result = await walletService.getWalletBalance();
      if (result.success) {
        setUserBalance(result.balance);
      } else {
        console.error('Failed to load balance:', result.message);
        Alert.alert('Error', 'Failed to load wallet balance');
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      Alert.alert('Error', 'Failed to load wallet balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  const formatAmount = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const handleAmountChange = (text) => {
    const formattedAmount = formatAmount(text);
    setAmount(formattedAmount);
  };
  
  const handleQuickAmount = (value) => {
    setAmount(formatAmount(value.toString()));
  };

  const handlePhoneChange = (text) => {
    setRecipientPhone(text);
  };

  const lookupRecipient = useCallback(async (phone) => {
    if (!phone || phone.length < 10) {
      setRecipientUser(null);
      setPhoneValidationError('');
      return;
    }

    const cleanPhone = phone.replace(/^\+977-?/, '').replace(/\s+/g, '');
    if (cleanPhone.length < 10 || !cleanPhone.startsWith('9')) {
      setRecipientUser(null);
      setPhoneValidationError('Phone number should start with 9 and be 10 digits');
      return;
    }

    try {
      setRecipientLookupLoading(true);
      setPhoneValidationError('');
      
      const result = await walletService.findUserByPhone(phone);
      
      if (result.success) {
        setRecipientUser(result.user);
        
        if (result.user.type === 'Merchant') {
          setSendType('business');
        } else {
          setSendType('user');
        }
      } else {
        setRecipientUser(null);
        if (cleanPhone.length >= 10) {
          setPhoneValidationError(result.message || 'User not found');
        }
      }
    } catch (error) {
      console.error('Recipient lookup error:', error);
      setRecipientUser(null);
      setPhoneValidationError('Error looking up recipient');
    } finally {
      setRecipientLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (recipientPhone.trim()) {
        lookupRecipient(recipientPhone.trim());
      } else {
        setRecipientUser(null);
        setPhoneValidationError('');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [recipientPhone, lookupRecipient]);

  const validateSendTransaction = () => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    
    if (!amount || isNaN(numericAmount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    
    if (numericAmount <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return false;
    }
    
    if (numericAmount < 10) {
      Alert.alert('Error', 'Minimum transfer amount is Rs. 10');
      return false;
    }
    
    if (numericAmount > userBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return false;
    }

    if (!recipientPhone.trim()) {
      Alert.alert('Error', 'Please enter recipient phone number');
      return false;
    }

    const cleanPhone = recipientPhone.replace(/^\+977-?/, '').replace(/\s+/g, '');
    if (cleanPhone.length < 10 || !cleanPhone.startsWith('9')) {
      Alert.alert('Error', 'Please enter a valid phone number (should start with 9 and be 10 digits)');
      return false;
    }

    if (!recipientUser) {
      Alert.alert('Error', 'Recipient not found. Please check the phone number.');
      return false;
    }
    
    return true;
  };

  const handleSendMoney = async () => {
    if (!validateSendTransaction()) return;

    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const recipientType = recipientUser?.type === 'Merchant' ? 'BUSINESS' : 'USER';
    
    Alert.alert(
      'Confirm Payment',
      `Send Rs. ${amount} to ${recipientUser?.name || recipientPhone}?\n\nRecipient: ${recipientUser?.name}\nPhone: ${walletService.formatPhoneNumber(recipientPhone)}\nType: ${recipientUser?.type === 'Merchant' ? 'Business' : 'Person'}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: async () => {
            setIsLoading(true);
            
            try {
              const result = await walletService.transferFunds(
                recipientPhone,
                recipientType,
                numericAmount,
                note ? `Transfer to ${recipientUser?.name || recipientPhone} (${note})` : `Transfer to ${recipientUser?.name || recipientPhone}`
              );
              
              if (result.success) {
                setTransactionSuccess({
                  amount: amount,
                  recipient: result.recipient || { name: recipientUser?.name, phone: recipientPhone },
                  transaction: result.transaction,
                  newBalance: result.senderBalance,
                  timestamp: new Date()
                });
                
                setAmount('');
                setRecipientPhone('');
                setRecipientUser(null);
                setNote('');
                setPhoneValidationError('');
                loadUserBalance();
              } else {
                Alert.alert('Payment Failed', result.message);
              }
            } catch (error) {
              console.error('Send money error:', error);
              Alert.alert('Error', 'Failed to send payment. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleScanQR = () => {
    setScannerModalVisible(true);
    setTimeout(() => {
      setScannerModalVisible(false);
      Alert.alert('QR Scanned', 'Payment request detected!\nAmount: Rs. 500\nFrom: John Doe');
    }, 2000);
  };

  const generateQRData = () => {
    return JSON.stringify({
      type: 'tapyze_payment',
      userId: user?.id,
      userName: user?.fullName || user?.businessName,
      userPhone: user?.phone,
      userType: user?.type || 'Customer',
      timestamp: Date.now()
    });
  };

  // Transaction Success UI
  if (transactionSuccess) {
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
          <TouchableOpacity onPress={() => {
            setTransactionSuccess(null);
            navigation.goBack();
          }}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color="#28a745" />
            </View>
            
            <Text style={styles.successTitle}>Payment Sent!</Text>
            <Text style={styles.successSubtitle}>Your transaction was completed successfully</Text>
            
            <View style={styles.transactionDetails}>
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Amount Sent</Text>
                <Text style={styles.amountValue}>Rs. {transactionSuccess.amount}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>To</Text>
                <Text style={styles.detailValue}>{transactionSuccess.recipient.name}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{walletService.formatPhoneNumber(transactionSuccess.recipient.phone)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference</Text>
                <Text style={styles.detailValue}>{transactionSuccess.transaction?.reference || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {transactionSuccess.timestamp.toLocaleDateString()} at {transactionSuccess.timestamp.toLocaleTimeString()}
                </Text>
              </View>
              
              <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>New Balance</Text>
                <Text style={styles.balanceValue}>Rs. {transactionSuccess.newBalance.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.successActions}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => {
                  Alert.alert('Share Receipt', 'Receipt sharing functionality will be implemented');
                }}
              >
                <Ionicons name="share-outline" size={20} color="#ed7b0e" />
                <Text style={styles.shareButtonText}>Share Receipt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => {
                  setTransactionSuccess(null);
                  navigation.goBack();
                }}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderSendTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet-outline" size={24} color="#ed7b0e" />
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>
        {balanceLoading ? (
          <ActivityIndicator size="small" color="#ed7b0e" />
        ) : (
          <Text style={styles.balanceAmount}>Rs. {userBalance.toLocaleString()}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send To</Text>
        <View style={styles.sendTypeContainer}>
          <TouchableOpacity 
            style={[styles.sendTypeButton, sendType === 'user' && styles.activeSendType]}
            onPress={() => setSendType('user')}
            disabled={recipientUser?.type === 'Merchant'}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={sendType === 'user' ? '#FFFFFF' : '#666'} 
            />
            <Text style={[styles.sendTypeText, sendType === 'user' && styles.activeSendTypeText]}>
               Person
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendTypeButton, sendType === 'business' && styles.activeSendType]}
            onPress={() => setSendType('business')}
            disabled={recipientUser?.type === 'Customer'}
          >
            <Ionicons 
              name="business" 
              size={20} 
              color={sendType === 'business' ? '#FFFFFF' : '#666'} 
            />
            <Text style={[styles.sendTypeText, sendType === 'business' && styles.activeSendTypeText]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>Rs.</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#CCCCCC"
            editable={!isLoading}
          />
        </View>
        
        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((value) => (
            <TouchableOpacity 
              key={value} 
              style={[
                styles.quickAmountButton,
                amount === formatAmount(value.toString()) && styles.selectedQuickAmount,
                value > userBalance && styles.disabledQuickAmount
              ]}
              onPress={() => handleQuickAmount(value)}
              disabled={isLoading || value > userBalance}
            >
              <Text style={[
                styles.quickAmountText,
                amount === formatAmount(value.toString()) && styles.selectedQuickAmountText,
                value > userBalance && styles.disabledQuickAmountText
              ]}>
                {value >= 1000 ? `${value/1000}K` : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {sendType === 'user' ? 'Send to' : 'Pay to'}
        </Text>
        <View style={styles.recipientInputContainer}>
          <Ionicons 
            name="call" 
            size={20} 
            color="#666" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.recipientInput,
              phoneValidationError && !recipientUser && styles.errorInput
            ]}
            value={recipientPhone}
            onChangeText={handlePhoneChange}
            placeholder="Phone number (9xxxxxxxxx)"
            placeholderTextColor="#CCCCCC"
            keyboardType="phone-pad"
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={handleScanQR}
            style={styles.scanButton}
            disabled={isLoading}
          >
            <Ionicons name="qr-code" size={20} color="#ed7b0e" />
          </TouchableOpacity>
        </View>

        {phoneValidationError && !recipientUser && (
          <View style={styles.errorInfo}>
            <Ionicons name="alert-circle" size={16} color="#dc3545" />
            <Text style={styles.errorText}>{phoneValidationError}</Text>
          </View>
        )}

        {recipientLookupLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ed7b0e" />
            <Text style={styles.loadingText}>Looking up recipient...</Text>
          </View>
        )}

        {recipientUser && !recipientLookupLoading && (
          <View style={styles.recipientInfo}>
            <Ionicons name="checkmark-circle" size={24} color="#28a745" />
            <View style={styles.recipientDetails}>
              <Text style={styles.recipientNameText}>{recipientUser.name}</Text>
              <Text style={styles.recipientTypeText}>
                {recipientUser.type === 'Merchant' ? 'Business Account' : 'Personal Account'}
              </Text>
              <Text style={styles.recipientPhoneText}>
                {walletService.formatPhoneNumber(recipientUser.phone)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder={sendType === 'user' ? "What's this for?" : "Order details"}
          placeholderTextColor="#999999"
          multiline
          editable={!isLoading}
          maxLength={200}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.sendButton,
          (!amount || !recipientPhone || !recipientUser || isLoading || balanceLoading) && styles.disabledButton
        ]}
        disabled={!amount || !recipientPhone || !recipientUser || isLoading || balanceLoading}
        onPress={handleSendMoney}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={[styles.sendButtonText, { marginLeft: 10 }]}>
              Processing...
            </Text>
          </View>
        ) : (
          <>
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>
              Send Rs. {amount || '0'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderReceiveTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Your Payment QR</Text>
        <Text style={styles.qrSubtitle}>
          Show this code to receive instant payments
        </Text>
        
        <View style={styles.qrCodeWrapper}>
          <QRCode
            value={generateQRData()}
            size={180}
            color="#000000"
            backgroundColor="#FFFFFF"
            logo={require('../assets/logo.png')}
            logoSize={36}
            logoBackgroundColor="transparent"
            logoMargin={2}
            logoBorderRadius={8}
            enableLinearGradient={false}
          />
        </View>
        
        <View style={styles.userInfoCard}>
          <Text style={styles.userName}>{user?.fullName || user?.businessName}</Text>
          <Text style={styles.userPhone}>{walletService.formatPhoneNumber(user?.phone)}</Text>
          <View style={styles.userIdContainer}>
            <Ionicons name="at" size={14} color="#ed7b0e" />
            <Text style={styles.userId}>{user?.username || user?.email?.split('@')[0]}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {
            Alert.alert('Share QR', 'QR code sharing functionality will be implemented');
          }}
        >
          <Ionicons name="share" size={18} color="#ed7b0e" />
          <Text style={styles.shareButtonText}>Share QR Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresGrid}>
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="flash" size={20} color="#ed7b0e" />
          </View>
          <Text style={styles.featureTitle}>Instant</Text>
          <Text style={styles.featureDesc}>Real-time transfers</Text>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="shield-checkmark" size={20} color="#ed7b0e" />
          </View>
          <Text style={styles.featureTitle}>Secure</Text>
          <Text style={styles.featureDesc}>Bank-level security</Text>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="wallet" size={20} color="#ed7b0e" />
          </View>
          <Text style={styles.featureTitle}>Free</Text>
          <Text style={styles.featureDesc}>No transaction fees</Text>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="notifications" size={20} color="#ed7b0e" />
          </View>
          <Text style={styles.featureTitle}>Alerts</Text>
          <Text style={styles.featureDesc}>Instant notifications</Text>
        </View>
      </View>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How to Receive</Text>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <Text style={styles.instructionText}>Show your QR code to the sender</Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.instructionText}>They scan it with their TAPYZE app</Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>3</Text>
          </View>
          <Text style={styles.instructionText}>Receive instant payment notification</Text>
        </View>
      </View>
    </View>
  );

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Send or Receive</Text>
        <Text style={styles.screenSubtitle}>Manage your money transfers</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'send' && styles.activeTab]}
          onPress={() => setActiveTab('send')}
        >
          <Ionicons 
            name="arrow-up" 
            size={18} 
            color={activeTab === 'send' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'send' && styles.activeTabText]}>
            Send
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'receive' && styles.activeTab]}
          onPress={() => setActiveTab('receive')}
        >
          <Ionicons 
            name="arrow-down" 
            size={18} 
            color={activeTab === 'receive' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'receive' && styles.activeTabText]}>
            Receive
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'send' ? renderSendTab() : renderReceiveTab()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={scannerModalVisible}
        onRequestClose={() => setScannerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan QR Code</Text>
              <TouchableOpacity 
                onPress={() => setScannerModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.scannerContainer}>
              <View style={styles.scannerPlaceholder}>
                <ActivityIndicator size="large" color="#ed7b0e" />
                <Text style={styles.scannerText}>Scanning QR Code...</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SendReceiveScreen;