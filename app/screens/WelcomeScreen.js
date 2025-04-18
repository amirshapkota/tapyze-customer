import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to TAPYZE',
    description: 'Your secure digital wallet with tap-to-pay functionality',
    image: require('../assets/logo.png'),
  },
  {
    id: '2',
    title: 'Easy Payments',
    description: 'Just tap your card to make payments quickly and securely using NFC technology',
    image: require('../assets/tap-pay.png'),
  },
  {
    id: '3',
    title: 'Store Your Cards',
    description: 'Add all your payment cards in one secure place',
    image: require('../assets/cards.png'),
  },
  {
    id: '4',
    title: 'Ready to Go!',
    description: 'Set up your wallet in minutes and start making contactless payments',
    image: require('../assets/ready.png'),
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleBack = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Empty space to balance the header */}
        </View>
        <View style={styles.headerRight}>
          {currentSlideIndex > 0 && currentSlideIndex < slides.length - 1 ? (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButtonPlaceholder} />
          )}
        </View>
      </View>
      
      {/* Main content area*/}
      <View style={styles.contentContainer}>
        {/* Image section */}
        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={slides[currentSlideIndex].image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>
        
        {/* Text section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{slides[currentSlideIndex].title}</Text>
          <Text style={styles.description}>
            {slides[currentSlideIndex].description}
          </Text>
        </View>

        {/* Pagination section */}
        <View style={styles.paginationSection}>
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: currentSlideIndex === index ? '#ed7b0e' : '#e0e0e0' },
                ]}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.navigationSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              {currentSlideIndex > 0 ? (
                <TouchableOpacity 
                  style={[styles.navButton, styles.backButton]}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonPlaceholder} />
              )}
            </View>
            
            {/* Next/Get Started button */}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentSlideIndex < slides.length - 1 ? 'Next' : 'Get Started'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

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

export default WelcomeScreen;