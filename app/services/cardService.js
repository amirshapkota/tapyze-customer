import authService from './authService';

const BASE_URL = 'https://tapyze.onrender.com/api';

class CardService {
  constructor() {
    this.token = null;
  }

  // Helper method to make API calls with better error handling
  async apiCall(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      // Get current token
      this.token = await authService.getToken();
      
      if (!this.token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
          ...options.headers,
        },
        ...options,
      };

      console.log('Making API call to:', url);
      console.log('With config:', JSON.stringify(config, null, 2));

      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is HTML (usually means 404 or server error)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`Server returned HTML instead of JSON. Check if the endpoint ${endpoint} exists and your backend is running.`);
      }

      // Get response text first to debug
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Card API Call Error:', error);
      
      // Network error handling
      if (error.message.includes('Network request failed')) {
        throw new Error('Network error. Please check your internet connection and ensure the backend server is running.');
      }
      
      // CORS error handling
      if (error.message.includes('CORS')) {
        throw new Error('CORS error. Please check your backend CORS configuration.');
      }
      
      throw error;
    }
  }

  // Get customer's cards
  async getCustomerCards() {
    try {
      console.log('Getting customer cards...');
      const response = await this.apiCall('/devices/cards');  // Changed from /device/cards to /devices/cards
      
      if (response.status === 'success') {
        console.log('Cards retrieved successfully:', response.data);
        return {
          success: true,
          cards: response.data.cards || []
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to get cards'
        };
      }
    } catch (error) {
      console.error('Error in getCustomerCards:', error);
      return {
        success: false,
        message: error.message || 'Failed to get cards'
      };
    }
  }

  // Assign card to customer with PIN
  async assignCardToCustomer(cardUid, pin) {
    try {
      console.log('Assigning card with UID:', cardUid, 'and PIN');
      const response = await this.apiCall('/devices/cards/assign', {
        method: 'POST',
        body: JSON.stringify({ cardUid, pin }),
      });

      if (response.status === 'success') {
        console.log('Card assigned successfully:', response.data);
        return {
          success: true,
          card: response.data.card,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to assign card'
        };
      }
    } catch (error) {
      console.error('Error in assignCardToCustomer:', error);
      return {
        success: false,
        message: error.message || 'Failed to assign card'
      };
    }
  }

  // Change card PIN
  async changeCardPin(cardId, currentPin, newPin) {
    try {
      console.log('Changing PIN for card:', cardId);
      const response = await this.apiCall(`/devices/cards/${cardId}/change-pin`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPin, newPin }),
      });

      if (response.status === 'success') {
        console.log('PIN changed successfully');
        return {
          success: true,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to change PIN'
        };
      }
    } catch (error) {
      console.error('Error in changeCardPin:', error);
      return {
        success: false,
        message: error.message || 'Failed to change PIN'
      };
    }
  }

  // Verify card PIN
  async verifyCardPin(cardUid, pin) {
    try {
      console.log('Verifying PIN for card:', cardUid);
      const response = await this.apiCall('/devices/cards/verify-pin', {
        method: 'POST',
        body: JSON.stringify({ cardUid, pin }),
      });

      if (response.status === 'success') {
        console.log('PIN verified successfully');
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Invalid PIN',
          data: response.data || {}
        };
      }
    } catch (error) {
      console.error('Error in verifyCardPin:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify PIN'
      };
    }
  }

  // Deactivate card (for lock/report lost)
  async deactivateCard(cardId, reason = 'INACTIVE') {
    try {
      console.log('Deactivating card:', cardId, 'Reason:', reason);
      const response = await this.apiCall(`/devices/cards/${cardId}/deactivate`, {  // Changed from /device/cards/ to /devices/cards/
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });

      if (response.status === 'success') {
        console.log('Card deactivated successfully:', response.data);
        return {
          success: true,
          card: response.data.card,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to deactivate card'
        };
      }
    } catch (error) {
      console.error('Error in deactivateCard:', error);
      return {
        success: false,
        message: error.message || 'Failed to deactivate card'
      };
    }
  }

  // Test connection to backend
  async testConnection() {
    try {
      console.log('Testing connection to backend...');
      
      // Try to get wallet balance first (we know this works)
      const testResponse = await fetch(`${BASE_URL}/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${await authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Test response status:', testResponse.status);
      
      if (testResponse.ok) {
        console.log('Backend connection successful');
        return { success: true, message: 'Backend connection successful' };
      } else {
        const errorText = await testResponse.text();
        console.log('Test response error:', errorText);
        return { success: false, message: `Backend responded with status ${testResponse.status}` };
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  // Format card number for display (based on your existing format)
  formatCardNumber(cardUid) {
    if (!cardUid) return '•••• •••• •••• 4327';
    
    // Keep your existing format, just use last 4 digits of cardUid
    const lastFour = cardUid.toString().slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  }

  // Format expiry date
  formatExpiryDate(expiryDate) {
    if (!expiryDate) return '04/28';
    
    const date = new Date(expiryDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  }

  // Check if card is locked based on status (updated for PIN lock)
  isCardLocked(card) {
    if (!card) return true;
    
    // Card is locked if it's not active, status is not ACTIVE, or PIN is locked
    return !card.isActive || !['ACTIVE', 'PENDING_ACTIVATION'].includes(card.status);
  }

  // Get card status display text (updated for PIN lock)
  getCardStatus(card) {
    if (!card) return 'No Card';
    
    if (card.status === 'LOST') return 'Lost';
    if (card.status === 'EXPIRED') return 'Expired';
    if (card.status === 'PENDING_ACTIVATION') return 'Pending';
    if (card.status === 'PIN_LOCKED') return 'PIN Locked';
    if (!card.isActive) return 'Locked';
    
    return 'Active';
  }

  // Check if PIN change is required
  requiresPinChange(card) {
    return card && card.requiresPinChange;
  }

  // Validate PIN format
  validatePin(pin) {
    if (!pin) return { valid: false, message: 'PIN is required' };
    if (!/^\d{4,6}$/.test(pin)) return { valid: false, message: 'PIN must be 4-6 digits' };
    return { valid: true };
  }
}

// Create and export a singleton instance
const cardService = new CardService();
export default cardService;