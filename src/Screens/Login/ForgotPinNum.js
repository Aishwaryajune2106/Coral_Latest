import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import axios from 'axios';
import CustomModal from '../../Components/CustomModal';
import { useTranslation } from 'react-i18next';

const ForgotPinNum = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleContinue = async () => {
    if (!email?.trim()) {
      setModalTitle('Error');
      setModalMessage('Please enter your email address');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/forgotpassword/otpsend',
        {
          email: email?.trim(),
        },
      );

      const data = response.data;

      if (data.result) {
        setModalTitle('Success');
        setModalMessage(data.message);
        setModalVisible(true);
        // Navigate to VerifyEmail after closing the modal
      } else {
        setModalTitle('Success');
        setModalMessage(data.message || 'Something went wrong');
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalTitle('Error');
      setModalMessage(
        error.response?.data?.message ||
          'Failed to send OTP. Please try again.',
      );
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back Button */}
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image
              source={AppImages.greaterarrow} // Replace with the correct image path
              style={styles.backArrowImage}
            />
          </TouchableOpacity> */}

          {/* Title */}
          <Text style={styles.title}>{t('Forgot PIN')}</Text>

          {/* Icon and Description */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image
                source={AppImages.emailicon} // Replace with your email icon
                style={styles.icon}
              />
            </View>
            <Text style={[styles.description, {marginTop: 15}]}>
              {t('Enter Your Email Address To')}
            </Text>
            <Text style={styles.description}>{t('Receive a Verification Code')}</Text>
          </View>

          {/* Email Input */}
          <Text style={styles.inputLabel}>{t('Your email address')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter your email')}
            placeholderTextColor={AppColors.Grey}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueButton}>
            <Text style={styles.continueText}>{t('Continue')}</Text>
            <Image
              source={AppImages.rightgreaterarrow} // Replace with the correct image path
              style={styles.rightArrowImage}
            />
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backToLogin}>
            <Text style={styles.backToLoginText}>{t('Back to Login')}</Text>
            <View style={styles.line} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          if (modalTitle === 'Success') {
            navigation.navigate('VerifyPinEmailScreen', {email: email?.trim()});
          }
        }}
      />
    </>
  );
};

export default ForgotPinNum;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingHorizontal: 20,
    paddingTop: '20%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backArrow: {
    fontSize: 20,
    color: AppColors.Black,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 60,
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
    shadowColor: AppColors.bordergreen,
    shadowOpacity: 0.6,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: AppColors.white, // Adjust color if needed
  },
  description: {
    // marginTop: 10,
    textAlign: 'center',
    color: AppColors.Black,
    fontSize: 14,
    fontWeight: '500',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginTop: 20,
    color: AppColors.Black,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: AppColors.bordergreen,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 15,
    marginVertical: 10,
    color: AppColors.Black,
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
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
  backToLogin: {
    marginTop: '80%',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: AppColors.Black,
  },
  line: {
    height: 2,
    width: 80,
    backgroundColor: AppColors.Black,
    marginTop: 5,
  },
  backArrowImage: {
    width: 24, // Adjust width as needed
    height: 24, // Adjust height as needed
    tintColor: AppColors.Black, // Optional: Change the color of the image if it's an SVG or monochromatic
  },
  rightArrowImage: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
    tintColor: AppColors.Black, // Optional: Change the color of the image if it's an SVG or monochromatic
    left: '30%',
  },
});
