import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const NestEgg = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [modalNo1Visible, setModalNo1Visible] = useState(true);
  const [modalNo2Visible, setModalNo2Visible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [apiData, setApiData] = useState({
    balance: 0,
    profit: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['A', 'B', 'C'];

  const handleRadioButtonSelect = option => {
    setSelectedOption(option);
  };

  const closeModalNo1 = () => {
    setModalNo1Visible(false);
  };

  const handlePlanSelect = plan => {
    setSelectedPlan(plan);
  };

  const closeModalNo2 = () => {
    setModalNo2Visible(false);
  };

  const closeModalNo2open = () => {
    setModalNo2Visible(true);
  };
console.log(selectedOption, "selectedOption");

  const confirmPlan = () => {
    setModalNo2Visible(false);
    navigation.navigate('NestEggAmountScreen', {
      selectedPlan: selectedPlan,
      w_id: selectedOption?.w_id,
      balance: apiData?.balance,
    });
  };
  //.................List Api..................//

  const fetchTransactionData = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      setLoading(true);
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/contractlist',
        {
          method: 'POST', // Use POST instead of GET
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
          },
          body: JSON.stringify({type: 'invest'}), // Properly formatted body
        },
      );

      const data = await response.json();
      if (data.result) {
        setTransactionData(data.data);
        console.log(data.data, 'hii');
      } else {
        console.error('Failed to fetch data:', data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
    fetchData();
  }, []);
  const fetchData = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    console.log(user_id, 'user');

    try {
      const response = await axios.get(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/nestegg/list',
        {
          headers: {
            user_id: user_id,
          },
        },
      );
      console.log('API Response:', response?.data);
      if (response?.data?.result) {
        setApiData({
          balance: response?.data?.balance,
          profit: response?.data?.profit,
          data: response?.data?.data,
        });
        console.log(response?.data?.message);
      } else {
        console.log(response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
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
  // }, [apiData]);
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

  //       const convertedbalancePrice = rate * (apiData?.balance || 0);

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
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={AppImages.Blackbackicon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Nest Egg</Text>
      </View> */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.white}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imgcontainer}>
          {/* Header Background */}
          <ImageBackground
            source={AppImages.Withdrawimg}
            style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <Text style={styles.balanceText}>{t('Balance')}</Text>
              {/* <Text style={styles.dateText}>Today, 08 Sept 2019</Text> */}
              <Text style={styles.amountText}>
                {/* {convertedbalancePrice}{" "}{currency} */}
                {apiData?.balance} AED
              </Text>
              {/* <Text style={styles.changeText}>up by 2% from last month</Text> */}
              {/* Add Future Plan Section */}
              <Text style={styles.futurePlanTitle}>
                {t('Select Your Future Plan')}
              </Text>
              <View style={styles.planButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.planButton,
                    selectedPlan === 'sixMonth'
                      ? styles.activeButton
                      : styles.inactiveButton,
                  ]}
                  onPress={() => handlePlanSelect('sixMonth')}>
                  <View style={styles.planButtonRow}>
                    <View>
                      <Text
                        style={[
                          styles.planButtonText,
                          selectedPlan === 'sixMonth'
                            ? styles.activeText
                            : styles.inactiveText,
                        ]}>
                        6 {t('Month')}
                      </Text>
                      <Text
                        style={[
                          styles.returnText,
                          selectedPlan === 'sixMonth'
                            ? styles.activeText
                            : styles.inactiveText,
                        ]}>
                        1% {t('Return')}
                      </Text>
                    </View>
                    <Image
                      source={AppImages.GraphGreen}
                      style={styles.planImage}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.planButton,
                    selectedPlan === 'oneYear'
                      ? styles.activeButton
                      : styles.inactiveButton,
                  ]}
                  onPress={() => handlePlanSelect('oneYear')}>
                  <View style={styles.planButtonRow}>
                    <View>
                      <Text
                        style={[
                          styles.planButtonText,
                          selectedPlan === 'oneYear'
                            ? styles.activeText
                            : styles.inactiveText,
                        ]}>
                        1 {t('Year')}
                      </Text>
                      <Text
                        style={[
                          styles.returnText,
                          selectedPlan === 'oneYear'
                            ? styles.activeText
                            : styles.inactiveText,
                        ]}>
                        2% {t('Return')}
                      </Text>
                    </View>
                    <Image
                      source={AppImages.GraphGreen}
                      style={styles.planImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
        <Text
          style={{
            color: AppColors.Black,
            fontSize: 18,
            fontFamily: 'serif',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {t('List of Contracts')}
        </Text>
        <View style={styles.whiteContainer}>
          {transactionData?.length > 0 ? (
            <FlatList
              data={transactionData}
              keyExtractor={item => item?.ui_id?.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    handleRadioButtonSelect(item);
                    setModalNo2Visible(true);
                  }}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedOption === item && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioText}>{item.ui_project_name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Image source={AppImages.Warning} style={styles.noDataImage} />
              <Text style={styles.noDataText}>{t('No Active Contract')}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ModalNo1 */}
      <Modal
        visible={modalNo1Visible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModalNo1}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModalNo1}>
              <Image source={AppImages.Cross} style={styles.crossIconImage} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('Save for your future')}</Text>
            <Text style={styles.modalSubtitle}>
              {t('Grow Your Wealth, Secure Your Future')}
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={closeModalNo1}>
              <Text style={styles.continueButtonText}>{t('Continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ModalNo2 */}

      <Modal
        visible={modalNo2Visible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModalNo2}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModalNo2}>
              <Image source={AppImages.Cross} style={styles.crossIconImage} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {t('Confirm your Nest Egg investment')}
            </Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModalNo2}>
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmPlan}>
                <Text style={styles.confirmButtonText}>{t('Confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backwhite,
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
    top: '35%',
    alignSelf: 'center',
    color: AppColors.Black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgcontainer: {
    paddingBottom: 20,
  },
  headerBackground: {
    // width: '100%',
    height: width * 0.9,
    marginHorizontal: 20,
    backgroundColor: AppColors.white,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 20,
    paddingBottom: 40,
    marginBottom: 30,
  },
  balanceText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  dateText: {
    color: AppColors.white,
    fontSize: 13,
    marginVertical: 2,
    fontFamily: 'serif',
  },
  amountText: {
    color: AppColors.white,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  changeText: {
    color: AppColors.white,
    fontSize: 13,
    fontFamily: 'serif',
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    padding: 20,
    height: '100%',
    marginHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    color: AppColors.Grey,
    fontWeight: '600',
    marginRight: 20,
    fontFamily: 'serif',
  },
  activeTab: {
    color: AppColors.Black,
    borderBottomWidth: 2,
    borderBottomColor: AppColors.Black,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,

    resizeMode: 'contain',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  transactionType: {
    fontSize: 14,
    color: AppColors.Grey,
    marginTop: 3,
    fontFamily: 'serif',
  },
  transactionInfo: {
    alignItems: 'flex-end',
  },
  amountPositive: {
    fontSize: 16,
    color: AppColors.bordergreen,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  amountNegative: {
    fontSize: 16,
    color: AppColors.red,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  transactionDate: {
    fontSize: 12,
    color: AppColors.Grey,
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
    color: AppColors.Grey,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.backwhite,
    padding: 20,
  },
  withdrawButton: {
    backgroundColor: AppColors.Yellow,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'serif',
  },
  futurePlanTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'serif',
  },
  planButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  planButton: {
    width: '45%',
    backgroundColor: AppColors.perfectgrey,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  planButtonText: {
    color: AppColors.Black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  returnText: {
    color: AppColors.Black,
    fontSize: 14,

    fontFamily: 'serif',
  },
  planButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planImage: {
    width: 25,
    height: 25,
    marginLeft: 10, // Add spacing between the image and text
    resizeMode: 'contain',
  },
  inactiveButton: {
    backgroundColor: AppColors.Grey,
  },
  activeButton: {
    backgroundColor: AppColors.Yellow,
  },
  inactiveText: {
    color: AppColors.white,
  },
  activeText: {
    color: 'green',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  crossIconImage: {
    width: 20,
    height: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 10,
    color: AppColors.Black,
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: 'serif',
    color: AppColors.perfectgrey,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: AppColors.Grey,
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: AppColors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColors.Black,
  },
  cancelButtonText: {
    color: AppColors.Black,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'serif',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: AppColors.Yellow,
    borderRadius: 5,
    paddingHorizontal: 25,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'serif',
  },
  continueButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  continueButtonText: {
    color: AppColors.white,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.Ash,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: AppColors.Yellow,
    borderColor: AppColors.Yellow,
  },
  radioText: {
    fontSize: 16,
    color: AppColors.Black,
    fontFamily: 'serif',
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
});

export default NestEgg;
