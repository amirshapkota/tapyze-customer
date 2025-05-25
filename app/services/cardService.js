// app/services/cardService.js
import authService from './authService';

// Use the same BASE_URL as authService
const BASE_URL = 'http://192.168.1.78:5000/api'; // Update this to match your authService BASE_URL

class CardService {
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
      console.error('Card API Call Error:', error);
      throw error;
    }
  }

  // Get customer's cards
  async getCustomerCards() {
    try {
      const response = await this.apiCall('/device/cards');
      
      if (response.status === 'success') {
        return {
          success: true,
          cards: response.data.cards
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get cards'
      };
    }
  }

  // Assign card to customer
  async assignCardToCustomer(cardUid) {
    try {
      const response = await this.apiCall('/device/cards/assign', {
        method: 'POST',
        body: JSON.stringify({ cardUid }),
      });

      if (response.status === 'success') {
        return {
          success: true,
          card: response.data.card,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to assign card'
      };
    }
  }

  // Deactivate card
  async deactivateCard(cardId, reason = 'INACTIVE') {
    try {
      const response = await this.apiCall(`/device/cards/${cardId}/deactivate`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });

      if (response.status === 'success') {
        return {
          success: true,
          card: response.data.card,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to deactivate card'
      };
    }
  }

  // Format card number for display
  formatCardNumber(cardUid) {
    if (!cardUid) return '•••• •••• •••• ••••';
    
    // For RFID cards, we'll format the UID differently
    // If UID is long, show last 4 digits
    if (cardUid.length > 4) {
      return `•••• •••• •••• ${cardUid.slice(-4)}`;
    }
    return `•••• •••• •••• ${cardUid}`;
  }

  // Format expiry date
  formatExpiryDate(expiryDate) {
    if (!expiryDate) return '••/••';
    
    const date = new Date(expiryDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  }

  // Get card status info
  getCardStatusInfo(card) {
    if (!card) {
      return {
        status: 'No Card',
        color: '#999',
        isActive: false
      };
    }

    const now = new Date();
    const expiry = new Date(card.expiryDate);
    
    if (expiry < now) {
      return {
        status: 'Expired',
        color: '#dc3545',
        isActive: false
      };
    }

    switch (card.status) {
      case 'ACTIVE':
        return {
          status: card.isActive ? 'Active' : 'Inactive',
          color: card.isActive ? '#28a745' : '#6c757d',
          isActive: card.isActive
        };
      case 'LOST':
        return {
          status: 'Lost',
          color: '#dc3545',
          isActive: false
        };
      case 'PENDING_ACTIVATION':
        return {
          status: 'Pending Activation',
          color: '#ffc107',
          isActive: false
        };
      default:
        return {
          status: 'Inactive',
          color: '#6c757d',
          isActive: false
        };
    }
  }

  // Check if card is locked (inactive or lost)
  isCardLocked(card) {
    if (!card) return true;
    
    const statusInfo = this.getCardStatusInfo(card);
    return !statusInfo.isActive;
  }

  // Generate mock recent transactions for the card
  generateRecentTransactions(card) {
    if (!card || !card.isActive) {
      return [];
    }

    // Mock transactions - in real app, these would come from transaction API
    return [
      { 
        id: '1', 
        title: 'Coffee Shop', 
        amount: -4.50, 
        date: new Date().toISOString().split('T')[0], 
        time: '09:34 AM', 
        location: 'Local',
        cardUid: card.cardUid
      },
      { 
        id: '2', 
        title: 'Grocery Store', 
        amount: -65.43, 
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
        time: '02:15 PM', 
        location: 'Local',
        cardUid: card.cardUid
      },
      { 
        id: '3', 
        title: 'Gas Station', 
        amount: -35.50, 
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], 
        time: '11:20 AM', 
        location: 'Local',
        cardUid: card.cardUid
      },
    ];
  }
}

// Create and export a singleton instance
const cardService = new CardService();
export default cardService;