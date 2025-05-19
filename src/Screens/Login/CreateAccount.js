import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  Keyboard,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CustomModal from '../../Components/CustomModal';
import {useTranslation} from 'react-i18next';

const CreateAccount = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('JP');
  const [callingCode, setCallingCode] = useState('+81');
  const [currency, setCurrency] = useState('JPY');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [readyToInvest, setReadyToInvest] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const showModal = (title, message, onConfirm = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setOnConfirmAction(() => onConfirm);
    setModalVisible(true);
  };

  //..........Register API...............//

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!name || !email || !mobile || !password || !confirmPassword) {
      showModal('Error', 'Please fill in all fields.');
      return;
    }
    if (!termsAccepted) {
      showModal(
        'Terms Required',
        'Please accept the Terms and Conditions to proceed.',
      );
      return;
    }
    if (!readyToInvest) {
      showModal(
        'Confirmation Required',
        'Please confirm that you agree to join CWI Private Investor Group.',
      );
      return;
    }

    if (password !== confirmPassword) {
      showModal('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true); // Set loading state to true when the registration starts

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            mobile: `${callingCode}${mobile}`,
            currency,
            password,
            referralcode: referralCode,
          }),
        },
      );

      const data = await response.json();
      console.log('Registration Response:', data);

      if (data.status) {
        setLoading(false); // Hide loader when registration is successful
        setTimeout(() => {
          navigation.navigate('RegisterVerifyemailScreen', {
            token: data.token, // Pass the token here
          });
        }, 500); // Adjust delay as necessary (500ms is usually enough)
      } else {
        setLoading(false); // Hide loader if there's an error
        showModal('Error', data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setLoading(false); // Hide loader if there's an exception
      showModal('Error', 'Something went wrong. Please try again.');
    }
  };

  const validateEmail = email => {
    // Regular expression to match basic email format (e.g., user@example.com)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      showModal('Invalid Email', 'Please enter a valid email address');
    }
  };
  const handleNameChange = text => {
    // Regular expression to allow only alphabetic characters
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(text)) {
      setName(text); // Update the name if the input matches the regex
    } else {
      // You can show an alert or simply ignore non-alphabet input
      console.log('Only alphabets allowed');
    }
  };

  return (
    <ImageBackground
      source={AppImages.Mainbackground}
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={AppImages.Logotransparent}
              style={styles.logoImage}
            />
            <Text style={styles.tagline}>
              {t(
                'Invest in your future today, and watch your wealth grow tomorrow',
              )}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={[styles.tagline, {marginVertical: 10}]}>
              {t('Name')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('Name')}
              placeholderTextColor={AppColors.Grey}
              value={name}
              onChangeText={handleNameChange} // Use handleNameChange function
            />
            <Text style={[styles.tagline, {marginVertical: 10}]}>
              {t('Email')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('Email')}
              placeholderTextColor={AppColors.Grey}
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
              onBlur={handleEmailBlur} // Validate the email format when the input loses focus
            />

            <Text style={[styles.tagline, {marginVertical: 10}]}>
              {t('Mobile Number')}
            </Text>
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setShowPicker(true)}>
                <Text style={styles.countryText}>{`${callingCode}`}</Text>
              </TouchableOpacity>

              <CountryPicker
                withCallingCode
                withFlag
                withFilter
                withModal
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={country => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
                renderFlagButton={() => null} // This hides the "Select Country" text
              />

              <TextInput
                style={styles.phoneInput}
                placeholder={t('Phone Number')}
                placeholderTextColor={AppColors.Grey}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <Text style={[styles.tagline, {marginVertical: 10}]}>
              {t('Password')}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('Password')}
                placeholderTextColor={AppColors.Grey}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.imageIcon}>
                <Image
                  source={showPassword ? AppImages.Eye : AppImages.Hiddeneye}
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.tagline, {marginVertical: 10}]}>
              {t('Confirm Password')}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('Confirm Password')}
                placeholderTextColor={AppColors.Grey}
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                style={styles.imageIcon}>
                <Image
                  source={
                    confirmPasswordVisible ? AppImages.Eye : AppImages.Hiddeneye
                  }
                  style={styles.iconImage}
                />
              </TouchableOpacity>
              <Text style={[styles.tagline, {marginVertical: 10}]}>
                {t('Referral Code (Optional)')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('Enter Referral Code')}
                placeholderTextColor={AppColors.Grey}
                value={referralCode}
                onChangeText={setReferralCode}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
                marginLeft: 20,
              }}>
              <TouchableOpacity
                onPress={() => setTermsAccepted(!termsAccepted)}
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 1,
                  borderColor: AppColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                {termsAccepted && (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: AppColors.white,
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={{flex: 1, color: AppColors.white}}>
                I agree to the{' '}
                <Text
                  style={{
                    color: AppColors.white,
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => navigation.navigate('PrivacyScreen')}>
                  Terms and Conditions
                </Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
                marginLeft: 20,
              }}>
              <TouchableOpacity
                onPress={() => setReadyToInvest(!readyToInvest)}
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 1,
                  borderColor: AppColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                {readyToInvest && (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      backgroundColor: AppColors.white,
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={{flex: 1, color: AppColors.white}}>
                I agree to join CWI Private Investor Group
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              {loading ? (
                <Text style={styles.buttonText}>{t('Registering...')}</Text>
              ) : (
                <Text style={styles.buttonText}>{t('Register Now')}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              {t('Already have an account')}?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Login')}>
                {t('Login')}
              </Text>
            </Text>
          </View>
        </ScrollView>

        {/* Custom Modal */}
        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onConfirm={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  tagline: {
    color: AppColors.Grey,
    fontSize: 14,
    fontFamily: 'serif',

    fontWeight: '700',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: AppColors.Black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryPickerButton: {
    marginRight: 10,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 5,
  },
  callingCode: {
    color: AppColors.Black,
    marginRight: 10,
  },
  currencyCode: {
    color: AppColors.Black,
    fontWeight: '400',
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    fontFamily: 'serif',
    color: AppColors.Grey,
    marginTop: 15,
  },
  link: {
    color: AppColors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  imageIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: AppColors.Grey,
  },
  phoneinput: {
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginVertical: 10,
    color: AppColors.Black,
    width: '80%',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white, // White background
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    marginBottom: 15,
  },
  countryCodeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: AppColors.white, // Ensure white background
  },
  countryText: {
    fontSize: 16,
    color: AppColors.Black,
  },
  phoneInput: {
    flex: 1, // Takes up remaining space
    fontSize: 16,
    color: AppColors.Black,
  },
  modalContainer: {flex: 1, padding: 20, backgroundColor: AppColors.Ash},
  modalTitle: {
    fontSize: 18,

    marginBottom: 10,
    color: AppColors.OffWhite,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  countryItem: {padding: 10, borderBottomWidth: 1, borderColor: AppColors.Grey},
  countryText: {fontSize: 16, color: AppColors.Black},
  searchInput: {
    backgroundColor: AppColors.OffWhite,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    color: AppColors.Black,
  },
});

export default CreateAccount;
