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

const { width } = Dimensions.get('window');

// Onboarding screens content
const slides = [
  {
    id: '1',
    title: 'Welcome to TapPay',
    description: 'Your secure digital wallet with tap-to-pay functionality',
    image: require('../assets/logo.png'),
  },
  {
    id: '2',
    title: 'Easy Payments',
    description: 'Just tap your phone to make payments quickly and securely using NFC technology',
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
    // Skip to the last slide or navigate to the main app
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      <View style={styles.header}>
        {currentSlideIndex > 0 && currentSlideIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={slides[currentSlideIndex].image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[currentSlideIndex].title}</Text>
          <Text style={styles.description}>
            {slides[currentSlideIndex].description}
          </Text>
        </View>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: currentSlideIndex === index ? '#3a6df0' : '#d1d8e0' },
              ]}
            />
          ))}
        </View>
        
        {/* Bottom navigation buttons */}
        <View style={styles.buttonContainer}>
          {/* Back button */}
          {currentSlideIndex > 0 ? (
            <TouchableOpacity 
              style={[styles.navButton, styles.backButton]}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 100 }} />
          )}
          
          {/* Next/Get Started button */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#546e7a',
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  description: {
    fontSize: 16,
    color: '#546e7a',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#3a6df0',
    elevation: 3,
    shadowColor: '#3a6df0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButtonText: {
    color: '#546e7a',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;