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
import axios from 'axios';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Wallet = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const options = [
    t('Month'),
    `3 ${t('Month')}`,
    `6 ${t('Month')}`,
    `12 ${t('Month')}`,
  ];

  const [selectedTab, setSelectedTab] = useState('All');

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

  const profitHistory = [
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

  const tabs = ['All', 'Withdraw', 'Fixed Profit', 'Flexible Profit'];

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const selectOption = async option => {
    setSelectedOption(option);
    setDropdownVisible(false);
    await downloadStatement(option); // Ensure option is passed
  };

  //...............contractlist api.................//

  useEffect(() => {
    const fetchContracts = async () => {
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

      let type;
      switch (selectedTab) {
        case 'All':
          type = 'all';
          break;
        case 'Withdraw':
          type = 'withdraw';
          break;
        case 'Fixed Profit':
          type = 'fixed';
          break;
        case 'Flexible Profit':
          type = 'flexible';
          break;
        default:
          type = 'all';
      }

      try {
        setLoading(true);
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/contractlist',
          {type},
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
  }, [selectedTab]); // Fetch data whenever selectedTab changes

  const handleTabClick = tab => {
    setSelectedTab(tab);
  };

  //...............wallet api.................//

  const [transactions, setTransactions] = useState([]);
  const [walletAmount, setWalletAmount] = useState(0);
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

  //...............download wallet statement api.................//

  const downloadStatement = async option => {
    if (!option) {
      alert('Please select a statement period before downloading.');
      return;
    }

    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

    if (!userId) {
      alert('User ID not found');
      return;
    }

    let monthsAgo;
    switch (option) {
      case 'Month':
        monthsAgo = 1;
        break;
      case '3 Month':
        monthsAgo = 3;
        break;
      case '6 Month':
        monthsAgo = 6;
        break;
      case '12 Month':
        monthsAgo = 12;
        break;
      default:
        alert('Invalid selection');
        return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/download/statement/wallet',
        {type: 'all', monthsAgo},
        {headers: {user_id: userId}},
      );

      if (response.data.result) {
        const fileUrl = response.data.file;
        Linking.openURL(fileUrl);
      } else {
        alert('Failed to download statement');
      }
    } catch (err) {
      alert('Error downloading statement');
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.balanceText}>{t('Balance')}</Text>
              <Text style={styles.balanceText1}>
                {t('Today')}, {moment().format('DD MMM YYYY')}
              </Text>
              <Text style={styles.amountText}>{walletAmount}</Text>

              {/* <Text style={styles.balanceText1}>
                Up by 2% profit from last month
              </Text> */}
            </View>

            <View>
              <TouchableOpacity
                style={styles.withdrawButtons}
                onPress={() => navigation.navigate('Investplan')}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.withdrawButtonTexts}>
                    {t('Add New Invest')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {/* Statement Dropdown */}
        <View style={styles.statementWrapper}>
          <TouchableOpacity
            onPress={() => {
              if (selectedOption === 'Select') {
                setDropdownVisible(!isDropdownVisible);
              } else {
                downloadStatement(selectedOption); // Ensure selectedOption is passed
              }
            }}
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
                  onPress={() => {
                    selectOption(option);
                    setDropdownVisible(false);
                  }}
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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs?.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTabClick(tab)}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {selectedTab === 'All' && (
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
                        <Text style={styles.transactionType}>
                          {item.ui_status}
                        </Text>
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.amountPositive}>
                          {item.ui_amount}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {moment(item.ui_duration).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {selectedTab === 'Withdraw' && (
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
                          Status : {item.wr_status}
                        </Text>
                        {/* <Text style={styles.transactionType}>
                          {item.wr_status}
                        </Text> */}
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.amountPositive}>
                          {item.wr_amount}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {moment(item.wr_date).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {selectedTab === 'Fixed Profit' && (
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
                        <Text style={styles.transactionType}>
                          {item.ui_status}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {item.ui_security_option}
                        </Text>
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.amountPositive}>
                          {item.ui_amount}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {moment(item.ui_duration).format('YYYY-MM-DD')}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {item.n_name}
                        </Text>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {selectedTab === 'Flexible Profit' && (
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
                        <Text style={styles.transactionType}>
                          {item.ui_status}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {item.ui_security_option}
                        </Text>
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.amountPositive}>
                          {item.ui_amount}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {moment(item.ui_duration).format('YYYY-MM-DD')}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {item.n_name ? item.n_name : 'Nil'}
                        </Text>
                        <Text style={styles.transactionDate}>{item.ui_wf}</Text>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whitegrey,
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
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  balanceText1: {
    color: '#FFFFFF',
    fontSize: 12,
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
    left: 0, // Ensure it's aligned properly
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 5, // For Android shadow
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
  withdrawButtons: {
    backgroundColor: AppColors.Yellow,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 12,
  },
  withdrawButtonTexts: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginRight: 10,
  },
  rightImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5},
  activeTabButton: {
    // borderBottomWidth: 2,
    borderBottomColor: AppColors.NavyBlue,
  },
  tabText: {fontSize: 13, fontFamily: 'serif', color: '#888'},
  activeTabText: {color: AppColors.NavyBlue, fontWeight: 'bold', fontSize: 13},
});

export default Wallet;
