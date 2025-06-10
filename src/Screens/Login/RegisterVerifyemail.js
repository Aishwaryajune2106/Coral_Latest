import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CustomModal from '../../Components/CustomModal';
import {useTranslation} from 'react-i18next';

const RegisterVerifyemail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {token, email} = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [resendMessageVisible, setResendMessageVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({title: '', message: ''});
  console.log('token', token, 'email', email);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input field
    if (value && index < otp?.length - 1) {
      const nextInput = `otpInput${index + 1}`;
      const nextField = refs[nextInput];
      if (nextField) nextField.focus();
    }
  };

  const handleGetOtp = async () => {
    const enteredOtp = otp.join('');

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/verify_otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            otp: enteredOtp,
          }),
        },
      );

      const data = await response.json();
      console.log('OTP Verification Response:', data);

      if (data.result) {
        showModal('Success', 'OTP verified successfully.');
        // Optionally navigate from modal confirm
      } else {
        showModal('Invalid OTP', data.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showModal('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleResendCode = () => {
    showModal('Code Resent', 'A new code has been sent to your email.');
    setResendMessageVisible(true);
    setResendEnabled(false);
    setTimeout(() => setResendMessageVisible(false), 5000);
    setTimeout(() => setResendEnabled(true), 30000);
  };

  const showModal = (title, message) => {
    setModalContent({title, message});
    setModalVisible(true);
  };

  // Input refs for auto-focus
  const refs = {};

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <CustomModal
          visible={modalVisible}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={() => {
            setModalVisible(false);
            // Optional: Add navigation or additional actions based on the modal content
            if (modalContent.title === 'Success') {
              navigation.navigate('RegisterSuccessScreen');
            }
          }}
        />

        {/* Back Button */}
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={AppImages.greaterarrow} // Replace with the correct image path
            style={styles.backArrowImage}
          />
        </TouchableOpacity> */}
        <Text style={styles.title}>{t('Verify Your Email')}</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Image
              source={AppImages.Group} // Replace with your email icon
              style={styles.icon}
            />
          </View>
        </View>
        <Text style={styles.subtitle}>
          {t('Please Enter The Code Sent To')}
        </Text>
        <Text style={[styles.subtitle, {marginBottom: 10}]}>
          {t('Your Email Address')}
        </Text>
        <Text style={[styles.subtitle, {marginVertical: 20}]}>
          {t('Enter The 4 Digit Code')}
        </Text>

        <View style={styles.otpContainer}>
          {otp?.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (refs[`otpInput${index}`] = ref)}
              value={digit}
              onChangeText={value => handleInputChange(value, index)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        {resendMessageVisible && (
          <Text style={styles.resendMessage}>
            {t('New code sent')}{' '}
            <Text style={styles.successText}>{t('successfully')}</Text>
          </Text>
        )}

        <TouchableOpacity onPress={handleGetOtp} style={styles.continueButton}>
          <Text style={styles.getOtpButtonText}>{t('Verify')}</Text>
          <Image
            source={AppImages.rightgreaterarrow} // Replace with the correct image path
            style={styles.rightArrowImage}
          />
        </TouchableOpacity>

        <Text style={styles.resendText}>
          {t('Didnot get the code')}?{' '}
          <TouchableOpacity>
            <Text
              style={[
                styles.resendLink,
                {color: resendEnabled ? AppColors.bordergreen : AppColors.Grey},
              ]}
              onPress={resendEnabled ? handleResendCode : null}>
              {t('Resend Code')}
            </Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>{t('Back to Login')}</Text>
          <View style={styles.line} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: '50%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  iconText: {
    color: AppColors.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkgrey,
    textAlign: 'center',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: AppColors.bordergreen,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: AppColors.darkgrey,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: AppColors.white, // Adjust color if needed
  },
  resendMessage: {
    fontSize: 14,
    color: AppColors.Black,
    marginVertical: 10,
    textAlign: 'center',
  },
  successText: {
    color: AppColors.bordergreen,
    fontWeight: 'bold',
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
  getOtpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
  resendText: {
    fontSize: 14,
    color: AppColors.darkgrey,
  },
  resendLink: {
    fontWeight: 'bold',
  },
  backToLogin: {
    marginTop: '50%',
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
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
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

export default RegisterVerifyemail;
