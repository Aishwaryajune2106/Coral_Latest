import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const RegisterSuccess = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const handleBackToLogin = () => {
    // Navigate back to login screen
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image with Decorative Elements */}
      <ImageBackground
        source={AppImages.VioletDot} // Replace with your background image path
        style={styles.backgroundImage}></ImageBackground>

      {/* Success Message */}
      <View style={{marginTop: 20}}>
        <Text style={styles.successMessage}>{t('Register Successful')}!</Text>
      </View>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
        <Text style={styles.buttonText}>{t('BACK TO LOGIN')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    width: '100%',
    height: 250, // Adjust the height of the background image
    justifyContent: 'center',
    alignItems: 'center',
    objectFit: 'contain',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Circle should be above the dots
  },
  icon: {
    width: 50,
    height: 50,
  },
  decoration: {
    position: 'absolute',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Dots should be behind the circle
  },
  dot: {
    width: 20, // Increase the size of the dot
    height: 20, // Increase the size of the dot
    position: 'absolute',
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    borderRadius: 10, // Make the dot circular
  },
  dotImageBackground: {
    width: '100%', // Ensure the image takes up the full size of the dot
    height: '100%', // Ensure the image takes up the full size of the dot
    borderRadius: 10, // Match the circular shape of the dot
    resizeMode: 'contain', // Ensure the image is contained properly
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.violet,
    // marginBottom: 30,
    top: '50%',
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 15,
    // paddingHorizontal: 50
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: '20%',
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
