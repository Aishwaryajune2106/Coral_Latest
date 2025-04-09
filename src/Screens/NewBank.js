import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';

const NewBank = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    bankName: '',
    branchName: '',
    accountNumber: '',
    currency: '',
    ibanCode: '',
    swiftCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false); // Success Modal

  const currencies = [
    'AFN',
    'ALL',
    'DZD',
    'USD',
    'EUR',
    'AOA',
    'XCD',
    'ARS',
    'AMD',
    'AUD',
    'AZN',
    'BSD',
    'BHD',
    'BDT',
    'BBD',
    'BYN',
    'BZD',
    'XOF',
    'BTN',
    'BOB',
    'BAM',
    'BWP',
    'BRL',
    'BND',
    'BGN',
    'BIF',
    'KHR',
    'XAF',
    'CAD',
    'CVE',
    'CLP',
    'CNY',
    'COP',
    'KMF',
    'CRC',
    'HRK',
    'CUP',
    'CZK',
    'DKK',
    'DJF',
    'DOP',
    'EGP',
    'ERN',
    'SZL',
    'ETB',
    'FJD',
    'GMD',
    'GEL',
    'GHS',
    'GTQ',
    'GNF',
    'GYD',
    'HTG',
    'HNL',
    'HKD',
    'HUF',
    'ISK',
    'INR',
    'IDR',
    'IRR',
    'IQD',
    'ILS',
    'JMD',
    'JPY',
    'JOD',
    'KZT',
    'KES',
    'KWD',
    'KGS',
    'LAK',
    'LBP',
    'LSL',
    'LRD',
    'LYD',
    'MOP',
    'MKD',
    'MGA',
    'MWK',
    'MYR',
    'MVR',
    'MRU',
    'MUR',
    'MXN',
    'MDL',
    'MNT',
    'MAD',
    'MZN',
    'MMK',
    'NAD',
    'NPR',
    'ANG',
    'TWD',
    'NZD',
    'NIO',
    'NGN',
    'KPW',
    'NOK',
    'OMR',
    'PKR',
    'PAB',
    'PGK',
    'PYG',
    'PEN',
    'PHP',
    'PLN',
    'QAR',
    'RON',
    'RUB',
    'RWF',
    'WST',
    'STN',
    'SAR',
    'RSD',
    'SCR',
    'SLL',
    'SGD',
    'SBD',
    'SOS',
    'ZAR',
    'KRW',
    'SSP',
    'LKR',
    'SDG',
    'SRD',
    'SEK',
    'CHF',
    'SYP',
    'TJS',
    'TZS',
    'THB',
    'TOP',
    'TTD',
    'TND',
    'TRY',
    'TMT',
    'UGX',
    'UAH',
    'AED',
    'GBP',
    'UYU',
    'UZS',
    'VUV',
    'VES',
    'VND',
    'XPF',
    'MAD',
    'YER',
    'ZMW',
    'ZWL',
  ];

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    setErrors({
      ...errors,
      [field]: '', // Clear error as user types
    });
  };

  const validateForm = () => {
    const {bankName, branchName, accountNumber, currency, ibanCode, swiftCode} =
      form;
    const newErrors = {};

    if (!bankName) newErrors.bankName = 'Bank name is required';
    if (!branchName) newErrors.branchName = 'Branch name is required';
    if (!accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!currency) newErrors.currency = 'Currency is required';
    if (!ibanCode) newErrors.ibanCode = 'IBAN/IFCS/Wire code is required';
    if (!swiftCode) newErrors.swiftCode = 'Swift code is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };
  //..................Add Bank Api.................//
  const handleNext = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if (validateForm()) {
      const apiUrl =
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/add';
      const requestBody = {
        account_no: form.accountNumber,
        ifsc_code: form.ibanCode,
        swift_code: form.swiftCode,
        bank_name: form.bankName,
        branch_name: form.branchName,
        currency: form.currency,
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (response.ok && result.result) {
          // Show success message with SimpleToast
          Toast.show(result.message, Toast.LONG);

          // Optionally navigate after a short delay
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        } else {
          Toast.show(result.message || 'Something went wrong!', Toast.LONG);
        }
      } catch (error) {
        console.error('Error adding bank:', error);
        Toast.show('Network Error. Please try again later.', Toast.LONG);
      }
    }
  };

  const renderCurrencyItem = ({item}) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => {
        handleChange('currency', item);
        setModalVisible(false);
      }}>
      <Text style={styles.currencyText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#78c1e9', '#b8dff5']}
      style={styles.gradientBackground}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{alignSelf: 'center', bottom: '15%'}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 25,
              fontFamily: 'serif',
              fontWeight: 'bold',
              marginTop:30
            }}>
            Add Bank Details
          </Text>
        </View>
        {/* Form Inputs */}
        <View style={{bottom: '10%'}}>
          <TextInput
            style={styles.input}
            placeholder="Bank Name"
            placeholderTextColor="#888"
            value={form.bankName}
            onChangeText={value => handleChange('bankName', value)}
          />
          {errors.bankName && (
            <Text style={styles.errorText}>{errors.bankName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Branch Name"
            placeholderTextColor="#888"
            value={form.branchName}
            onChangeText={value => handleChange('branchName', value)}
          />
          {errors.branchName && (
            <Text style={styles.errorText}>{errors.branchName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Account Number"
            value={form.accountNumber}
            placeholderTextColor="#888"
            onChangeText={value => handleChange('accountNumber', value)}
            keyboardType="numeric"
          />
          {errors.accountNumber && (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          )}

          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}>
            <Text
              style={{
                color: form.currency ? '#333' : '#888',
                fontSize: 16,
                fontFamily: 'serif',
              }}>
              {form.currency || 'Select Currency'}
            </Text>
          </TouchableOpacity>
          {errors.currency && (
            <Text style={styles.errorText}>{errors.currency}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="IBAN/IFCS/Wire Code"
            value={form.ibanCode}
            placeholderTextColor="#888"
            onChangeText={value => handleChange('ibanCode', value)}
          />
          {errors.ibanCode && (
            <Text style={styles.errorText}>{errors.ibanCode}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Swift Code"
            value={form.swiftCode}
            placeholderTextColor="#888"
            onChangeText={value => handleChange('swiftCode', value)}
          />
          {errors.swiftCode && (
            <Text style={styles.errorText}>{errors.swiftCode}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Currency Selection */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={currencies}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCurrencyItem}
            />
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Text style={styles.successMessage}>
              Your bank added successfully!
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#000',
    marginBottom: 15,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  button: {
    backgroundColor: '#e5c957',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  currencyItem: {
    padding: 15,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'serif',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: 'serif',
  },
});

export default NewBank;
