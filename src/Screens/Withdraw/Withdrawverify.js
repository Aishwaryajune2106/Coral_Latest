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
import CustomModal from '../../Components/CustomModal';

const Withdrawverify = ({navigation}) => {
  const [email, setEmail] = useState('');
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

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/forgotpassword/otpsend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: email?.trim()}),
        },
      );

      const result = await response.json();

      if (result.status) {
        setModalTitle('Success');
        setModalMessage(result.message);
        setModalVisible(true);

        // Navigate to VerifyEmail after a delay
        setTimeout(() => {
          navigation.navigate('WithdrawOtpScreen', {
            email: email?.trim(),
            token: result.token,
          });
        }, 2000); // Adjust the timeout as per modal duration
      } else {
        setModalTitle('Error');
        setModalMessage(
          result.message || 'Something went wrong. Please try again.',
        );
        setModalVisible(true);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage(
        'Failed to send verification code. Please check your internet connection.',
      );
      setModalVisible(true);
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
          <Text style={styles.title}>Forgot Password</Text>

          {/* Icon and Description */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image source={AppImages.emailicon} style={styles.icon} />
            </View>
            <Text style={[styles.description, {marginTop: 15}]}>
              Enter Your Email Address To
            </Text>
            <Text style={styles.description}>Receive a Verification Code</Text>
          </View>

          {/* Email Input */}
          <Text style={styles.inputLabel}>Your email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
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
            <Text style={styles.continueText}>Continue</Text>
            <Image
              source={AppImages.rightgreaterarrow} // Replace with the correct image path
              style={styles.rightArrowImage}
            />
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
            navigation.navigate('VerifyEmail', {email: email.trim()});
          }
        }}
      />
    </>
  );
};

export default Withdrawverify;

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
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: AppColors.white,
  },
  description: {
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
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  rightArrowImage: {
    width: 20,
    height: 20,
    tintColor: AppColors.Black,
    left: '30%',
  },
});
