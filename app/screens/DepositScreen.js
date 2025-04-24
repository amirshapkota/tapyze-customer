import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TransactionScreenStyles';

const DepositScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [note, setNote] = useState('');
  
  // Sample payment methods
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
  
  // Handle deposit submission
  const handleDeposit = () => {
    // Here you would implement the actual deposit functionality
    // For now, just navigate back to dashboard
    navigation.navigate('Dashboard');
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
          />
        </View>
        
        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((value) => (
            <TouchableOpacity 
              key={value} 
              style={styles.quickAmountButton}
              onPress={() => handleQuickAmount(value)}
            >
              <Text style={styles.quickAmountText}>Rs. {value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Deposit Method</Text>
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              style={[
                styles.methodItem,
                selectedMethod?.id === method.id && styles.selectedMethodItem
              ]}
              onPress={() => handleMethodSelect(method)}
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
        />
        
        <View style={styles.bonusContainer}>
          <View style={styles.bonusIconContainer}>
            <Ionicons name="gift-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.bonusTextContainer}>
            <Text style={styles.bonusTitle}>Deposit Bonus Points</Text>
            <Text style={styles.bonusDescription}>
              Earn 1 point for every Rs. 100 deposited today!
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!amount || !selectedMethod) && styles.disabledButton
            ]}
            disabled={!amount || !selectedMethod}
            onPress={handleDeposit}
          >
            <Text style={styles.submitButtonText}>Deposit Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;