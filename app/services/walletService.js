import authService from './authService';

// Use the same BASE_URL as authService
const BASE_URL = 'http://192.168.1.78:5000/api';

class WalletService {
  constructor() {
    this.token = null;
  }

  // Helper method to make API calls with auth token
  async apiCall(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Get current token
    this.token = await authService.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('Wallet API Call Error:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getWalletBalance() {
    try {
      const response = await this.apiCall('/wallet/balance');
      
      if (response.status === 'success') {
        return {
          success: true,
          balance: response.data.balance,
          currency: response.data.currency
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get wallet balance'
      };
    }
  }

  // Top up wallet
  async topUpWallet(amount) {
    try {
      const response = await this.apiCall('/wallet/topup', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });

      if (response.status === 'success') {
        return {
          success: true,
          balance: response.data.balance,
          transaction: response.data.transaction,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to top up wallet'
      };
    }
  }

  // Transfer funds
  async transferFunds(recipientId, recipientType, amount, description) {
    try {
      const response = await this.apiCall('/wallet/transfer', {
        method: 'POST',
        body: JSON.stringify({
          recipientId,
          recipientType,
          amount,
          description
        }),
      });

      if (response.status === 'success') {
        return {
          success: true,
          senderBalance: response.data.senderBalance,
          transaction: response.data.transaction,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to transfer funds'
      };
    }
  }

  // Get transaction history
  async getTransactionHistory(page = 1, limit = 10) {
    try {
      const response = await this.apiCall(`/wallet/transactions?page=${page}&limit=${limit}`);
      
      if (response.status === 'success') {
        return {
          success: true,
          transactions: response.data.transactions,
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get transaction history'
      };
    }
  }

  // Format transaction for display
  formatTransactionForDisplay(transaction) {
    const isCredit = transaction.type === 'CREDIT';
    const amount = isCredit ? Math.abs(transaction.amount) : -Math.abs(transaction.amount);
    
    // Determine transaction type for UI
    let displayType = 'payment';
    if (transaction.type === 'CREDIT') {
      if (transaction.description.toLowerCase().includes('transfer')) {
        displayType = 'deposit';
      } else if (transaction.description.toLowerCase().includes('top-up')) {
        displayType = 'deposit';
      } else {
        displayType = 'deposit';
      }
    } else if (transaction.type === 'DEBIT') {
      if (transaction.description.toLowerCase().includes('transfer')) {
        displayType = 'payment';
      } else {
        displayType = 'withdraw';
      }
    }

    // Determine category
    let category = 'General';
    if (transaction.description.toLowerCase().includes('transfer')) {
      category = 'Transfer';
    } else if (transaction.description.toLowerCase().includes('top-up')) {
      category = 'Deposit';
    } else if (transaction.description.toLowerCase().includes('withdraw')) {
      category = 'Withdrawal';
    }

    // Calculate points (1 point per Rs. spent, only for debits)
    const points = transaction.type === 'DEBIT' ? Math.floor(Math.abs(transaction.amount)) : 0;

    return {
      id: transaction._id,
      type: displayType,
      title: transaction.description,
      amount: amount,
      date: new Date(transaction.createdAt).toISOString().split('T')[0],
      category: category,
      points: points,
      reference: transaction.reference,
      status: transaction.status,
      metadata: transaction.metadata
    };
  }

  // Group transactions by month for statements
  groupTransactionsByMonth(transactions) {
    const grouped = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          id: monthKey,
          month: monthName,
          transactions: []
        };
      }
      
      grouped[monthKey].transactions.push(this.formatTransactionForDisplay(transaction));
    });
    
    // Convert to array and sort by month (newest first)
    return Object.values(grouped).sort((a, b) => b.id.localeCompare(a.id));
  }

  // Get all transactions (for statements screen)
  async getAllTransactions() {
    try {
      // Get a large number of transactions to show in statements
      const response = await this.apiCall('/wallet/transactions?page=1&limit=100');
      
      if (response.status === 'success') {
        return {
          success: true,
          transactions: response.data.transactions,
          groupedTransactions: this.groupTransactionsByMonth(response.data.transactions),
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get transactions'
      };
    }
  }
}

// Create and export a singleton instance
const walletService = new WalletService();
export default walletService;