import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Maintenance = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>We're Currently Under Maintenance</Text>
      <Text style={styles.subText}>Please check back later. We apologize for the inconvenience.</Text>
    </View>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6f61',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
