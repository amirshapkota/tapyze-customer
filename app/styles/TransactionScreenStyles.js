import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholderView: {
    width: 34,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
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
  balanceInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 7,
  },
  availableBalanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  availableBalanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 25,
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 70,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickAmountButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexGrow: 1,
    marginHorizontal: 4,
  },
  quickAmountText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 14,
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedMethodItem: {
    borderColor: '#ed7b0e',
    borderWidth: 2,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  methodNumber: {
    fontSize: 14,
    color: '#666666',
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  bonusContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(237, 123, 14, 0.15)',
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  bonusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ed7b0e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bonusTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ed7b0e',
    marginBottom: 5,
  },
  bonusDescription: {
    fontSize: 14,
    color: '#666666',
  },
  feeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 51, 51, 0.15)',
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  feeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  feeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  feeDescription: {
    fontSize: 14,
    color: '#666666',
  },
  buttonContainer: {
    marginTop: 30,
  },
  submitButton: {
    backgroundColor: '#ed7b0e',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#ed7b0e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 7,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#999999',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  depositingToText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  userEmailText: {
    fontSize: 14,
    color: '#666',
  },

  // Method Selection
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginTop: -10,
  },

  // Quick Amount Selection
  selectedQuickAmount: {
    backgroundColor: '#ed7b0e',
    borderColor: '#ed7b0e',
  },
  selectedQuickAmountText: {
    color: '#FFFFFF',
  },

  // Bonus Points
  bonusCalculation: {
    fontWeight: '600',
    color: '#ed7b0e',
  },

  // Transaction Info
  transactionInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  transactionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },

  // Loading State
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Disclaimer
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  // Disabled Button
  disabledButton: {
    opacity: 0.6,
  },
  balanceContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ed7b0e',
  },

  // Withdraw Button Styling
  withdrawButton: {
    backgroundColor: '#dc3545', // Red color for withdrawal
  },

  // Disabled Quick Amount
  disabledQuickAmount: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  disabledQuickAmountText: {
    color: '#ccc',
  },

  // Error states
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 5,
    textAlign: 'center',
  },

  // Info container for withdrawal specifics
  withdrawalInfoContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  withdrawalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
  },
  withdrawalInfoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default styles;