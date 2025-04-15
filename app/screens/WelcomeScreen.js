import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Hello World</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});

export default WelcomeScreen;