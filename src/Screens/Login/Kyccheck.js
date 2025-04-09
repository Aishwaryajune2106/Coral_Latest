import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Circle} from 'react-native-progress';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const Kyccheck = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [timeLeft, setTimeLeft] = useState(5); // Countdown timer
  const [isCompleted, setIsCompleted] = useState(false); // KYC completion state
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true); // Set KYC status to completed
    }
  }, [timeLeft]);

  if (isCompleted) {
    // Render KYC Completed Screen
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image source={AppImages.tick} style={styles.icon} />
            </View>
          </View>
          <Text style={styles.completedTitle}>{t('KYC Completed')}</Text>
          <View style={{}}>
            <Text style={styles.completedSubtitle}>
              {t(
                'Thanks for submitting your document. We will verify it and complete your KYC as soon as possible',
              )}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.completedButton}
            onPress={() => navigation.navigate('CreatePinScreen')}>
            <Text style={styles.completedButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Circular Loader */}
      <View style={styles.loaderContainer}>
        <Circle
          size={screenWidth * 0.2} // Responsive size for the circle
          progress={(5 - timeLeft) / 5} // Progress from 0 to 1
          showsText
          formatText={() => `00:0${timeLeft}`}
          color={AppColors.miniblue}
          unfilledColor={AppColors.OffWhite}
          borderWidth={0}
          thickness={5}
          textStyle={styles.timerText}
        />
      </View>

      {/* Checking Text */}
      <Text style={styles.title}>{t('Checking! Please wait...')}</Text>
      <Text style={styles.subtitle}>
        {t('Your account is being checked before ready to use')}
      </Text>

      {/* Back to Home Button */}
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('Home')} // Replace 'Home' with your home screen route
      >
        <Text style={styles.buttonText}>{t('BACK TO HOME')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.OffWhite,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    color: AppColors.miniblue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppColors.Black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: AppColors.darkgrey,
    marginBottom: 30,
  },
  button: {
    marginTop: 30,
    backgroundColor: AppColors.OffWhite,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderColor: AppColors.OffWhite,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
  completedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.miniblue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginBottom: 10,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 14,
    color: AppColors.darkgrey,
    textAlign: 'center',
    marginBottom: 30,
  },
  completedButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    alignItems: 'center',
  },
  completedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.Black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: AppColors.white, // Adjust color if needed
  },
});

export default Kyccheck;
