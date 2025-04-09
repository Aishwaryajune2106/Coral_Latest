import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

export default function Dashboard({navigation}) {
  const {t, i18n} = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const customWidth = screenWidth * 0.9;
  const [duration, setDuration] = useState('12 months');
  const [isOpen, setIsOpen] = useState(false);
  const [hgfData, setHgfData] = useState([]);
  const [datahome, setDatahome] = useState('');
  const [hgfDatacurrency, setHgfDatacurrency] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);

  const [usdRate, setUsdRate] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Make the API call to fetch exchange rate
    axios
      .get('https://api.exchangerate-api.com/v4/latest/AED')
      .then(response => {
        // Extract the USD exchange rate from the response data
        const rate = response.data.rates;
        setUsdRate(rate);
      })
      .catch(error => {
        // Handle error
        setError('Failed to fetch exchange rate');
        console.error(error);
      });
  }, []);
  console.log(usdRate, 'usdRate');

  const [items, setItems] = useState([
    {label: 'Month', value: '1 month'},
    {label: '3 Month', value: '3 months'},
    {label: '6 Month', value: '6 months'},
    {label: '12 Month', value: '12 months'},
  ]);

  const data = [
    {
      id: '1',
      logo: AppImages.Correctlogo,
      fundName: 'Motilal Oswal Fund',
      returnValue: '37.99% 3 yr',
    },
    {
      id: '2',
      logo: AppImages.Correctlogo,
      fundName: 'Motilal Oswal Fund',
      returnValue: '37.99% 3 yr',
    },
    {
      id: '3',
      logo: AppImages.Correctlogo,
      fundName: 'Motilal Oswal Fund',
      returnValue: '37.99% 3 yr',
    },
    {
      id: '4',
      logo: AppImages.Correctlogo,
      fundName: 'Motilal Oswal Fund',
      returnValue: '37.99% 3 yr',
    },
    // Add more items as needed
  ];

  useFocusEffect(
    useCallback(() => {
      fetchHgfData();
      Graphapi();
      BalanceList();
    }, [duration]),
  );

  const fetchHgfData = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.get(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/hfs/list',
        {headers: {user_id}},
      );

      if (response.data.result) {
        setDatahome(response.data);
        console.log(response.data, 'home data');

        setHgfData(response.data.data);
        setHgfDatacurrency(response.data.currency);

        // Store the currency used by the user in AsyncStorage
        await AsyncStorage.setItem('userCurrency', response.data.currency);
        console.log(`User currency stored: ${response.data.currency}`);

        // Check if hgfDatacurrency exists in usdRate
        if (usdRate && usdRate.hasOwnProperty(response?.data?.currency)) {
          const currencyRate = usdRate[response?.data?.currency];
          console.log(currencyRate, 'currencyRatessss');

          // Store the currency rate in AsyncStorage
          await AsyncStorage.setItem(
            'userCurrencyRate',
            currencyRate.toString(),
          );

          // Log the currency rate to the console
          console.log(
            `Currency: ${response?.data?.currency}, Rate: ${currencyRate}`,
          );
        } else {
          console.log('Currency not found in usdRate:', response.data.currency);
        }

        console.log(response.data.data, 'hgf');
        console.log(response.data.currency, 'hgf currency');
      } else {
        console.error('Error fetching HGF data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log('share_prices:', datahome?.share_prices);
  console.log('own_shares:', datahome?.own_shares);
  console.log('balanceData:', balanceData);

  const [convertedSharePrice, setConvertedSharePrice] = useState(0);
  const [convertedOwnPrice, setConvertedOwnPrice] = useState(0);
  const [convertedbalancePrice, setConvertedbalancePrice] = useState(0);
  const [currency, setCurrency] = useState('');

  // useFocusEffect(
  //   useCallback(() => {
  //     const loadAll = async () => {
  //       await fetchHgfData();
  //       await BalanceList();
  //       const {convertedSharePrice, convertedOwnPrice, convertedbalancePrice} =
  //         await calculateConvertedPrices();
  //       setConvertedSharePrice(convertedSharePrice);
  //       setConvertedOwnPrice(convertedOwnPrice);
  //       setConvertedbalancePrice(convertedbalancePrice);
  //     };
  //     loadAll();
  //   }, [duration, datahome]), // Add dependencies here
  // );
  // useEffect(() => {
  //   calculateConvertedPrices();
  // }, [datahome]);
  // Function to calculate the wallet balance based on the stored rate
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
  //       const convertedSharePrice = rate * (datahome?.share_prices || 0);
  //       const convertedOwnPrice = rate * (datahome?.own_shares || 0);
  //       const convertedbalancePrice = rate * (balanceData?.u_wallet || 0);

  //       console.log(`Converted Share Price: ${convertedSharePrice}`);
  //       console.log(`Converted Own Price: ${convertedOwnPrice}`);
  //       console.log(`Converted balance Price: ${convertedbalancePrice}`);

  //       return {convertedSharePrice, convertedOwnPrice, convertedbalancePrice};
  //     } else {
  //       console.log('Rate not found in AsyncStorage');
  //       return {
  //         convertedSharePrice: 0,
  //         convertedOwnPrice: 0,
  //         convertedbalancePrice: 0,
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving rate from AsyncStorage:', error);
  //     return {
  //       convertedSharePrice: 0,
  //       convertedOwnPrice: 0,
  //       convertedbalancePrice: 0,
  //     };
  //   }
  // };

  const Graphapi = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/performance',
        {frequency: duration || '12 months'},

        {headers: {user_id}},
      );

      if (response?.data?.result) {
        setPerformanceData(response?.data?.data || []);
      } else {
        console.error(
          'Error fetching performance data:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const BalanceList = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/balance/list',
        {
          headers: {
            user_id: user_id,
          },
        },
      );
      const data = await response.json();
      if (data.result) {
        setBalanceData(data.data[0]);
        console.log(data.data[0], 'hii');
      } else {
        console.error('Failed to fetch data:', data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      console.log('hareeee');
    }
  };
  const pages = {
    [t('Cash In')]: 'Investplan',
    [t('Cash Out')]: 'Withdraw',
    [t('Nest Egg')]: 'NestEggScreen',
    [t('Future Option')]: 'FutureScreen',
    [t('Profit')]: 'ProfitScreen',
    [t('Wallet')]: 'WalletScreen',
  };

  // Check if data populates correctly
  const chartData = performanceData?.map(item => item.return_amount); // Array of values for the chart
  const labels = performanceData?.map(item => item.year.toString()); // Default empty array

  console.log(performanceData, 'perform');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <ImageBackground source={AppImages.Homeimg} style={styles.headerImage}>
        <View style={{paddingHorizontal: 20, top: 20}}>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notify')}>
              <Image source={AppImages.Notify} style={styles.bellIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileScreen')}>
              <Image source={AppImages.Profile} style={styles.profileImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoWrapper}>
            <TouchableOpacity
              style={styles.statusRing}
              onPress={() => navigation.navigate('Statusviewerscreen')}>
              <Image source={AppImages.Correctlogo} style={styles.logo} />
            </TouchableOpacity>
          </View>

          <Text style={styles.balance}>{t('Balance')}</Text>
          <Text style={styles.amount}>
            {/* {convertedbalancePrice} {currency} */}
            {balanceData?.u_wallet} AED
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <View style={styles.titleWithImage}>
                <Image source={AppImages.Wallet} style={styles.infoIcon} />
                <Text style={[styles.infoTitle, {color: AppColors.white}]}>
                  {t('Share Price')}
                </Text>
              </View>
              <Text style={styles.infoValue}>
                {/* {convertedSharePrice} */}
                {datahome?.share_prices}
                </Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.titleWithImage}>
                <Image source={AppImages.Investgraph} style={styles.infoIcon} />
                <Text style={[styles.infoTitle, {color: AppColors.white}]}>
                  {t('Own Shares')}
                </Text>
              </View>
              <Text style={styles.infoValue}>
                {/* {convertedOwnPrice} */}
                {datahome?.own_shares}
                </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* //.......Kyc status...........// */}
      {datahome?.user_kyc === 'pending' && (
        <View style={styles.kyccard}>
          <View style={styles.titleWithImage}>
            <Image source={AppImages.Kyc} style={styles.kycIcon} />
            <Text style={[styles.infoTitle, {color: AppColors.Black}]}>
              {t('KYC Verification is in Review')}
            </Text>
          </View>
          <Text style={styles.kycvalue}>
            {t(
              'KYC Verification is under review. Your Documents are being checked for compliance',
            )}
          </Text>
        </View>
      )}

      <View style={{paddingHorizontal: 20}}>
        {/* HGFs Section */}
        <Text style={styles.sectionTitle}>{t('HGFs')}</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hgfData}
          keyExtractor={item =>
            item.h_id ? item.h_id.toString() : Math.random().toString()
          }
          renderItem={({item}) => (
            <View style={styles.hgfCard}>
              <Image
                source={AppImages.Correctlogo}
                style={{width: 20, height: 20}}
              />
              <Text style={styles.hgfText}>{item.tc_name}</Text>
              <Text style={styles.hgfValue}>
                {item.tc_growth_percentage}% | {t('Growth')}:{' '}
                {item.tc_previous_year}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontSize: 12,
                fontFamily: 'serif',
              }}>
              No HGF Found
            </Text>
          }
          style={styles.hgfScroll}
        />

        {/* Explore Section */}

        <Text style={styles.sectionTitle}>{t('Explore')}</Text>
        <View style={styles.exploreGrid}>
          {Object.keys(pages)?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exploreButton}
              onPress={() => navigation.navigate(pages[item])}>
              <Text style={styles.exploreText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Section */}
        <Text style={styles.sectionTitle}>{t('Performance')}</Text>

        <View style={styles.performance}>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={isOpen}
              value={duration}
              items={items}
              setOpen={setIsOpen}
              setValue={setDuration}
              setItems={setItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select"
              zIndex={1000}
              onChangeValue={value => {
                setDuration(value);
                Graphapi();
              }}
            />
          </View>

          {/* Line Chart Component */}
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: chartData?.length > 0 ? chartData : [0],
                  strokeWidth: 2,
                  color: () => '#93AAFD',
                },
              ],
            }}
            width={customWidth}
            height={320}
            yAxisSuffix="k"
            chartConfig={{
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 0,
              color: () => '#93AAFD', // Line color
              labelColor: () => '#93AAFD', // Axis label color
              propsForDots: {r: '4', strokeWidth: '1', stroke: '#93AAFD'},
              propsForBackgroundLines: {strokeWidth: 0},
            }}
            bezier
            style={styles.lineChart}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerImage: {
    width: '100%',
    height: 320,

    paddingBottom: 16,
    overflow: 'hidden',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  headerIcons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  bellIcon: {
    width: 28,
    height: 28,
    marginRight: 14,
    top: 5,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  statusRing: {
    width: 70, // Increased size for space
    height: 70, // Increased size for space
    borderRadius: 55, // Updated to match the new size
    borderWidth: 3,
    borderColor: AppColors.bordergreen,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5, // Added padding inside the ring
  },
  logo: {
    width: 60, // Maintain logo size
    height: 60,
  },

  balance: {
    fontSize: 16,
    fontFamily: 'serif',
    color: AppColors.white,
    marginTop: 16,
  },
  amount: {
    fontSize: 24,
    fontFamily: 'serif',
    color: AppColors.white,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoCard: {
    flex: 1,

    marginHorizontal: 5,
    padding: 10,
    backgroundColor: AppColors.NavyBlue,
    borderRadius: 8,
    elevation: 2,
  },
  kyccard: {
    flex: 1,
    marginHorizontal: 25,
    marginTop: 20,
    padding: 10,
    backgroundColor: AppColors.kycback,
    borderRadius: 8,
    elevation: 2,
  },
  titleWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  kycIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    resizeMode: 'contain',
  },
  infoTitle: {
    fontSize: 16,

    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '600',
    marginTop: 5,
    color: AppColors.OffWhite,
  },
  kycvalue: {
    fontSize: 13,
    fontFamily: 'serif',

    marginTop: 5,
    color: AppColors.Black,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    marginVertical: 14,
    color: AppColors.Black,
  },
  hgfScroll: {paddingVertical: 8},
  hgfCard: {
    backgroundColor: AppColors.white,
    padding: 10,
    // paddingHorizontal: '8%',
    borderRadius: 8,
    marginRight: 8,
    borderColor: AppColors.violet,
    borderWidth: 1,
  },
  hgfText: {fontSize: 14, color: AppColors.Black, fontFamily: 'serif'},
  hgfValue: {
    fontSize: 12,
    marginTop: 8,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exploreButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    width: '30%',
    marginVertical: 8,
    borderColor: AppColors.violet,
    borderWidth: 1,
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: AppColors.Black,
  },
  performance: {
    paddingVertical: 16,
    backgroundColor: '#FFF',

    borderRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  dropdownWrapper: {
    alignSelf: 'flex-end',
    width: 140,
    opacity: 0.9,
    elevation: 1,
    right: 10,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: AppColors.Yellow,
    borderColor: AppColors.Yellow,
    borderRadius: 8,
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderColor: '#6F47FF',
    borderRadius: 8,
  },
  dropdownTextStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdownListTextStyle: {
    color: '#333333',
    fontSize: 14,
  },
  lineChart: {
    borderRadius: 16,
    marginTop: 16,
  },
});
