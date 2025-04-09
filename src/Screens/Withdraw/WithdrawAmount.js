import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const WithdrawAmount = ({navigation, route}) => {
  const {t} = useTranslation();
  const {totalAmount} = route.params;
  console.log(totalAmount, 'iDddd');
  const [amount, setAmount] = useState(''); // To store the entered amount
  const [selectedBank, setSelectedBank] = useState(null); // To manage selected bank
  const [banks, setBanks] = useState([]); // To store bank list from API
  const [loading, setLoading] = useState(true); // Loading state

  const balanceAmount = totalAmount; // Example balance amount
  const [errorMessage, setErrorMessage] = useState('');

  const [alertVisible, setAlertVisible] = useState(false); // Custom alert visibility
  const [alertContent, setAlertContent] = useState({
    title: '',
    message: '',
  }); // Alert content

  // Function to show custom alert
  const showAlert = (title, message) => {
    setAlertContent({title, message});
    setAlertVisible(true);
  };

  // Fetch bank list from API
  useEffect(() => {
    const fetchBankList = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/list',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              user_id: user_id, // Replace with actual user ID
            },
            body: JSON.stringify({}),
          },
        );

        const data = await response.json();

        if (data.result) {
          setBanks(data.list); // Update bank list
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching bank list:', error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchBankList();
  }, []);

  // Handle button press for the number pad
  const handleKeyPress = key => {
    if (key === 'x') {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => {
        const newAmount = prev?.length < 6 ? prev + key : prev;
        if (parseFloat(newAmount) > balanceAmount) {
          setErrorMessage('Amount should not be more than balance amount');
        } else {
          setErrorMessage('');
        }
        return newAmount;
      });
    }
  };

  // const [convertedbalancePrice, setConvertedbalancePrice] = useState(0);
  // const [currency, setCurrency] = useState('');
  // useEffect(() => {
  //   const fetchAndCalculatePrices = async () => {
  //     const {convertedbalancePrice} = await calculateConvertedPrices();

  //     setConvertedbalancePrice(convertedbalancePrice);
  //   };

  //   fetchAndCalculatePrices();
  // }, []);
  // // Function to calculate the wallet balance based on the stored rate
  // const calculateConvertedPrices = async () => {
  //   try {
  //     const currencyRate = await AsyncStorage.getItem('userCurrencyRate');
  //     const currency = await AsyncStorage.getItem('userCurrency');
  //     setCurrency(currency);
  //     const rate = JSON.parse(currencyRate);
  //     console.log(rate, 'rate');
  //     console.log(currency, 'currency');

  //     if (rate) {
  //       // Multiply share price and own price by the currency rate

  //       const convertedbalancePrice = rate * (balanceAmount || 0);

  //       console.log(`Converted balance Price: ${convertedbalancePrice}`);

  //       return {convertedbalancePrice};
  //     } else {
  //       console.log('Rate not found in AsyncStorage');
  //       return {
  //         convertedbalancePrice: 0,
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving rate from AsyncStorage:', error);
  //     return {
  //       convertedbalancePrice: 0,
  //     };
  //   }
  // };
  // console.log(convertedbalancePrice, 'convertedbalancePrice');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={AppImages.Blackbackicon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cash Out</Text>
      </View> */}

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>
          {amount || '0.00'} 
        </Text>
        <Text style={styles.balanceText}>
          {t('Your Balance')}
          {/* {convertedbalancePrice} {currency} */}
          {balanceAmount} AED
        </Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      {/* Number Pad */}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'x']?.map((key, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keypadButton}
            onPress={() => handleKeyPress(key)}>
            <Text style={styles.keypadText}>{key === 'x' ? '⌫' : key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bank List */}
      <View style={styles.bankContainer}>
        <View style={styles.bankHeader}>
          <Text style={styles.bankTitle}>{t('Bank Account')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddBankScreen')}>
            <Text style={styles.addText}>{t('Add')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={banks}
          keyExtractor={item => item.b_id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.bankItem,
                selectedBank === item.b_id && styles.bankItemSelected,
              ]}
              onPress={() => setSelectedBank(item.b_id)}>
              {/* Use Image for the bank logo */}
              <Image
                source={AppImages.Banklogo2}
                style={styles.bankLogo}
                resizeMode="contain"
              />
              <View style={styles.bankDetails}>
                <Text style={styles.bankName}>{item.b_name}</Text>
                <Text style={styles.bankAccount}>
                  **** **** {item.b_account_no.toString().slice(-4)}
                </Text>
              </View>
              {selectedBank === item.b_id && (
                <Text style={styles.selectedCheck}>✔</Text>
              )}
            </TouchableOpacity>
          )}
        />

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (!selectedBank) {
              showAlert('Error', 'Please select a bank');
              return;
            }
            if (!amount || parseFloat(amount) <= 0) {
              showAlert('Error', 'Please enter a valid amount');
              return;
            }
            navigation.navigate('WFA_PinScreen', {
              selectedBankId: selectedBank,
              enteredAmount: amount,
            });
          }}>
          <Text style={styles.continueText}>{t('CONTINUE')}</Text>
        </TouchableOpacity>
      </View>
      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertContent.title}
        message={alertContent.message}
      />
    </ScrollView>
  );
};

export default WithdrawAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    position: 'relative',
    backgroundColor: AppColors.white,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    position: 'absolute',
    top: '45%',
    marginLeft: 60,

    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'serif',
  },
  balanceText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 5,
    fontFamily: 'serif',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 100,
    marginBottom: 20,
  },
  keypadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'serif',
  },
  bankContainer: {
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 10,
    marginTop: -100,
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 30,
    fontFamily: 'serif',
  },
  addText: {
    fontSize: 15,
    color: '#6D8AE7',
    fontWeight: 'bold',
    marginHorizontal: 30,
    fontFamily: 'serif',
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 15,
  },
  bankItemSelected: {
    borderColor: '#F28F8F',
    borderWidth: 1,
  },
  bankLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'serif',
  },
  bankAccount: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  selectedCheck: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F28F8F',
    fontFamily: 'serif',
  },
  continueButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'serif',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'serif',
    marginHorizontal: 20,
    textAlign: 'center',
  },
});
