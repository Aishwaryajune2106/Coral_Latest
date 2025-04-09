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
const {width} = Dimensions.get('window');
const YourLogs = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select');
  const [selectedTab, setSelectedTab] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const options = ['Month', '3 Month', '6 Month', '12 Month'];

  const tabs = [
    {label: 'All', type: 'all'},
    {label: 'Profits', type: 'profit'},
    {label: 'Withdrawal', type: 'withdraw'},
    {label: 'Transfer of Contract', type: 'transfer'},
    {label: 'Termination of Contract', type: 'termination'},
    {label: 'Referral Bonus', type: 'referral'},
  ];

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const selectOption = async option => {
    setSelectedOption(option);
    setDropdownVisible(false);
    await downloadStatement(option); // Call download function immediately
  };

  const fetchActivityLogs = async type => {
    setIsLoading(true);
    try {
      const user_id = await AsyncStorage.getItem('USER_ID');
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/activities',
        {type},
        {headers: {user_id}},
      );

      setData(response.data.result ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setData([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActivityLogs(selectedTab);
  }, [selectedTab]);

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
      setIsLoading(true);
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/download/statement/activities',
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
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.statementWrapper}>
        <TouchableOpacity
          onPress={() => {
            if (selectedOption === 'Select') {
              setDropdownVisible(!isDropdownVisible);
            } else {
              downloadStatement();
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

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs?.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTab(tab.type)}
              style={[
                styles.tabButton,
                selectedTab === tab.type && styles.activeTabButton,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.type && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : data?.length === 0 ? (
          <Text style={styles.noDataText}>No Data Found</Text>
        ) : selectedTab === 'all' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({item}) => (
              <View style={styles.transactionItem}>
                <View style={styles.iconContainer}>
                  <Image source={AppImages.Bag} style={styles.icon} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>
                    {item.wr_id
                      ? `Withdraw : ${item.wr_status}`
                      : item.ui_project_name || `Status : ${item.wr_status}`}
                  </Text>

                  <Text style={styles.transactionType}>{item.ui_status}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_duration).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : selectedTab === 'profit' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_duration).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : selectedTab === 'withdraw' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({item}) => (
              <View style={styles.transactionItem}>
                <View style={styles.iconContainer}>
                  <Image source={AppImages.Bag} style={styles.icon} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>Withdraw Status</Text>
                  <Text style={styles.transactionType}>{item.wr_status}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.wr_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.wr_date).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : selectedTab === 'transfer' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_duration).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : selectedTab === 'termination' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_duration).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : selectedTab === 'referral' ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.amountPositive}>{item.ui_amount}</Text>
                  <Text style={styles.transactionDate}>
                    {moment(item.ui_duration).format('YYYY-MM-DD')}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </View>
    </View>
  );
};

export default YourLogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whitegrey,
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 150,
  },
  statementWrapper: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
    width: 140,
    marginTop: 20,
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
