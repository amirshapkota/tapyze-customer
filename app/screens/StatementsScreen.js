import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';


import styles from '../styles/StatementsScreenStyles';

// Sample data for statements (grouped by month)
const initialStatements = [
  {
    id: 'apr2025',
    month: 'April 2025',
    transactions: [
      { id: 's1', type: 'payment', title: 'Netflix Subscription', amount: -12.99, date: '2025-04-18', category: 'Entertainment', points: 13 },
      { id: 's2', type: 'deposit', title: 'Deposit', amount: 1250.00, date: '2025-04-15', category: 'Income', points: 0 },
      { id: 's3', type: 'payment', title: 'Grocery Store', amount: -65.43, date: '2025-04-14', category: 'Groceries', points: 65 }
    ]
  },
  {
    id: 'mar2025',
    month: 'March 2025',
    transactions: [
      { id: 's4', type: 'withdraw', title: 'Withdrawal', amount: -100.00, date: '2025-03-28', category: 'Cash', points: 0 },
      { id: 's5', type: 'payment', title: 'Gas Station', amount: -35.50, date: '2025-03-22', category: 'Transportation', points: 36 },
      { id: 's6', type: 'payment', title: 'Restaurant Dinner', amount: -78.25, date: '2025-03-15', category: 'Dining', points: 78 },
      { id: 's7', type: 'deposit', title: 'Deposit', amount: 1250.00, date: '2025-03-01', category: 'Income', points: 0 }
    ]
  },
  {
    id: 'feb2025',
    month: 'February 2025',
    transactions: [
      { id: 's8', type: 'payment', title: 'Electric Bill', amount: -85.37, date: '2025-02-25', category: 'Utilities', points: 85 },
      { id: 's9', type: 'payment', title: 'Mobile Phone Bill', amount: -45.00, date: '2025-02-18', category: 'Utilities', points: 45 },
      { id: 's10', type: 'payment', title: 'Online Shopping', amount: -129.50, date: '2025-02-10', category: 'Shopping', points: 130 },
      { id: 's11', type: 'withdraw', title: 'Withdrawal', amount: -60.00, date: '2025-02-05', category: 'Cash', points: 0 },
      { id: 's12', type: 'deposit', title: 'Deposit', amount: 1250.00, date: '2025-02-01', category: 'Income', points: 0 }
    ]
  }
];

const StatementsScreen = () => {
  
  const navigation = useNavigation();
  
  const [statements, setStatements] = useState(initialStatements);
  const [filteredStatements, setFilteredStatements] = useState(initialStatements);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: new Date('2025-02-01'), endDate: new Date() });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(null); // 'start' or 'end'
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigateToProfile = () => {
    navigation.navigate('Settings');
  };
  
  // Calculate totals for the period
  const [periodTotals, setPeriodTotals] = useState({
    income: 0,
    expenses: 0,
    points: 0
  });

  useEffect(() => {
    // Filter statements based on date range
    filterStatementsByDateRange();
  }, [dateRange]);

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

  const filterStatementsByDateRange = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    // Filter transactions based on date range
    const filtered = initialStatements.map(group => {
      const filteredTransactions = group.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      
      return {
        ...group,
        transactions: filteredTransactions
      };
    }).filter(group => group.transactions.length > 0);
    
    setFilteredStatements(filtered);
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
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setShowExportModal(false);
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

  const renderMonthSection = ({ item }) => {
    return (
      <View style={styles.monthSection}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>{item.month}</Text>
        </View>
        
        {item.transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransaction({item: transaction})}
          </View>
        ))}
      </View>
    );
  };

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
            <Text style={styles.summaryBoxValue}>Rs. {periodTotals.income.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryBox}>
            <Text style={styles.summaryBoxTitle}>Expenses</Text>
            <Text style={styles.summaryBoxValue}>Rs. {periodTotals.expenses.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryBox, styles.pointsBox]}>
            <Text style={styles.summaryBoxTitle}>Points Earned</Text>
            <Text style={styles.pointsValue}>{periodTotals.points}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transaction History</Text>

      <ScrollView style={styles.statementsContainer}>
        {filteredStatements.length > 0 ? (
          filteredStatements.map((monthGroup) => (
            <View key={monthGroup.id}>
              {renderMonthSection({item: monthGroup})}
            </View>
          ))
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Ionicons name="receipt-outline" size={60} color="#CCCCCC" />
            <Text style={styles.noTransactionsText}>No transactions found for the selected period</Text>
          </View>
        )}
      </ScrollView>

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
                      const lastMonth = new Date();
                      lastMonth.setMonth(today.getMonth() - 1);
                      setDateRange({startDate: lastMonth, endDate: today});
                    }}
                  >
                    <Text style={styles.filterChipText}>Last 30 Days</Text>
                  </TouchableOpacity>
                  
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
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleExport}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
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