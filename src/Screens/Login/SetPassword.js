import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import App from '../../../App';
import {appendFile} from 'react-native-fs';
import {useTranslation} from 'react-i18next';

const SetPassword = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const handleLoginNavigation = () => {
    navigation.navigate('Login'); // Replace 'Login' with the name of your login screen route
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image
          source={AppImages.greaterarrow} // Replace with the correct image path
          style={styles.backArrowImage}
        />
      </TouchableOpacity> */}

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('Set Password')}</Text>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image
                source={AppImages.ChangePassword} // Replace with the password icon
                style={styles.icon}
              />
            </View>
          </View>
          <Text style={styles.message}>
            {t('Your password has been set successfully')}
          </Text>

          <Text style={styles.message}>
            {t('Now you can Login back again')}
          </Text>

          <TouchableOpacity
            onPress={handleLoginNavigation}
            style={styles.continueButton}>
            <Text style={styles.continueText}>{t('Login')}</Text>
            <Image
              source={AppImages.rightgreaterarrow} // Replace with the correct image path
              style={styles.rightArrowImage}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  backText: {
    color: AppColors.Grey,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: AppColors.Black,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    backgroundColor: AppColors.violet,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: AppColors.bordergreen,
    shadowOpacity: 0.6,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: AppColors.white,
  },
  iconGlow: {
    backgroundColor: AppColors.bordergreen,
    padding: 30,
    borderRadius: 100,
  },
  iconCircle: {
    backgroundColor: AppColors.violet,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCheck: {
    color: AppColors.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: AppColors.Black,
  },
  subMessage: {
    fontSize: 14,
    color: AppColors.Grey,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: AppColors.Yellow,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  rightArrowImage: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
    tintColor: AppColors.Black, // Optional: Change the color of the image if it's an SVG or monochromatic
    left: '30%',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: AppColors.Yellow,
    width: '100%',
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
});

export default SetPassword;
