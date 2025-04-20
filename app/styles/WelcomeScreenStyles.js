import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#fff',
    },
    headerLeft: {
      width: 60,
    },
    headerRight: {
      width: 60,
      alignItems: 'flex-end',
    },
    skipButton: {
      padding: 8,
    },
    skipButtonText: {
      fontSize: 16,
      color: '#000000',
      fontWeight: '500',
    },
    skipButtonPlaceholder: {
      width: 60,
      height: 40,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    imageSection: {
      height: height * 0.35,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
    },
    imageWrapper: {
      width: width * 0.8,
      height: width * 0.6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: width * 0.3,
      backgroundColor: '#f9f9f9',
    },
    textSection: {
      paddingHorizontal: 30,
      alignItems: 'center',
      height: height * 0.2,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 16,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      color: '#333333',
      textAlign: 'center',
      lineHeight: 24,
    },
    paginationSection: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationContainer: {
      flexDirection: 'row',
    },
    paginationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    navigationSection: {
      height: height * 0.15,
      justifyContent: 'center',
      paddingBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
    },
    buttonWrapper: {
      width: '48%',
      alignItems: 'center',
    },
    buttonPlaceholder: {
      width: '100%',
      height: 50,
    },
    navButton: {
      paddingVertical: 15,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextButton: {
      backgroundColor: '#ed7b0e',
      elevation: 3,
      shadowColor: '#ed7b0e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    nextButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    backButton: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    backButtonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  export default styles;