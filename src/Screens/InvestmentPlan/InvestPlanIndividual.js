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

const InvestPlanIndividual = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {
    investmentAmount,
    setInvestmentAmount,
    duration,
    setDuration,
    formattedDuration,
    profitModal,
    setProfitModal,
    withdrawalFrequency,
    setWithdrawalFrequency,
    returnAmount,
    setReturnAmount,
    percentageReturn,
    setPercentageReturn,
    selectedOptiony,
    selectedCiIndustry,
    setSelectedCiIndustry,
  } = useContext(CountryContext);

  const [showDuration, setShowDuration] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
  console.log(selectedCiIndustry, 'selectedCiIndustry');

  const frequencyOptions = [
    {value: 'Monthly', label: t('Monthly')},
    {value: 'Quarterly', label: t('Quarterly')},
    {value: 'Half-Yearly', label: t('Half-Yearly')},
    {value: 'Yearly', label: t('Yearly')},
  ];

  const validateFields = () => {
    if (!investmentAmount || parseFloat(investmentAmount) < 100000) {
      setCustomAlert({
        visible: true,
        title: 'Error',
        message:
          'Investment Amount must be at least 100000 AED for the selected industry',
      });
      return false;
    }
    if (!duration) {
      setCustomAlert({
        visible: true,
        title: 'Error',
        message: 'Please select a duration.',
      });
      return false;
    }
    if (!profitModal) {
      setCustomAlert({
        visible: true,
        title: 'Error',
        message: 'Please select a profit modal.',
      });
      return false;
    }
    if (profitModal === 'Fixed' && !withdrawalFrequency) {
      setCustomAlert({
        visible: true,
        title: 'Error',
        message: 'Please select a withdrawal frequency.',
      });
      return false;
    }
    return true;
  };
  const validateEndDate = selectedDate => {
    const today = new Date();
    const oneYearFromNow = new Date(today.setFullYear(today.getFullYear() + 1));

    if (selectedDate >= oneYearFromNow) {
      setDateError('');
      return true;
    } else {
      setDateError(
        'End date should be more than or equal to 1 year from today',
      );
      return false;
    }
  };

  const handleNext = async () => {
    if (validateFields()) {
      setIsLoading(true);
      try {
        await fetchInvestmentData();

        setIsLoading(false);
        navigation.navigate('InvestReturnIndividualScreen', {
          chartData,
          returnAmount,
          percentageReturn,
        });
      } catch (error) {
        setIsLoading(false);
        console.error('Error in handling next step:', error);
        setCustomAlert({
          visible: true,
          title: 'Error',
          message: 'An error occurred. Please try again.',
        });
      }
    }
  };
  useEffect(() => {
    handleReset();
  }, []);

  //..................Calculator Api.................//

  const datagraph = {
    amount: investmentAmount,
    year: formattedDuration,
    wf: withdrawalFrequency,
    project: selectedCiIndustry,
    platform: 'mobile',
  };

  const fetchInvestmentData = async () => {
    // setLoading(true);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/calculator',
        datagraph,
      );

      console.log('datagraph', datagraph);
      const {result, return_amount, percentage, message} = response.data;

      console.log('Response data:', response.data);

      // Check if the result is false
      if (!result) {
        // Show a custom alert with the provided message
        alert(message || 'An error occurred. Please try again.');
        return; // Prevent further execution
      }

      // Validate if the response contains a valid return amount
      if (return_amount) {
        const parsedReturnAmount = parseFloat(return_amount);

        if (!isNaN(parsedReturnAmount)) {
          setReturnAmount(return_amount);
          setPercentageReturn(percentage);

          const years = ['2024', '2025', '2026', '2027', '2028', '2029'];

          // Calculate growth
          const growth = Array.from(
            {length: years?.length},
            (_, index) => parsedReturnAmount * ((index + 1) * 0.05),
          );
          const truncatedNumbers = growth?.map(Math.trunc);

          if (truncatedNumbers && truncatedNumbers?.length > 0) {
            // Update chart data if there's valid growth
            console.log('Growth Array:', truncatedNumbers);
            setChartData({
              labels: years,
              datasets: [
                {
                  data: truncatedNumbers,
                  color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            });

            const profit = parsedReturnAmount - parseFloat(investmentAmount);
            setProfitGrowth(`$${profit.toFixed(2)} (${percentage})`);
          } else {
            // If no growth data, show an alert and set a default chart
            alert('No data in chart');
            setChartData({
              labels: years,
              datasets: [
                {
                  data: [0, 0, 0, 0, 0, 0], // Default data
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color for default data
                  strokeWidth: 2,
                },
              ],
            });
          }
        } else {
          // alert('Invalid return amount');
        }
      } else {
        // Show an alert if no return amount is provided
        alert('No return amount available');
        setChartData({
          labels: ['2024', '2025', '2026', '2027', '2028', '2029'], // Default years
          datasets: [
            {
              data: [0, 0, 0, 0, 0, 0], // Default dataset
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color for clarity
              strokeWidth: 2,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching investment data: ', error);
      alert('Error fetching investment data');
    } finally {
      // setLoading(false);
    }
  };

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
        <Text style={styles.headerText}>{t('Investment Combination')}</Text>
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
            placeholderTextColor={'#888'}
            value={investmentAmount}
            onChangeText={text => {
              setInvestmentAmount(text);
              if (parseFloat(text) >= 100000) {
                setShowDuration(true);
              } else {
                setShowDuration(false);
                setDuration(null);
                setShowProfitModal(false);
                setProfitModal('');
                setShowFrequencyDropdown(false);
                setWithdrawalFrequency('');
              }
            }}
          />
          {investmentAmount && parseFloat(investmentAmount) < 100000 ? (
            <Text style={styles.errorText}>
              {t('Amount should not be less than 100000 AED')}
            </Text>
          ) : null}

          {showDuration && (
            <>
              <Text style={styles.label}>{t('Investment End Date')}</Text>
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                  {duration
                    ? moment(duration).format('DD-MM-YYYY')
                    : t('Select Date')}
                </Text>
                <Image source={AppImages.Calender} style={styles.icon} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={duration || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      if (validateEndDate(selectedDate)) {
                        setDuration(selectedDate);
                        setShowProfitModal(true);
                      }
                    }
                  }}
                />
              )}
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}
            </>
          )}
          {showProfitModal && (
            <>
              <Text style={styles.label}>{t('Select Profit Modal')}</Text>
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
                {' '}
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
                    {' '}
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

export default InvestPlanIndividual;

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
    fontFamily: 'serif',
    alignSelf: 'center',
    color: AppColors.white,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
