import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';

import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../Components/CustomModal';
import axios from 'axios';
import DeviceInfo, {getUniqueId} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import CountryContext from '../../Context/CountryContext';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

// import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Login = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const {isPinCreated, setPinCreated} = useContext(CountryContext);

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId:
  //       '562226833452-ok0hngauf02sl1relojp38ol873h63jh.apps.googleusercontent.com',
  //   });
  // }, []);

  // async function onGoogleButtonPress() {
  //   try {
  //     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //     const idToken = await GoogleSignin.signIn();
  //     console.log(idToken, 'idToken');
  //     console.log(idToken.data.idToken, 'idTokeninggg');

  //     Alert.alert('Logged in Sucessfully');
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     return auth().signInWithCredential(googleCredential);
  //   } catch (error) {
  //     console.log(error, 'error');
  //   }
  // }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = async () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }

        setBackPressedOnce(true);
        Toast.show('Press back again to exit', Toast.SHORT);
        setPinCreated(await AsyncStorage.getItem(AppStrings.IS_MPIN));
        setTimeout(() => setBackPressedOnce(false), 2000);

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [backPressedOnce]),
  );
  console.log(isPinCreated, 'isPinCreated');

  const [isPinButtonEnabled, setIsPinButtonEnabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });

  const showModal = (title, message) => {
    setModalContent({title, message});
    setModalVisible(true);
  };

  const handleLogin = async () => {
    const device = await DeviceInfo.getUniqueId();
    console.log(device, 'device');

    if (!email || !password) {
      showModal('Error', 'Please enter your email and password.');
      return;
    }
    const fcmToken = await AsyncStorage.getItem(AppStrings.DEVICE_TOKEN);
    console.log(AsyncStorage.getItem(AppStrings.DEVICE_TOKEN), 'fcmToken');
    setIsLoading(true);
    try {
      let requestbody = {
        app_version: '2',
        device_id: device,
        device_os: Platform.OS,
        device_token: '5446',
        email: email?.trim(),
        password: password,
        fcm_token: fcmToken,
      };
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/login',
        requestbody,
      );
      console.log(requestbody, 'dataaaa');
      const data = response.data;

      if (data.result) {
        // Save user details in AsyncStorage
        await AsyncStorage.multiSet([
          [AppStrings.USER_API_KEY, data.user_api_key],
          [AppStrings.USER_ROLE, data.user_role],
          [AppStrings.USER_MOBILE, data.user_mobile.toString()],
          [AppStrings.USER_EMAIL, data.user_email],
          [AppStrings.USER_ID, data.user_id.toString()],
          [AppStrings.USER_NAME, data.user_name],
          [AppStrings.USER_STATUS, data.user_status],
          [AppStrings.DEVICE_ID, device],
        ]);

        // Navigate to the next screen based on user status
        if (data.user_kyc === null || '') {
          navigation.navigate('KycOneScreen');
        } else {
          navigation.navigate('DashBoardStack');
        }
      } else {
        showModal('Error', data.message);
        console.log(data.message, 'loggednot');
      }
    } catch (error) {
      if (error.response) {
        console.error(
          'Server responded with:',
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('CreateAccountScreen');
  };

  useEffect(() => {
    const checkDeviceToken = async () => {
      try {
        const deviceToken = await DeviceInfo.getUniqueId();
        setIsPinButtonEnabled(!deviceToken);
      } catch (error) {
        console.error('Failed to fetch device token:', error);
        setIsPinButtonEnabled(false);
      }
    };

    checkDeviceToken();
  }, []);
  // const {isPinCreated, setPinCreated} = useContext(CountryContext);
  console.log(isPinCreated, 'isPinCreated');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={AppImages.Mainbackground} // Replace with your background image
        style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={AppImages.Logotransparent} // Replace with your logo
              style={styles.logo}
            />
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('Email')}
              placeholderTextColor={AppColors.Grey}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  i18n.language === 'ar'
                    ? styles.inputPasswordArabic
                    : styles.inputPassword
                }
                placeholder={t('Password')}
                placeholderTextColor={AppColors.Grey}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image
                  source={passwordVisible ? AppImages.Eye : AppImages.Hiddeneye}
                  style={styles.eyeImage}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotScreen')}>
              <Text style={styles.forgotPassword}>{t('Forgot Password')}</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? t('Logging in...') : t('Login')}
              </Text>
            </TouchableOpacity>
            {/* Render Access with PIN only if enabled */}
            {isPinCreated && (
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => navigation.navigate('ForgotPinScreen')}>
                <Text style={styles.buttonText}>{t('Access with PIN')}</Text>
              </TouchableOpacity>
            )}

            {/* Social Login Options */}
            <Text style={styles.orText}>{t('Or sign up with')}</Text>
            <View style={styles.socialButtonsContainer}>
              {/* <TouchableOpacity
                style={styles.socialButton}
                // onPress={onGoogleButtonPress}
                >
                <Image source={AppImages.Google} style={styles.socialImage} />
                <Text style={styles.socialButtonText}>
                  {t('Sign in with Google')}
                </Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.socialButton}>
                <Image source={AppImages.Apple} style={styles.socialImage} />
                <Text style={styles.socialButtonText}>
                  {t('Sign in with Apple ID')}
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* Sign-Up Link */}
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>
                {t('Dont have an account?')}{' '}
                <Text style={styles.signUpLink}>{t('Sign up here')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: AppColors.white,
    marginBottom: 20,
    color: AppColors.Black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    color: AppColors.Black,
  },
  inputPasswordArabic: {
    flex: 1,
    color: AppColors.Black,
    textAlign: 'right', // Arabic text alignment
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    color: AppColors.Grey,
    textAlign: 'right',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  buttonPrimary: {
    height: 50,
    backgroundColor: AppColors.Yellow,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    height: 50,
    backgroundColor: AppColors.Yellow,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.Yellow,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    // backgroundColor: AppColors.white,
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  signUpText: {
    color: AppColors.white,
    textAlign: 'center',
    marginTop: 20,
  },
  signUpLink: {
    color: AppColors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  eyeImage: {
    width: 20,
    height: 20,
    tintColor: AppColors.Grey, // Optional: tint the image color
  },

  socialImage: {
    width: 20,
    height: 20,
    marginRight: 10, // Add some space between the image and text
  },
});
