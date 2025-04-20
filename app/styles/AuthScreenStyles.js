import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 15,
    },
    logo: {
      width: 120,
      height: 120,
    },
    header: {
      marginBottom: 25,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 10,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#666666',
      textAlign: 'center',
    },
    sliderContainer: {
      flexDirection: 'row',
      height: 50,
      backgroundColor: '#f5f5f5',
      borderRadius: 25,
      position: 'relative',
      marginBottom: 30,
    },
    sliderIndicator: {
      position: 'absolute',
      top: 5,
      width: width / 2 - 30,
      height: 40,
      backgroundColor: '#ed7b0e',
      borderRadius: 20,
      zIndex: 1,
    },
    sliderOption: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    activeOption: {
      // No styles needed as indicator handles the highlighting
    },
    sliderOptionText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    activeOptionText: {
      color: '#ffffff',
    },
    formContainer: {
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333333',
      marginBottom: 8,
    },
    input: {
      height: 55,
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 10,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#000000',
    },
    genderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderOption: {
      flex: 1,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      marginHorizontal: 4,
      borderRadius: 8,
    },
    activeGenderOption: {
      backgroundColor: '#fff3e8',
      borderColor: '#ed7b0e',
    },
    genderText: {
      fontSize: 14,
      color: '#666666',
    },
    activeGenderText: {
      color: '#ed7b0e',
      fontWeight: '600',
    },
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
      marginTop: -10,
      marginBottom: 20,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: '#ed7b0e',
      fontWeight: '500',
    },
    submitButton: {
      height: 55,
      backgroundColor: '#ed7b0e',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#ed7b0e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
      marginTop: 10,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    alternativeAuthContainer: {
      marginVertical: 20,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: '#e0e0e0',
    },
    dividerText: {
      fontSize: 14,
      color: '#666666',
      paddingHorizontal: 10,
    },
    socialButtonsContainer: {
      alignItems: 'center',
    },
    googleButton: {
      flexDirection: 'row',
      width: '40%',
      height: 45,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333333',
      marginLeft: 12,
      textAlign: 'center',
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    }
  });

  export default styles;