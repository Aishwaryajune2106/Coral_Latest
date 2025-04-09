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
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const Nest_Egg_Amount = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {selectedPlan, w_id, balance} = route.params;
  console.log(selectedPlan, w_id, balance, 'helooo');

  const [amount, setAmount] = useState(''); // To store the entered amount
  const [selectedBank, setSelectedBank] = useState(null); // To manage selected bank
  const [banks] = useState([]); // Dummy bank list
  const [error, setError] = useState('');

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

  // Handle button press for the number pad
  const handleKeyPress = key => {
    if (key === 'x') {
      setAmount(prev => prev.slice(0, -1)); // Remove last character
    } else {
      setAmount(prev => (prev?.length < 6 ? prev + key : prev)); // Max 6 digits
    }
  };
  // Handle Continue Button press
  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showAlert('Error', 'Please enter a valid amount');
      return;
    }

    // Check if the entered amount is greater than balance
    if (parseFloat(amount) > balance) {
      setError(t('Amount should not be greater than balance'));

      return;
    } else {
      setError(''); // Reset error if valid
    }

    navigation.navigate('Nest_EggWFAScreen', {
      enteredAmount: amount,
      selectedPlan: selectedPlan,
      w_id: w_id,
    });
  };
  // const [convertedbalancePrice, setConvertedbalancePrice] = useState(0);
  // const [currency, setCurrency] = useState('');
  // useEffect(() => {
  //   const fetchAndCalculatePrices = async () => {
  //     if (balance !== undefined) {
  //       const {convertedbalancePrice, currency} =
  //         await calculateConvertedPrices(balance);
  //       setConvertedbalancePrice(convertedbalancePrice);
  //       setCurrency(currency);
  //     }
  //   };

  //   fetchAndCalculatePrices();
  // }, [balance]); // Runs when balance changes

  // const calculateConvertedPrices = async balance => {
  //   try {
  //     const currencyRate = await AsyncStorage.getItem('userCurrencyRate');
  //     const storedCurrency = await AsyncStorage.getItem('userCurrency');

  //     const rate = JSON.parse(currencyRate);
  //     console.log(rate, 'rate');
  //     console.log(storedCurrency, 'currency');

  //     if (rate) {
  //       const convertedbalancePrice = rate * (balance || 0);
  //       console.log(`Converted balance Price: ${convertedbalancePrice}`);

  //       return {convertedbalancePrice, currency: storedCurrency};
  //     } else {
  //       console.log('Rate not found in AsyncStorage');
  //       return {convertedbalancePrice: 0, currency: ''};
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving rate from AsyncStorage:', error);
  //     return {convertedbalancePrice: 0, currency: ''};
  //   }
  // };
  // console.log(convertedbalancePrice, 'convertedbalancePrice');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={AppImages.Blackbackicon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Nest Egg</Text>
        </View> */}

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{amount || '0.00'}</Text>
          <Text style={styles.balanceText}>
            {t('Your Balance')}
            : {balance} AED {/* {currency} */}
          </Text>
        </View>
        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
      </ScrollView>

      {/* Fixed Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>{t('Continue')}</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertContent.title}
        message={alertContent.message}
      />
    </View>
  );
};

export default Nest_Egg_Amount;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // Add padding for the fixed button space
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    position: 'relative',
    backgroundColor: AppColors.white,
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
  headerText: {
    position: 'absolute',
    top: '45%',
    marginLeft: 60,
    fontFamily: 'serif',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif',
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

  continueButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 20,
    marginHorizontal: 30,
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
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 15,
  },
});
