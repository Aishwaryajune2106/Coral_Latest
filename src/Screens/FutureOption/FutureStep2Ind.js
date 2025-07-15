import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import moment from 'moment';
import axios from 'axios';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';

const FutureStep2Ind = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {selectedCiIndustry, setSelectedCiIndustry} =
    useContext(CountryContext);

  const selectedOptiony = route.params?.option;
  console.log(selectedOptiony, 'herrr');

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [duration, setDuration] = useState(null);
  const [formattedDuration, setFormattedDuration] = useState('');
  const [profitModal, setProfitModal] = useState('');
  const [withdrawalFrequency, setWithdrawalFrequency] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [percentageReturn, setPercentageReturn] = useState('');

  const [showDuration, setShowDuration] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [profitGrowth, setProfitGrowth] = useState('');
  const [dateError, setDateError] = useState('');

  const [customAlert, setCustomAlert] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const frequencyOptions = [
    {value: 'Monthly', label: t('Monthly')},
    {value: 'Quarterly', label: t('Quarterly')},
    {value: 'Half-Yearly', label: t('Half-Yearly')},
    {value: 'Yearly', label: t('Yearly')},
  ];

  const [exchangeRate, setExchangeRate] = useState(null);
  const [userCurrency, setUserCurrency] = useState('AED'); // Default AED

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch(
          'https://api.exchangerate-api.com/v4/latest/AED',
        );
        const data = await res.json();
        const rate = data.rates[userCurrency];
        if (rate) {
          setExchangeRate(rate);
        }
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
      }
    };

    fetchExchangeRate();
  }, [userCurrency]);

  useEffect(() => {
    const fetchUserCurrency = async () => {
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              user_id: await AsyncStorage.getItem(AppStrings.USER_ID), // make sure userId is defined
            },
          },
        );

        const result = await response.json();
        if (result?.result && result?.data?.length > 0) {
          const currency = result?.data[0].u_currency || 'AED';
          setUserCurrency(currency);
          console.log('Fetched user currency:', currency);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserCurrency();
  }, []);

  const validateFields = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/AED',
      );
      const data = await response.json();

      const selectedCurrency = userCurrency;
      const rate = data?.rates[selectedCurrency];

      if (!rate) {
        setCustomAlert({
          visible: true,
          title: 'Error',
          message: `Currency ${selectedCurrency} not supported.`,
        });
        setIsLoading(false);
        return null;
      }

      const amountInAED = parseFloat(investmentAmount) / rate;
      console.log('Converted AED Amount:', amountInAED);

      if (isNaN(amountInAED) || amountInAED < 52000) {
        setCustomAlert({
          visible: true,
          title: 'Error',
          message: 'Investment Amount must be at least 52000 AED.',
        });
        setIsLoading(false);
        return null;
      }

      if (!duration || isNaN(duration) || parseInt(duration) < 1) {
        setCustomAlert({
          visible: true,
          title: 'Error',
          message: 'Duration must be at least 1 year.',
        });
        setIsLoading(false);
        return null;
      }

      if (!profitModal) {
        setCustomAlert({
          visible: true,
          title: 'Error',
          message: 'Please select a Profit Model.',
        });
        setIsLoading(false);
        return null;
      }

      setIsLoading(false);
      return amountInAED.toFixed(2); // Return the converted AED value
    } catch (error) {
      setCustomAlert({
        visible: true,
        title: 'Error',
        message: 'Failed to fetch exchange rate.',
      });
      setIsLoading(false);
      return null;
    }
  };

  //..................Calculator Api.................//
  const datagraph = {
    amount: investmentAmount,
    duration: duration,
    wf: withdrawalFrequency,
    project: selectedCiIndustry,
    platform: 'mobile',
  };

  useEffect(() => {
    fetchInvestmentData();
  }, [investmentAmount, duration, withdrawalFrequency]);

  const fetchInvestmentData = async convertedAEDAmount => {
    // setLoading(true);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/calculator',
        {...datagraph, amount: convertedAEDAmount ?? investmentAmount},
      );
      console.log('datagraphinside api', datagraph);
      const {result, return_amount, percentage} = response.data;

      console.log('Response', response.data);

      if (result && return_amount) {
        const parsedReturnAmount = parseFloat(return_amount);
        if (!isNaN(parsedReturnAmount)) {
          setReturnAmount(return_amount);
          setPercentageReturn(percentage);

          const years = ['2024', '2025', '2026', '2027', '2028', '2029'];

          // Ensure 'growth' is an array
          const growth = Array?.isArray(growth)
            ? growth
            : Array?.from(
                {length: years?.length},
                (_, index) => parsedReturnAmount * ((index + 1) * 0.05),
              );
          const truncatedNumbers = growth?.map(Math.trunc);

          console.log('Growth Array:', truncatedNumbers);
          const chart = {
            labels: years,
            datasets: [
              {
                data: truncatedNumbers,
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          };
          setChartData(chart);

          const profit = parsedReturnAmount - parseFloat(investmentAmount);
          setProfitGrowth(`$${profit.toFixed(2)} (${percentage})`);
          return {
            return_amount,

            chart,
            percentage,
          };
        } else {
          // alert('Invalid return amount');
                  ToastAndroid.show(
                    "Invalid return amount" || 'No data found for the provided inputs.',
                    ToastAndroid.SHORT,
                  );
          
        }
      } else {
        // alert('No Data Found');
         ToastAndroid.show(
                    "No Data Found" || 'No data found for the provided inputs.',
                    ToastAndroid.SHORT,
                  );
      }
    } catch (error) {
      console.error('Error fetching investment data: ', error);
      alert('Error fetching investment data');
    } finally {
      // setLoading(false);
    }
  };

  const handleNext = async () => {
    const convertedAED = await validateFields();
    if (convertedAED) {
      setIsLoading(true);
      try {
        // Fetch the investment data before navigating
        console.log('Fetching before investment data...');
        const {return_amount, chart, percentage} = await fetchInvestmentData(
          convertedAED,
        );
        console.log('Investment data fetched:');
        setIsLoading(false);
        console.log(
          {
            chartData: chartData,
            chart,
            returnAmount: return_amount,
            percentageReturn: percentage,
          },
          'FutureStep2Ind',
        );
        if (!chart || !return_amount || !percentage) {
          setIsLoading(false);
          ToastAndroid.show('No data found for the provided inputs.');
        } else {
          navigation.navigate('FutureStep3IndScreen', {
            investmentAmount: investmentAmount,
            duration: duration,
            profitModal: profitModal,
            withdrawalFrequency: withdrawalFrequency,
            chartData: chart,
            returnAmount: return_amount,
            percentageReturn: percentage,
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error in handling next step:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };
  console.log(selectedOptiony, 'selectedOptioner');
  console.log(userCurrency, 'userCurrency');
  console.log(investmentAmount, 'investmentAmountttt');

  const handleReset = () => {
    setInvestmentAmount('');
    setDuration(null);
    setProfitModal('');
    setShowDuration(false);
    setShowProfitModal(false);
    setShowFrequencyDropdown(false);
    setWithdrawalFrequency('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={AppImages.Leftarrow}
            style={[
              styles.backIcon,
              i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('Future Combination')}</Text>
      </View>

      <View style={styles.whiteContainer}>
        <View style={{flex: 1}}>
          <View style={styles.greyContainer}>
            <Text style={styles.label1}>{t('Investment Amount')}(AED)</Text>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>{selectedOptiony}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('Enter amount')}
            keyboardType="numeric"
            value={investmentAmount}
            onChangeText={text => {
              setInvestmentAmount(text);
              if (text && parseFloat(text) > 0) {
                setShowDuration(true);
              } else {
                setShowDuration(false);
                setDuration(null); // clear duration if amount is removed
              }
            }}
          />
          {parseFloat(investmentAmount) > 0 &&
            exchangeRate &&
            parseFloat(investmentAmount) / exchangeRate < 100000 && (
              <Text style={styles.validationText}>
                {t(
                  'Amount should be at least 1,00,000 AED in your selected currency',
                )}
              </Text>
            )}

          {showDuration && (
            <View style={{}}>
              <Text style={styles.label1}>{t('Duration')} (Years)</Text>
              <TextInput
                style={styles.input}
                placeholder={t('Enter duration in years')}
                keyboardType="numeric"
                value={duration ? String(duration) : ''}
                onChangeText={text => {
                  setDuration(text);

                  if (text && parseFloat(text) > 0) {
                    setShowProfitModal(true);
                  } else {
                    setShowProfitModal(false);
                    setProfitModal(null);
                    setShowFrequencyDropdown(false);
                  }
                }}
              />
            </View>
          )}

          {showProfitModal && (
            <>
              <Text style={styles.label}>{t('Select Profit Model')}</Text>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    profitModal === 'Fixed' && styles.checkboxSelected,
                  ]}
                  onPress={() => {
                    setProfitModal('Fixed');
                    setShowFrequencyDropdown(true);
                  }}
                />
                <Text style={styles.checkboxLabel}>{t('Fixed')}</Text>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    profitModal === 'Flexible' && styles.checkboxSelected,
                  ]}
                  onPress={() => {
                    setProfitModal('Flexible');
                    setShowFrequencyDropdown(false);
                  }}
                />
                <Text style={styles.checkboxLabel}>{t('Flexible')}</Text>
              </View>
            </>
          )}

          {showFrequencyDropdown && (
            <>
              <Text style={styles.label}>
                {t('Select Withdrawal Frequency')}
              </Text>
              <Dropdown
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownTextStyle}
                data={frequencyOptions}
                labelField="label"
                valueField="value"
                placeholder={t('Select Frequency')}
                value={withdrawalFrequency}
                placeholderStyle={{color: AppColors.perfectgrey}}
                selectedTextStyle={{color: AppColors.darkgrey, fontSize: 14}}
                onChange={item => setWithdrawalFrequency(item.value)}
              />
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {!showFrequencyDropdown || !withdrawalFrequency ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={!isLoading ? handleNext : null}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="green" />
              ) : (
                <Text style={styles.buttonText}>{t('Next')}</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.investButton}
                onPress={!isLoading ? handleNext : null}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="green" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('Invest Combination')}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}>
                <Text style={styles.buttonText}>{t('Reset')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <CustomAlert
        visible={customAlert.visible}
        title={customAlert.title}
        message={customAlert.message}
        onClose={() =>
          setCustomAlert(prevState => ({...prevState, visible: false}))
        }
      />
    </View>
  );
};

export default FutureStep2Ind;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.OffWhite,
  },
  header: {
    height: 150,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: AppColors.white,
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  whiteContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: AppColors.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    backgroundColor: AppColors.OffWhite,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: AppColors.Black,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: AppColors.perfectgrey,
    marginBottom: 10,
  },
  label1: {
    fontSize: 14,
    color: AppColors.perfectgrey,
    top: 16,
  },
  input: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: AppColors.Black,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: AppColors.Black,
  },
  icon: {
    width: 20,
    height: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    marginRight: 5,
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: AppColors.bordergreen,
  },
  checkboxLabel: {
    marginRight: 20,
    fontSize: 14,
    color: AppColors.perfectgrey,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  investButton: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: AppColors.Grey,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.white,
    fontWeight: 'bold',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  optionButton: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: AppColors.Grey,
    borderRadius: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: AppColors.perfectgrey,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  optionButtonAny: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 5,
    // width: '100%',
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  optionButtonIndividual: {
    backgroundColor: AppColors.perfectgrey,
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  optionTextIndividual: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  descriptionContainer: {
    width: '100%',
  },
  descriptionBox: {
    backgroundColor: AppColors.lightyellow,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.Black,
    lineHeight: 18,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: AppColors.white, // Ensure the background is visible
    borderColor: AppColors.Grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: AppColors.darkgrey, // Ensure text color is visible
  },

  dropdownContainer: {
    borderColor: AppColors.violet,
    borderRadius: 8,
    color: AppColors.darkgrey,
  },
  dropdownTextStyle: {
    color: AppColors.perfectgrey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdownListTextStyle: {
    color: AppColors.darkgrey,
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: AppColors.perfectgrey,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationText: {
    color: 'red',
    fontSize: 12,
  },
});
