import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="home" size={24} color="#ed7b0e" />
        <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="card-outline" size={24} color="#A0A0A0" />
        <Text style={styles.navText}>Card</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="document-text-outline" size={24} color="#A0A0A0" />
        <Text style={styles.navText}>Statements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="settings-outline" size={24} color="#A0A0A0" />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#ed7b0e',
    fontWeight: '600',
  },
});

export default BottomNav;
