import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';
import styles from '../styles/TransactionScreenStyles';

const DepositScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample payment methods (for UI purposes - will be replaced with real bank APIs later)
  const paymentMethods = [
    { id: '1', name: 'VISA Debit', number: '••••8912', icon: 'card-outline', color: '#0057b8' },
    { id: '2', name: 'Mastercard Credit', number: '••••3654', icon: 'card-outline', color: '#1a1f71' },
    { id: '3', name: 'Bank Transfer', number: 'TAPYZE Direct', icon: 'business-outline', color: '#333333' },
  ];
  
  // Quick amount options
  const quickAmounts = [500, 1000, 2000, 5000];
  
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

  // Validate deposit amount
  const validateDeposit = () => {
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
      Alert.alert('Error', 'Minimum deposit amount is Rs. 10');
      return false;
    }
    
    if (numericAmount > 100000) {
      Alert.alert('Error', 'Maximum deposit amount is Rs. 100,000');
      return false;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return false;
    }
    
    return true;
  };
  
  // Handle deposit submission
  const handleDeposit = async () => {
    if (!validateDeposit()) return;

    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    
    // Show confirmation dialog
    Alert.alert(
      'Confirm Deposit',
      `Are you sure you want to deposit Rs. ${amount} using ${selectedMethod.name}?`,
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
              // Call wallet API to deposit money
              const result = await walletService.topUpWallet(numericAmount);
              
              if (result.success) {
                // Calculate bonus points (1 point per Rs. 100)
                const bonusPoints = Math.floor(numericAmount / 100);
                
                Alert.alert(
                  'Deposit Successful!',
                  `Rs. ${amount} has been deposited to your wallet successfully!\n\nNew Balance: Rs. ${result.balance.toFixed(2)}\nBonus Points Earned: ${bonusPoints}`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Reset form
                        setAmount('');
                        setSelectedMethod(null);
                        setNote('');
                        
                        // Navigate back to dashboard
                        navigation.navigate('DashboardMain');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Deposit Failed', result.message);
              }
            } catch (error) {
              console.error('Deposit error:', error);
              Alert.alert('Error', 'Failed to process deposit. Please try again.');
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
        <Text style={styles.headerTitle}>Deposit Money</Text>
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

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.depositingToText}>Depositing to</Text>
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
                amount === formatAmount(value.toString()) && styles.selectedQuickAmount
              ]}
              onPress={() => handleQuickAmount(value)}
              disabled={isLoading}
            >
              <Text style={[
                styles.quickAmountText,
                amount === formatAmount(value.toString()) && styles.selectedQuickAmountText
              ]}>
                Rs. {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Deposit Method</Text>
        <Text style={styles.methodSubtitle}>Select your linked payment method</Text>
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
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
          placeholder="What's this deposit for?"
          placeholderTextColor="#999999"
          multiline
          editable={!isLoading}
        />
        
        <View style={styles.bonusContainer}>
          <View style={styles.bonusIconContainer}>
            <Ionicons name="gift-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.bonusTextContainer}>
            <Text style={styles.bonusTitle}>Deposit Bonus Points</Text>
            <Text style={styles.bonusDescription}>
              Earn 1 point for every Rs. 100 deposited today!
              {amount && !isNaN(parseFloat(amount.replace(/,/g, ''))) && (
                <Text style={styles.bonusCalculation}>
                  {'\n'}You'll earn {Math.floor(parseFloat(amount.replace(/,/g, '')) / 100)} bonus points!
                </Text>
              )}
            </Text>
          </View>
        </View>

        {/* Transaction Info */}
        <View style={styles.transactionInfoContainer}>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="time-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>Instant deposit to your wallet</Text>
          </View>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>Secure and encrypted</Text>
          </View>
          <View style={styles.transactionInfoItem}>
            <Ionicons name="cash-outline" size={20} color="#ed7b0e" />
            <Text style={styles.transactionInfoText}>No additional fees</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!amount || !selectedMethod || isLoading) && styles.disabledButton
            ]}
            disabled={!amount || !selectedMethod || isLoading}
            onPress={handleDeposit}
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
                Deposit Rs. {amount || '0.00'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          * Bank integration is simulated for demo purposes. In production, this would connect to actual bank APIs for secure transactions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;