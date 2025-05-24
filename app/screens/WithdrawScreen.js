import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';
import styles from '../styles/TransactionScreenStyles';

const WithdrawScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  
  // Sample withdrawal methods (for UI purposes - will be replaced with real bank APIs later)
  const withdrawalMethods = [
    { id: '1', name: 'VISA Debit', number: '••••8912', icon: 'card-outline', color: '#0057b8' },
    { id: '2', name: 'Bank Transfer', number: 'HDFC Bank ••••4521', icon: 'business-outline', color: '#44a1e0' },
    { id: '3', name: 'Cash Pickup', number: 'TAPYZE Agent', icon: 'location-outline', color: '#333333' },
  ];
  
  // Quick amount options (smaller amounts for withdrawal)
  const quickAmounts = [500, 1000, 2000, 5000];

  // Load current wallet balance
  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const result = await walletService.getWalletBalance();
      if (result.success) {
        setCurrentBalance(result.balance);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };
  
  // Format the amount with commas
  const formatAmount = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Handle amount input
  const handleAmountChange = (text) => {
    const formattedAmount = formatAmount(text);
    setAmount(formattedAmount);
  };
  
  // Handle quick amount selection
  const handleQuickAmount = (value) => {
    setAmount(formatAmount(value.toString()));
  };
  
  // Handle method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  // Validate withdrawal amount
  const validateWithdrawal = () => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    
    if (!amount || isNaN(numericAmount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    
    if (numericAmount <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return false;
    }
    
    if (numericAmount < 100) {
      Alert.alert('Error', 'Minimum withdrawal amount is Rs. 100');
      return false;
    }
    
    if (numericAmount > currentBalance) {
      Alert.alert('Insufficient Balance', `You can only withdraw up to Rs. ${currentBalance.toFixed(2)}`);
      return false;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a withdrawal method');
      return false;
    }
    
    return true;
  };
  
  // Handle withdrawal submission (simulated since we don't have actual bank withdrawal API)
  const handleWithdrawal = async () => {
    if (!validateWithdrawal()) return;

    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    
    // Show confirmation dialog
    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw Rs. ${amount} to ${selectedMethod.name}?\n\nNote: This is a demo withdrawal. In production, this would transfer money to your selected bank account.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsLoading(true);
            
            try {
              // For demo purposes, we'll create a debit transaction
              // In production, this would integrate with bank APIs
              
              // Simulate withdrawal processing time
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              Alert.alert(
                'Withdrawal Initiated!',
                `Your withdrawal of Rs. ${amount} has been initiated successfully!\n\nThe money will be transferred to your ${selectedMethod.name} within 1-2 business days.\n\nTransaction ID: WD${Date.now().toString().slice(-6)}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Reset form
                      setAmount('');
                      setSelectedMethod(null);
                      setNote('');
                      
                      // Reload balance
                      loadBalance();
                      
                      // Navigate back to dashboard
                      navigation.navigate('DashboardMain');
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Withdrawal error:', error);
              Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Money</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>TAPYZE</Text>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          {isLoadingBalance ? (
            <ActivityIndicator size="small" color="#ed7b0e" />
          ) : (
            <Text style={styles.balanceAmount}>Rs. {currentBalance.toFixed(2)}</Text>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.depositingToText}>Withdrawing from</Text>
          <Text style={styles.userNameText}>{user?.fullName}</Text>
          <Text style={styles.userEmailText}>{user?.email}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Enter Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>Rs.</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0.00"
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
                value > currentBalance && styles.disabledQuickAmount
              ]}
              onPress={() => handleQuickAmount(value)}
              disabled={isLoading || value > currentBalance}
            >
              <Text style={[
                styles.quickAmountText,
                amount === formatAmount(value.toString()) && styles.selectedQuickAmountText,
                value > currentBalance && styles.disabledQuickAmountText
              ]}>
                Rs. {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Withdrawal Method</Text>
        <Text style={styles.methodSubtitle}>Select where to receive your money</Text>
        <View style={styles.methodsContainer}>
          {withdrawalMethods.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              style={[
                styles.methodItem,
                selectedMethod?.id === method.id && styles.selectedMethodItem
              ]}
              onPress={() => handleMethodSelect(method)}
              disabled={isLoading}
            >
              <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodNumber}>{method.number}</Text>
              </View>
              {selectedMethod?.id === method.id && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#ed7b0e" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="What's this withdrawal for?"
          placeholderTextColor="#999999"
          multiline
          editable={!isLoading}
        />

        {/* Withdrawal Info */}
        <View style={styles.transactionInfoContainer}>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="time-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>Processing time: 1-2 business days</Text>
          </View>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>Secure and encrypted</Text>
          </View>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="cash-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>No withdrawal fees</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              styles.withdrawButton,
              (!amount || !selectedMethod || isLoading) && styles.disabledButton
            ]}
            disabled={!amount || !selectedMethod || isLoading}
            onPress={handleWithdrawal}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                  Processing...
                </Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                Withdraw Rs. {amount || '0.00'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          * Withdrawal feature is simulated for demo purposes. In production, this would integrate with bank APIs for actual money transfers.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawScreen;