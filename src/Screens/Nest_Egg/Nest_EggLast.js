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
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Nest_EggLast = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isFlexibleMode, setIsFlexibleMode] = useState(true);
  const [apiData, setApiData] = useState({
    balance: 0,
    profit: 0,
    data: [],
  });

  const flexibleData = [
    {
      id: '1',
      name: 'Coral',
      type: 'Subscription',
      amount: '- $144.00',
      date: '18 Sept 2019',
      icon: AppImages.Polygon,
    },
    {
      id: '2',
      name: 'Robots',
      type: 'Subscription',
      amount: '- $24.00',
      date: '12 Sept 2019',
      icon: AppImages.Music,
    },
    {
      id: '3',
      name: 'Youtube Ads.',
      type: 'Income',
      amount: '+ $32.00',
      date: '10 Sept 2019',
      icon: AppImages.Youtube,
    },
    {
      id: '4',
      name: 'Freelance Work',
      type: 'Income',
      amount: '+ $421.00',
      date: '06 Sept 2019',
      icon: AppImages.Bag,
    },
  ];

  const fixedData = [];

  const renderItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View
        style={{
          backgroundColor: AppColors.backwhite,
          padding: 3,
          borderRadius: 10,
        }}>
        <Image source={AppImages.Polygon} style={styles.icon} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{item.w_contract_type}</Text>
        <Text style={styles.transactionType}>{item.ne_duration}</Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.amountPositive}>{`${item.ne_amount}`}</Text>
        <Text style={styles.transactionDate}>
          {item.ne_date?.split('T')[0]}
        </Text>
      </View>
    </View>
  );

  const currentData = isFlexibleMode ? flexibleData : fixedData;

  useEffect(() => {
    console.log('API Data: ', apiData.data);
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
      console.log('API Response:', response.data);
      if (response.data.result) {
        setApiData({
          balance: response.data.balance,
          profit: response.data.profit,
          data: response.data.data,
        });
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  const handlePlanSelect = plan => {
    setSelectedPlan(plan);
  };
  const getPlanButtonStyles = duration => {
    if (duration === 'sixMonth') {
      return [styles.planButton, {backgroundColor: 'yellow'}]; // Apply yellow color for 6 Month plan
    }
    if (duration === 'oneYear') {
      return [styles.planButton, {backgroundColor: 'yellow'}]; // Apply yellow color for 1 Year plan
    }
    return [styles.planButton];
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
          <ImageBackground
            source={AppImages.Withdrawimg}
            style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <Text style={styles.balanceText}>{t('Balance')}</Text>
              {/* <Text
                style={styles.dateText}>{`Profit: $${apiData.profit}`}</Text> */}
              <Text style={styles.amountText}>
                {/* {convertedbalancePrice} {currency} */}
                {apiData?.balance} AED
              </Text>
              <Text style={styles.changeText}>
                {t('up by')} 2% {t('from last month')}
              </Text>
              <Text style={styles.futurePlanTitle}>
                {t('Select Your Future Plan')}
              </Text>
              <View style={styles.planButtonsContainer}>
                <View style={getPlanButtonStyles(item => item.ne_duration)}>
                  <View style={styles.planButtonRow}>
                    <View>
                      <Text style={styles.planButtonText}>6 {t('Month')}</Text>
                      <Text style={styles.returnText}>1% {t('Return')}</Text>
                      <Text style={styles.returnText}>{t('Active')}</Text>
                    </View>
                    <Image
                      source={AppImages.GraphGreen}
                      style={styles.planImage}
                    />
                  </View>
                </View>
                <View style={[styles.planButton, styles.inactiveButton]}>
                  <View style={styles.planButtonRow}>
                    <View>
                      <Text style={styles.planButtonText}>1 {t('Year')}</Text>
                      <Text style={styles.returnText}>2% {t('Return')}</Text>
                      <Text style={styles.returnText}>{t('Inactive')}</Text>
                    </View>
                    <Image
                      source={AppImages.GraphGreen}
                      style={styles.planImage}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setIsFlexibleMode(true)}>
              <Text style={[styles.tab, isFlexibleMode && styles.activeTab]}>
                {t('Future Plan In')}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => setIsFlexibleMode(false)}>
              <Text style={[styles.tab, !isFlexibleMode && styles.activeTab]}>
                Future Plan Out
              </Text>
            </TouchableOpacity> */}
          </View>
          {apiData && apiData?.data && apiData?.data?.length > 0 ? (
            <FlatList
              data={apiData.data}
              keyExtractor={item => item.ne_id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Image source={AppImages.Warning} style={styles.noDataImage} />
              <Text style={styles.noDataText}>{t('No Active Contract')}</Text>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('DashBoardStack')}>
            <Text style={styles.withdrawButtonText}>{t('Go Back Home')}</Text>
          </TouchableOpacity>
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
    // paddingBottom: 20,
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
    marginHorizontal: 10,
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    color: '#AAAAAA',
    fontWeight: 'bold',
    marginRight: 20,
    fontFamily: 'serif',
  },
  activeTab: {
    color: 'blue',
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    backgroundColor: AppColors.Yellow,
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
    marginLeft: 10,
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

export default Nest_EggLast;
