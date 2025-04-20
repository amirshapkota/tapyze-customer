import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

import styles from '../styles/WelcomeScreenStyles';
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
      navigation.navigate('Auth');
    }
  };

  const handleBack = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
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


export default WelcomeScreen;