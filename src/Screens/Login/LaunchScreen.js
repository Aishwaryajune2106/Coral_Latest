import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const LaunchScreen = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={AppImages.Mainbackground} // Replace with your image URL
        style={styles.backgroundImage}>
        <View style={styles.logoContainer}>
          <Image
            source={AppImages.Correctlogo} // Replace with your logo URL
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>{t('Explore the app')}</Text>
        <Text style={styles.subtitle}>
          {t('Now your finances are in one place and always under control')}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInButtonText}>{t('Sign In')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('CreateAccountScreen')}>
            <Text style={styles.createAccountButtonText}>
              {t('Create account')}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100, // Adjust size according to your logo
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.white,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    width: '90%',
    backgroundColor: AppColors.Yellow,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
  },
  createAccountButton: {
    width: '90%',
    borderWidth: 1,
    borderColor: AppColors.Yellow,
    paddingVertical: 15,
    borderRadius: 10,
  },
  createAccountButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
  },
});

export default LaunchScreen;
