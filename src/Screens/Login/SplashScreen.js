import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';

const SplashScreen = ({navigation}) => {
  // Navigate to another screen after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LaunchScreen'); // Replace 'Home' with your next screen
    }, 3000); // Adjust the time (in milliseconds) for how long the splash screen will be shown
    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={AppImages.SplashScreen} // Replace with your background image URL or local image path
        style={styles.background}></ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.white,
    textAlign: 'center',
    marginTop: 10,
  },
});
