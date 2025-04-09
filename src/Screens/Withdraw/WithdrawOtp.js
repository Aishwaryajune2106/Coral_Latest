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

const WithdrawOtp = ({navigation, route}) => {
  const {email, token} = route.params;
  console.log(email, token, 'hapiiiii');

  const [otp, setOtp] = useState(['', '', '', '']);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [resendEnabled, setResendEnabled] = useState(true);

  // Input refs for auto-focus
  const refs = Array(otp?.length).fill(null);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input field
    if (value && index < otp?.length - 1 && refs[index + 1]) {
      refs[index + 1].focus();
    }
  };

  //..................Otp Check..................//

  const handleGetOtp = () => {
    const otpCode = otp.join(''); // Combine OTP digits into a single string

    // Check if the OTP is entered correctly
    if (otpCode?.length !== 4) {
      setModalTitle('Error');
      setModalMessage('Please enter all 4 digits of the OTP.');
      setModalVisible(true);
      return;
    }

    // Check if the entered OTP matches the token
    if (otpCode === token) {
      setModalTitle('Success');
      setModalMessage('OTP Verified Successfully!');
      setModalVisible(true);
      // Navigate to the next screen on success
      navigation.navigate('WithdrawPassChangeScreen', {email});
    } else {
      setModalTitle('Error');
      setModalMessage('Incorrect OTP, please try again.');
      setModalVisible(true);
    }
  };

  const handleResendCode = () => {
    if (!resendEnabled) return;

    setResendEnabled(false);
    setModalTitle('Info');
    setModalMessage('A new OTP has been sent to your email.');
    setModalVisible(true);

    // Re-enable resend after 60 seconds
    setTimeout(() => setResendEnabled(true), 60000);
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
            source={AppImages.greaterarrow}
            style={styles.backArrowImage}
          />
        </TouchableOpacity> */}

        <Text style={styles.title}>Verify Your Email</Text>

        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Image source={AppImages.Group} style={styles.icon} />
          </View>
        </View>

        <Text style={styles.subtitle}>Please Enter The Code Sent To</Text>
        <Text style={styles.subtitle}>Your Registered Email</Text>

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
          <Text style={styles.getOtpButtonText}>Verify</Text>
          <Image
            source={AppImages.rightgreaterarrow}
            style={styles.rightArrowImage}
          />
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Didn't get the code?{' '}
          <TouchableOpacity onPress={handleResendCode}>
            <Text
              style={[
                styles.resendLink,
                {
                  color: resendEnabled ? AppColors.bordergreen : AppColors.Grey,
                },
              ]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          if (modalTitle === 'Success') {
            navigation.navigate('WithdrawPassChangeScreen', {email});
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

export default WithdrawOtp;
