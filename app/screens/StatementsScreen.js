import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Modal, TextInput, ActivityIndicator, Image, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';

import styles from '../styles/StatementsScreenStyles';

const StatementsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // State for transactions and statements
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter and modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)), // Last 3 months
    endDate: new Date() 
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Totals state
  const [periodTotals, setPeriodTotals] = useState({
    income: 0,
    expenses: 0,
    points: 0
  });

  // Load transactions when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadAllTransactions();
    }, [])
  );

  useEffect(() => {
    filterStatementsByDateRange();
  }, [dateRange, allTransactions]);

  useEffect(() => {
    let totalItems = 0;
    filteredStatements.forEach(group => {
      totalItems += group.transactions.length;
    });
    
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [filteredStatements, itemsPerPage]);

  // Calculate totals whenever filtered statements change
  useEffect(() => {
    let income = 0;
    let expenses = 0;
    let points = 0;
    
    filteredStatements.forEach(group => {
      group.transactions.forEach(transaction => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        } else {
          expenses += Math.abs(transaction.amount);
        }
        points += transaction.points;
      });
    });
    
    setPeriodTotals({
      income: income,
      expenses: expenses,
      points: points
    });
  }, [filteredStatements]);

  // Load all transactions from API
  const loadAllTransactions = async () => {
    try {
      setIsLoading(true);
      const result = await walletService.getAllTransactions();
      
      if (result.success) {
        setAllTransactions(result.transactions);
        setStatements(result.groupedTransactions);
        setFilteredStatements(result.groupedTransactions);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllTransactions();
    setRefreshing(false);
  };

  // Filter transactions by date range
  const filterStatementsByDateRange = () => {
    if (allTransactions.length === 0) return;

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    // Filter transactions based on date range
    const filteredTransactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Group filtered transactions by month
    const groupedFiltered = walletService.groupTransactionsByMonth(filteredTransactions);
    setFilteredStatements(groupedFiltered);
  };

  const navigateToProfile = () => {
    navigation.getParent()?.navigate('Settings', { 
      screen: 'SettingsMain' 
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      setDateRange(prev => ({
        ...prev,
        [activeDateInput]: selectedDate
      }));
    }
  };

  const showDatePickerModal = (inputType) => {
    setActiveDateInput(inputType);
    setShowDatePicker(true);
  };

  const applyDateFilter = () => {
    filterStatementsByDateRange();
    setShowFilterModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleExport = () => {
    setIsDownloading(true);
    
    // Simulate download process - in real app, this would call an API
    setTimeout(() => {
      setIsDownloading(false);
      setShowExportModal(false);
      Alert.alert('Success', `Statement exported as ${selectedExportFormat.toUpperCase()} successfully!`);
    }, 2000);
  };

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
          <Text style={styles.transactionCategory}>{item.category} • {formatDate(item.date)}</Text>
          {item.reference && (
            <Text style={styles.transactionReference}>Ref: {item.reference}</Text>
          )}
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

  const renderMonthSection = ({ item }) => {
    return (
      <View style={styles.monthSection}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>{item.month}</Text>
          <Text style={styles.monthCount}>({item.transactions.length} transactions)</Text>
        </View>
        
        {item.transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransaction({item: transaction})}
          </View>
        ))}
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ed7b0e" />
      <Text style={styles.loadingText}>Loading transaction history...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.noTransactionsContainer}>
      <Ionicons name="receipt-outline" size={60} color="#CCCCCC" />
      <Text style={styles.noTransactionsText}>No transactions found for the selected period</Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadAllTransactions}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
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
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          <Ionicons name="person-circle-outline" size={40} color="#ed7b0e" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Statements</Text>
        <Text style={styles.screenSubtitle}>View and manage your account activity</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.filterButtonText}>Filter by Date</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => setShowExportModal(true)}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Statement Summary</Text>
        <Text style={styles.summaryDateRange}>
          {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
        </Text>
        
        <View style={styles.summaryBoxes}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryBoxTitle}>Income</Text>
            <Text style={[styles.summaryBoxValue, styles.incomeValue]}>Rs. {periodTotals.income.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryBox}>
            <Text style={styles.summaryBoxTitle}>Expenses</Text>
            <Text style={[styles.summaryBoxValue, styles.expenseValue]}>Rs. {periodTotals.expenses.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryBox, styles.pointsBox]}>
            <Text style={styles.summaryBoxTitle}>Points Earned</Text>
            <Text style={styles.pointsValue}>{periodTotals.points}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transaction History</Text>

      {isLoading ? (
        renderLoadingState()
      ) : (
        <ScrollView 
          style={styles.statementsContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ed7b0e']}
              tintColor="#ed7b0e"
            />
          }
        >
          {filteredStatements.length > 0 ? (
            filteredStatements.map((monthGroup) => (
              <View key={monthGroup.id}>
                {renderMonthSection({item: monthGroup})}
              </View>
            ))
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      )}

      {filteredStatements.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? "#CCCCCC" : "#333333"} />
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
          
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? "#CCCCCC" : "#333333"} />
          </TouchableOpacity>
        </View>
      )}

      {/* Date Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => showDatePickerModal('startDate')}
              >
                <Text style={styles.dateInputText}>
                  {formatDate(dateRange.startDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => showDatePickerModal('endDate')}
              >
                <Text style={styles.dateInputText}>
                  {formatDate(dateRange.endDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              
              <View style={styles.predefinedFilters}>
                <Text style={styles.inputLabel}>Quick Filters</Text>
                <View style={styles.filterChips}>
                  <TouchableOpacity 
                    style={styles.filterChip}
                    onPress={() => {
                      const today = new Date();
                      const lastThreeMonths = new Date();
                      lastThreeMonths.setMonth(today.getMonth() - 3);
                      setDateRange({startDate: lastThreeMonths, endDate: today});
                    }}
                  >
                    <Text style={styles.filterChipText}>Last 3 Months</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.filterChip}
                    onPress={() => {
                      const today = new Date();
                      const yearStart = new Date(today.getFullYear(), 0, 1);
                      setDateRange({startDate: yearStart, endDate: today});
                    }}
                  >
                    <Text style={styles.filterChipText}>This Year</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={applyDateFilter}
              >
                <Text style={styles.submitButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExportModal}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export Statement</Text>
              <TouchableOpacity onPress={() => setShowExportModal(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Date Range</Text>
              <Text style={styles.exportDateRange}>
                {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
              </Text>
              
              <Text style={styles.inputLabel}>Export Format</Text>
              <View style={styles.formatOptions}>
                <TouchableOpacity 
                  style={[styles.formatOption, selectedExportFormat === 'pdf' && styles.selectedFormat]}
                  onPress={() => setSelectedExportFormat('pdf')}
                >
                  <Ionicons 
                    name="document-text-outline" 
                    size={24} 
                    color={selectedExportFormat === 'pdf' ? "#ed7b0e" : "#777"} 
                  />
                  <Text style={selectedExportFormat === 'pdf' ? styles.selectedFormatText : styles.formatText}>
                    PDF
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.formatOption, selectedExportFormat === 'csv' && styles.selectedFormat]}
                  onPress={() => setSelectedExportFormat('csv')}
                >
                  <Ionicons 
                    name="grid-outline" 
                    size={24} 
                    color={selectedExportFormat === 'csv' ? "#ed7b0e" : "#777"} 
                  />
                  <Text style={selectedExportFormat === 'csv' ? styles.selectedFormatText : styles.formatText}>
                    CSV
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.formatOption, selectedExportFormat === 'xlsx' && styles.selectedFormat]}
                  onPress={() => setSelectedExportFormat('xlsx')}
                >
                  <Ionicons 
                    name="calculator-outline" 
                    size={24} 
                    color={selectedExportFormat === 'xlsx' ? "#ed7b0e" : "#777"} 
                  />
                  <Text style={selectedExportFormat === 'xlsx' ? styles.selectedFormatText : styles.formatText}>
                    Excel
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Email Statement</Text>
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={styles.emailInput}
                  placeholder={user?.email || "Enter your email address"}
                  keyboardType="email-address"
                  defaultValue={user?.email}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleExport}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={[styles.submitButtonText, {marginLeft: 10}]}>Exporting...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    Export Statement
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={activeDateInput === 'startDate' ? dateRange.startDate : dateRange.endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

    </SafeAreaView>
  );
};

export default StatementsScreen;