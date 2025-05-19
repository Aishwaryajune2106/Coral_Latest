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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Future = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalInvestment();
  }, []);

  const fetchTotalInvestment = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    const userCurrency = await AsyncStorage.getItem('userCurrency'); // e.g., "INR", "USD"
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/lock/period/list',
        {
          method: 'POST',
          headers: {
            user_id: user_id,
          },
        },
      );

      const data = await response.json();
      if (data.result) {
        const amountInAed = data.total;

        // Fetch conversion rate
        const rateResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/AED',
        );
        const rateData = await rateResponse.json();

        const conversionRate = rateData.rates[userCurrency];

        if (conversionRate) {
          const convertedAmount = (amountInAed * conversionRate).toFixed(2);
          setTotalInvestment(`${convertedAmount} ${userCurrency}`);
        } else {
          console.warn('Currency not supported:', userCurrency);
          setTotalInvestment(`${amountInAed} AED`);
        }
      }
    } catch (error) {
      console.error(
        'Error fetching total investment or converting currency:',
        error,
      );
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
          {/* Header Background */}
          <ImageBackground
            source={AppImages.Withdrawimg}
            style={styles.headerBackground}>
            <View style={styles.headerContent}>
              <Text style={styles.balanceText}>{t('Invested Amount')}</Text>
              {/* <Text style={styles.dateText}>Today, 08 Sept 2019</Text> */}
              <Text style={styles.amountText}>
                {/* {convertedbalancePrice}{" "}{currency} */}
                {convertedbalancePrice} {currency}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View>
            {/* Text above the button */}
            <Text style={styles.investLabel}>
              Lock Current ROI upto 3 Months and then enjoy invest
            </Text>

            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('FutureStep1Screen')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* Plus icon */}
                <Text style={styles.plusIcon}>+</Text>

                {/* Button text */}
                <Text style={styles.withdrawButtonText}>
                  {t('Start to Invest')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
    fontFamily: 'serif',
    color: '#000',
    fontSize: 20,
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
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginVertical: 2,
    fontFamily: 'serif',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'serif',
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    padding: 20,
    height: '50%',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    color: '#AAAAAA',
    fontWeight: '600',
    marginRight: 20,
    fontFamily: 'serif',
  },
  activeTab: {
    color: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
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
    alignSelf: 'center',
    marginTop: 70,
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    fontFamily: 'serif',
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginRight: 10,
  },
  investLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.Blue,
    marginTop: 50,
    // marginBottom: 10,
    textAlign: 'center',
  },
});

export default Future;
