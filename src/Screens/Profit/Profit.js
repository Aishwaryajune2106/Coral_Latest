import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Profit = () => {
  const {t, i18n} = useTranslation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCurrency, setUserCurrency] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const options = [
    t('Month'),
    `3 ${t('Month')}`,
    `6 ${t('Month')}`,
    `12 ${t('Month')}`,
  ];

  const withdrawHistory = [
    {
      id: '1',
      b_name: 'Bank A',
      wr_status: 'Completed',
      wr_amount: '1000',
      wr_date: '2024-02-10',
    },
    {
      id: '2',
      b_name: 'Bank B',
      wr_status: 'Pending',
      wr_amount: '500',
      wr_date: '2024-02-12',
    },
    {
      id: '3',
      b_name: 'Bank C',
      wr_status: 'Failed',
      wr_amount: '300',
      wr_date: '2024-02-14',
    },
  ];

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  //...............download profit statement api.................//

  const selectOption = async option => {
    // If the same option is selected again, don't do anything
    if (option === selectedOption) {
      setDropdownVisible(false);
      return;
    }

    setSelectedOption(option);
    setDropdownVisible(false);

    // Convert selected option to monthAgo value
    let monthAgo;
    switch (option) {
      case t('Month'):
      case 'Month':
        monthAgo = 1;
        break;
      case `3 ${t('Month')}`:
      case '3 Month':
        monthAgo = 3;
        break;
      case `6 ${t('Month')}`:
      case '6 Month':
        monthAgo = 6;
        break;
      case `12 ${t('Month')}`:
      case '12 Month':
        monthAgo = 12;
        break;
      default:
        return;
    }

    try {
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
      const response = await axios.get(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/download/statement/profit',
        {
          params: {monthAgo},
          headers: {user_id: userId},
        },
      );

      if (response.data.result) {
        const fileUrl = response.data.file;
        if (fileUrl) {
          Linking.openURL(fileUrl);
        } else {
          Alert.alert('Download Failed', 'No file available for download.');
        }
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to retrieve statement.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong while downloading the statement.',
      );
    }
  };

  //...............contractlist api.................//

  useEffect(() => {
    const fetchContracts = async () => {
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

      try {
        setLoading(true);
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/contractlist',
          {type: 'invest'},
          {headers: {user_id: userId}},
        );

        if (response.data.result) {
          setContracts(response.data.data);
        } else {
          setError('Failed to fetch contracts');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  //...............wallet api.................//

  const [transactions, setTransactions] = useState([]);
  const [walletAmount, setWalletAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(null);
  useEffect(() => {
    const convertCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('userCurrency');
        if (!storedCurrency) {
          console.warn('No user currency found');
          return;
        }

        setUserCurrency(storedCurrency); // <-- Set currency in state

        const {data} = await axios.get(
          'https://api.exchangerate-api.com/v4/latest/AED',
        );
        const conversionRate = data.rates[storedCurrency];

        if (!conversionRate) {
          console.warn(
            `No conversion rate found for currency: ${storedCurrency}`,
          );
          return;
        }

        const converted = walletAmount * conversionRate;
        setConvertedAmount(converted.toFixed(2));
      } catch (error) {
        console.error('Currency conversion error:', error);
      }
    };

    convertCurrency();
  }, [walletAmount]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

      try {
        setLoading(true);
        const response = await axios.get(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/wallet/transaction/list',

          {headers: {user_id: userId}},
        );

        console.log('API Response:', response.data); // Debugging: Check API response
        console.log('Wallet Amount:', response.data.wallet);
        if (response.data.result) {
          setTransactions(response.data.data);
          setWalletAmount(response.data.wallet);

          console.log('Updated Transactions State:', response.data.data); // Debugging: Check state update
        } else {
          setError('Failed to fetch transactions');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log('Transactions updated:', transactions); // Debugging: Check if state updates after API call
  }, [transactions]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imgcontainer}>
          <ImageBackground
            source={AppImages.Withdrawimg}
            style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <Text style={styles.balanceText}>{t('Profit')}</Text>
              <Text style={styles.amountText}>
                {convertedAmount} {userCurrency}
              </Text>
              <Text style={styles.balanceText1}>
                {t('Today')}, {moment().format('DD MMM YYYY')}
              </Text>
            </View>
          </ImageBackground>
        </View>
        {/* Statement Dropdown */}
        <View style={styles.statementWrapper}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.statementButton}>
            <Image source={AppImages.Download} style={styles.downloadIcon} />
            <Text style={styles.statementText}>
              {selectedOption === 'Select' ? 'Statement' : selectedOption}
            </Text>
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdown}>
              {options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectOption(option)}
                  style={[
                    styles.dropdownOption,
                    selectedOption === option && styles.selectedOption,
                  ]}>
                  <Text style={styles.dropdownText}>{option}</Text>
                  {index !== options?.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <Text style={styles.tab}>{t('Profit History')}</Text>
          </View>
          {/* {isLoading ? (
            <ActivityIndicator size="large" color={AppColors.NavyBlue} />
          ) : ( */}
          <FlatList
            data={contracts}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.transactionItem}>
                <View style={styles.iconContainer}>
                  <Image source={AppImages.Bag} style={styles.icon} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>
                    {item.ui_project_name}
                  </Text>
                  <Text style={styles.transactionType}>{item.ui_status}</Text>
                  <Text style={styles.transactionType}>
                    {item.ui_security_option}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {item.ui_wf ? item.ui_wf : 'Nil'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_date).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
          {/* )} */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backwhite,
  },
  imgcontainer: {
    paddingBottom: 20,
  },
  headerBackground: {
    width: '100%',
    borderRadius: 10,
    height: width * 0.6,
    backgroundColor: AppColors.white,
  },
  headerContent: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  balanceText1: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'serif',
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },
  statementContainer: {
    backgroundColor: '#D3D3D3',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
    width: 120,
  },

  statementButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  statementWrapper: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
    width: 140,
  },
  statementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  downloadIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  statementText: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'serif',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10, // Ensure it's above other components
  },

  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOption: {
    backgroundColor: '#7A5CFA',
  },
  // separator: {
  //   height: 1,
  //   backgroundColor: '#D3D3D3',
  //   marginHorizontal: 10,
  // },
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    color: AppColors.NavyBlue,
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'serif',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,

    resizeMode: 'contain',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  transactionType: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
    fontFamily: 'serif',
  },
  transactionInfo: {
    alignItems: 'flex-end',
  },
  amountPositive: {
    fontSize: 16,
    color: '#3FBE6E',
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  amountNegative: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    fontFamily: 'serif',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: '30%',
  },
  noDataImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
});

export default Profit;
