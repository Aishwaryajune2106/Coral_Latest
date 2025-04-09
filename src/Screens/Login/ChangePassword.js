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
import AppImages from '../../Constants/AppImages'; // Ensure AppImages contains paths for the required images
import CustomModal from '../../Components/CustomModal';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const ChangePassword = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {email} = route.params; // Email passed from previous screen (ForgotPassword or similar)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setModalTitle('Error');
      setModalMessage('Passwords do not match!');
      setModalVisible(true);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setModalTitle('Error');
      setModalMessage('Please fill in both password fields!');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/forgotpassword/changepassword',
        {
          email: email, // Use the email passed from the previous screen
          password: newPassword,
        },
      );

      const data = response.data;

      if (data.result) {
        setModalTitle('Success');
        setModalMessage(data.message);
        setModalVisible(true);
        navigation.navigate('Login'); // Navigate to Login after success
      } else {
        setModalTitle('Error');
        setModalMessage(data.message);
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalTitle('Error');
      setModalMessage('Error occurred. Please try again.');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
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
      <Text style={styles.title}>{t('Set Password')}</Text>

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
        <Text style={styles.inputLabel}>{t('Enter New Password')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('New Password')}
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!passwordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.inputLabel}>{t('Enter Confirm Password')}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('Confirm Password')}
            placeholderTextColor="#A9A9A9"
            secureTextEntry={!passwordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}>
            <Image
              source={
                passwordVisible
                  ? AppImages.Eye // Visible eye image
                  : AppImages.Hiddeneye // Hidden eye image
              }
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
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
    paddingTop: '25%',
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
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: AppColors.Black,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.bordergreen,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: AppColors.Black,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  eyeImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
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
    alignItems: 'center',
    marginTop: 'auto',
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
  rightArrowImage: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
    tintColor: AppColors.Black, // Optional: Change the color of the image if it's an SVG or monochromatic
    left: '30%',
  },
});

export default ChangePassword;
