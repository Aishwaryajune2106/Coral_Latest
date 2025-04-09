import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CustomModal from '../../Components/CustomModal';
import axios from 'axios';

const WithdrawPassChange = ({navigation, route}) => {
  const {email} = route.params;
  console.log(email, 'hapiiiiyyyi');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState(['', '', '', '']);
  const [otpConfirmPassword, setOtpConfirmPassword] = useState([
    '',
    '',
    '',
    '',
  ]);

  const handleContinue = () => {
    const newPasswordCode = otpNewPassword.join('');
    const confirmPasswordCode = otpConfirmPassword.join('');

    if (newPasswordCode !== confirmPasswordCode) {
      setModalTitle('Error');
      setModalMessage('Passwords do not match!');
      setModalVisible(true);
      return;
    }

    if (!newPasswordCode || !confirmPasswordCode) {
      setModalTitle('Error');
      setModalMessage('Please fill in both password fields!');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    // API call to change PIN
    const requestBody = {
      email: email,
      pin: newPasswordCode,
    };
    console.log(requestBody, 'hiaree');

    axios
      .post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/wfa-pin/change',
        requestBody,
      )
      .then(response => {
        setIsLoading(false);
        if (response.data.result) {
          setModalTitle('Success');
          setModalMessage(response.data.message);
          setModalVisible(true);
          navigation.navigate('WithdrawPinSetScreen'); // Navigate to next screen on success
        } else {
          setModalTitle('Error');
          setModalMessage(response.data.message || 'Something went wrong!');
          setModalVisible(true);
        }
      })
      .catch(error => {
        setIsLoading(false);
        setModalTitle('Error');
        setModalMessage('Failed to change PIN. Please try again later.');
        setModalVisible(true);
      });
  };

  // Input refs for auto-focus
  const refsNewPassword = Array(otpNewPassword?.length).fill(null);
  const refsConfirmPassword = Array(otpConfirmPassword.length).fill(null);

  const handleInputChange = (value, index, type) => {
    const otp = type === 'new' ? otpNewPassword : otpConfirmPassword;
    const setOtp = type === 'new' ? setOtpNewPassword : setOtpConfirmPassword;

    otp[index] = value;
    setOtp([...otp]);

    // Auto-focus the next input field
    if (
      value &&
      index < otp?.length - 1 &&
      (type === 'new'
        ? refsNewPassword[index + 1]
        : refsConfirmPassword[index + 1])
    ) {
      (type === 'new'
        ? refsNewPassword[index + 1]
        : refsConfirmPassword[index + 1]
      ).focus();
    }
  };

  return (
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
      <Text style={styles.title}>Set Password</Text>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Image
            source={AppImages.ChangePassword} // Replace with the password icon
            style={styles.icon}
          />
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Enter New Password</Text>
        <View style={styles.otpContainer}>
          {otpNewPassword?.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (refsNewPassword[index] = ref)}
              value={digit}
              onChangeText={value => handleInputChange(value, index, 'new')}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <Text style={styles.inputLabel}>Enter Confirm Password</Text>
        <View style={styles.otpContainer}>
          {otpConfirmPassword?.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (refsConfirmPassword[index] = ref)}
              value={digit}
              onChangeText={value => handleInputChange(value, index, 'confirm')}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
        <Text style={styles.continueText}>Continue</Text>
        <Image
          source={AppImages.rightgreaterarrow} // Replace with the correct image path
          style={styles.rightArrowImage}
        />
      </TouchableOpacity>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => {
          setModalVisible(false);
          if (modalTitle === 'Success') {
            navigation.navigate('Login');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    padding: 20,
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.Black,
    textAlign: 'center',
    marginVertical: 20,
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
  formContainer: {
    marginBottom: 50,
  },
  inputLabel: {
    fontSize: 16,
    color: AppColors.Black,
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
    padding: 15,
    borderRadius: 10,
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
  rightArrowImage: {
    width: 20,
    height: 20,
    tintColor: AppColors.Black,
    left: '30%',
  },
});

export default WithdrawPassChange;
