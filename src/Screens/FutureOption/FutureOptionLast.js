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
  ActivityIndicator,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const FutureOptionLast = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [isFlexibleMode, setIsFlexibleMode] = useState(true);
  const [futurePlanIn, setFuturePlanIn] = useState([]);
  const [futurePlanOut, setFuturePlanOut] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalInvestment, setTotalInvestment] = useState(0);

  useEffect(() => {
    fetchFuturePlans();
  }, []);

  const fetchFuturePlans = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/lock/period/list',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
          },
        },
      );

      const data = await response.json();

      if (data.result) {
        const activePlans = data?.list?.filter(
          item => item.status === 'active',
        );
        const expiredPlans = data?.list?.filter(
          item => item.status === 'expired',
        );

        setFuturePlanIn(activePlans);
        setFuturePlanOut(expiredPlans);
        setTotalInvestment(data.total);
      }
    } catch (error) {
      console.error('Error fetching future plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const [convertedbalancePrice, setConvertedbalancePrice] = useState(0);
  const [currency, setCurrency] = useState('');
  useEffect(() => {
    if (totalInvestment !== 0) {
      convertInvestmentToUserCurrency();
    }
  }, [totalInvestment]);

  const convertInvestmentToUserCurrency = async () => {
    try {
      const userCurrency = await AsyncStorage.getItem('userCurrency');
      setCurrency(userCurrency);

      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/AED',
      );
      const data = await response.json();

      if (data && data.rates && data.rates[userCurrency]) {
        const rate = data.rates[userCurrency];
        const converted = totalInvestment * rate;
        setConvertedbalancePrice(converted.toFixed(2)); // Limit to 2 decimal places
      } else {
        console.warn('Currency rate not found for:', userCurrency);
      }
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };
  console.log(totalInvestment, 'totalInvestmentttt');

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('FutureOption3', {
          lp_id: item.lp_id,
          lp_u_id: item.lp_u_id,
          lp_percent: item.lp_percent,
          lp_amount: item.lp_amount,
          lp_duration: item.lp_duration,
          lp_project: item.lp_project,
          lp_wf: item.lp_wf,
          lp_return: item.lp_return,
          lp_profit_model: item.lp_profit_model,
          status: item.status,
        })
      }>
      <View style={styles.transactionItem}>
        <Image source={AppImages.Polygon} style={styles.icon} />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.lp_project}</Text>

          <Text
            style={[
              styles.transactionType,
              item.status === 'expired' && {color: 'red'},
            ]}>
            {item.status}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.amountPositive}>{item.lp_amount}</Text>
          <Text style={styles.amountPositive}>ROI :{item.lp_percent}%</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.lp_date).toDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={AppColors.bordergreen}
          style={{marginTop: 20}}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: AppColors.white,
          }}>
          <View style={styles.imgcontainer}>
            <ImageBackground
              source={AppImages.Withdrawimg}
              style={styles.headerBackground}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.headerContent}>
                  <Text style={styles.balanceText}>
                    Planned Investment Amount
                  </Text>
                  {/* <Text style={styles.dateText}>Profit: $0.00</Text> */}
                  <Text style={styles.amountText}>
                    {convertedbalancePrice} {currency}
                  </Text>
                  {/* <Text style={styles.changeText}>
                    up by 2% from last month
                  </Text> */}
                </View>
                <View style={{marginTop: 80, marginRight: 30}}>
                  <Image source={AppImages.Future} style={styles.rightImage} />
                </View>
              </View>
              <View>
                <View>
                  {/* Text above the button */}
                  <Text style={styles.investLabel}>
                    Lock Current ROI upto 3 Months and then enjoy invest
                  </Text>

                  <TouchableOpacity
                    style={styles.withdrawButtons}
                    onPress={() => navigation.navigate('FutureStep1Screen')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.plusIcon}>+</Text>
                      <Text style={styles.withdrawButtonTexts}>
                        {/* {t('Start to New Invest')} */}
                        Lock Now
                      </Text>
                    </View>
                  </TouchableOpacity>
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
                  {t('Future Plan Out')}
                </Text>
              </TouchableOpacity> */}
            </View>

            {futurePlanIn?.length === 0 ? (
              <Text style={styles.noPlanText}>No current plans</Text>
            ) : (
              <FlatList
                data={futurePlanIn}
                keyExtractor={item => item.lp_id.toString()}
                renderItem={renderItem}
              />
            )}
          </View>
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => navigation.navigate('DashBoardStack')}>
        <Text style={styles.backToHomeText}>Back to Home</Text>
      </TouchableOpacity>
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
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: 'bold',
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
    color: AppColors.perfectgrey,
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
    color: AppColors.bordergreen,
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
    color: AppColors.perfectgrey,
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
    color: AppColors.perfectgrey,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },

  withdrawButtons: {
    backgroundColor: AppColors.Yellow,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
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
  investLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.white,
    // marginTop: 50,
    marginBottom: 20,
    textAlign: 'center',
  },
  noPlanText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  backToHomeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: AppColors.Yellow, // Yellow
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FutureOptionLast;
