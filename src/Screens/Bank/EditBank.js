import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import AppStrings from '../../Constants/AppStrings';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const EditBank = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    swiftCode: '',
    branchName: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (field, value) => {
    setBankDetails({...bankDetails, [field]: value});
  };

  const [errors, setErrors] = useState({});

  const handleSaveBank = async () => {
    let newErrors = {};

    if (!bankDetails.accountName)
      newErrors.accountName = 'Account Name is required';
    if (!bankDetails.bankName) newErrors.bankName = 'Bank Name is required';
    if (!bankDetails.branchName)
      newErrors.branchName = 'Branch Name is required';
    if (!bankDetails.accountNumber)
      newErrors.accountNumber = 'Account Number is required';
    if (!bankDetails.ifscCode)
      newErrors.ifscCode = 'IFSC/IBAN/Routing Number is required';

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const requestBody = {
      account_no: bankDetails.accountNumber,
      ifsc_code: bankDetails.ifscCode,
      swift_code: bankDetails.swiftCode,
      bank_name: bankDetails.bankName,
      branch_name: bankDetails.branchName,
      currency: 'aed',
    };

    try {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();
      if (data.result) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ✅ Fix: Function to close modal
  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('Name as per Bank Account')}
            value={bankDetails.accountName}
            onChangeText={text => handleChange('accountName', text)}
          />
          {errors.accountName && (
            <Text style={styles.errorText}>{errors.accountName}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('Bank Name')}
            value={bankDetails.bankName}
            onChangeText={text => handleChange('bankName', text)}
          />
          {errors.bankName && (
            <Text style={styles.errorText}>{errors.bankName}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('Branch Name')}
            value={bankDetails.branchName}
            onChangeText={text => handleChange('branchName', text)}
          />
          {errors.branchName && (
            <Text style={styles.errorText}>{errors.branchName}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('Account Number')}
            keyboardType="numeric"
            value={bankDetails.accountNumber}
            onChangeText={text => handleChange('accountNumber', text)}
          />
          {errors.accountNumber && (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('IFSC/IBAN/Routing Number Code')}
            value={bankDetails.ifscCode}
            onChangeText={text => handleChange('ifscCode', text)}
          />
          {errors.ifscCode && (
            <Text style={styles.errorText}>{errors.ifscCode}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={'#757575'}
            placeholder={t('Swift Code (optional)')}
            value={bankDetails.swiftCode}
            onChangeText={text => handleChange('swiftCode', text)}
          />
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBank}>
          <Text style={styles.saveButtonText}>{t('UPDATE BANK')}</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ImageBackground
                  source={AppImages.Successtick}
                  style={styles.backgroundImage}
                />
                <Text style={styles.successMessage}>
                  {t('Bank Edited Successful')}!
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleBackToLogin}>
                  <Text style={styles.buttonText}>{t('Back To profile')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default EditBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    marginTop: 20,
  },
  inputContainer: {
    marginVertical: 15,
  },
  input: {
    backgroundColor: '#F6F9FF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#2E6EF7',
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 350, // Increase width
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 30, // Increase padding for more spacing
  },
  backgroundImage: {
    width: 150,
    height: 150,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6BCFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage1: {
    fontSize: 13,
    color: AppColors.red,
    marginBottom: 25,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 8, // Increase button padding
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18, // Increase font size
    color: 'white',
    fontFamily: 'serif',
    // fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
