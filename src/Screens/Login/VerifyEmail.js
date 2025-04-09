import axios from 'axios';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import {useState} from 'react';
import AppImages from '../../Constants/AppImages';
import CustomModal from '../../Components/CustomModal';
import {useTranslation} from 'react-i18next';

const VerifyEmail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [resendEnabled, setResendEnabled] = useState(true); // Added for resend functionality
  const {email} = route.params; // Get the email passed from ForgotPassword
  console.log(email, 'email');

  // Input refs for auto-focus
  const refs = Array(otp?.length).fill(null);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input field
    if (value && index < otp.length - 1 && refs[index + 1]) {
      refs[index + 1].focus();
    }
  };

  const handleGetOtp = async () => {
    const otpCode = otp.join(''); // Combine OTP digits into a single string
    if (otpCode.length !== 4) {
      setModalTitle('Error');
      setModalMessage('Please enter all 4 digits of the OTP.');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/forgotpassword/mailverify',
        {
          email: email,
          code: otpCode,
        },
      );

      const data = response.data;
      console.log(data, 'dataaa');
      setModalTitle(data.result ? 'Success' : 'Error');
      setModalMessage(data.message || 'Verification failed. Please try again.');
      setModalVisible(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage(
        error.response?.data?.message ||
          'Failed to verify OTP. Please try again.',
      );
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!resendEnabled) return;
    setResendEnabled(false);

    try {
      await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/forgotpassword/otpsend',
        {email},
      );
      setModalTitle('Success');
      setModalMessage('A new OTP has been sent to your email.');
      setModalVisible(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage(
        error.response?.data?.message ||
          'Failed to resend OTP. Please try again.',
      );
      setModalVisible(true);
    } finally {
      setTimeout(() => setResendEnabled(true), 60000); // Enable resend after 60 seconds
    }
  };

  return (
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
        <Text style={styles.subtitle}>{email}</Text>

        <View style={styles.otpContainer}>
          {otp?.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (refs[index] = ref)}
              value={digit}
              onChangeText={value => handleInputChange(value, index)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleGetOtp} style={styles.continueButton}>
          <Text style={styles.getOtpButtonText}>{t('Verify')}</Text>
          <Image
            source={AppImages.rightgreaterarrow}
            style={styles.rightArrowImage}
          />
        </TouchableOpacity>

        <Text style={styles.resendText}>
          {t('Didnot get the code')}?{' '}
          <TouchableOpacity onPress={handleResendCode}>
            <Text
              style={[
                styles.resendLink,
                {
                  color: resendEnabled ? AppColors.bordergreen : AppColors.Grey,
                },
              ]}>
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
      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          if (modalTitle === 'Success') {
            navigation.navigate('ChangePassword', {email: email?.trim()});
          }
        }}
      />
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
  subtitle: {
    fontSize: 16,
    color: AppColors.darkgrey,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
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
    marginTop: 10,
  },
  resendLink: {
    fontWeight: 'bold',
  },
  backToLogin: {
    marginTop: 30,
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
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  rightArrowImage: {
    width: 20,
    height: 20,
    tintColor: AppColors.Black,
    marginLeft: 10,
  },
});

export default VerifyEmail;
