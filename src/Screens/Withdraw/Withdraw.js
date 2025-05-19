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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';

const {width} = Dimensions.get('window');

// Data for Flexible Mode

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

// Data for Fixed Mode
const fixedData = [];

const Withdraw = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [investHistory, setInvestHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    fetchWithdrawHistory();
  }, []);

  const fetchWithdrawHistory = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/withdraw/history',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id,
          },
          body: JSON.stringify({format: 'excel'}),
        },
      );

      const data = await response.json();
      if (data.result) {
        setWithdrawHistory(data.withdrawhistory);
        setInvestHistory(data.investhistory);
        setTotalAmount(data.total_amount);
        setDownloadLink(data.file);
        convertToUserCurrency(data.total_amount);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(totalAmount, 'totalAmount');
  console.log(withdrawHistory, 'withdrawHistory');
  console.log(investHistory, 'investHistory');

  const renderItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View
        style={{
          backgroundColor: AppColors.backwhite,
          padding: 3,
          borderRadius: 10,
        }}>
        <Image source={AppImages.Bag} style={styles.icon} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>
          {item.ui_project_name || 'Investment'}
        </Text>
        <Text style={styles.transactionType}>{item.ui_type}</Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.amountPositive}>{item.ui_amount}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.ui_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [userCurrency, setUserCurrency] = useState('');

  // Fetch exchange rate and convert amount
  const convertToUserCurrency = async amountInAed => {
    const sourceCurrency = await AsyncStorage.getItem('userCurrency');
    setUserCurrency(sourceCurrency || 'AED');

    if (!sourceCurrency || sourceCurrency === 'AED') {
      setConvertedAmount(amountInAed);
      return;
    }

    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/AED',
      );
      const data = await response.json();
      const rate = data.rates[sourceCurrency];

      if (rate) {
        const converted = amountInAed * rate;
        setConvertedAmount(converted.toFixed(2)); // Round to 2 decimals
      } else {
        console.warn(`Rate for ${sourceCurrency} not found.`);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
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
              <Text style={styles.balanceText}>Total Balance</Text>
              {convertedAmount && userCurrency !== 'AED' && (
                <Text style={styles.amountText}>
                  {/* {convertedbalancePrice} {currency} */}
                  {convertedAmount} {userCurrency}
                </Text>
              )}
            </View>
          </ImageBackground>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <Text style={styles.tab}>Withdraw History</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={AppColors.NavyBlue} />
          ) : withdrawHistory?.length > 0 ? (
            <FlatList
              data={withdrawHistory} // ✅ Use withdrawHistory instead of investHistory
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainer}>
                    <Image source={AppImages.Bag} style={styles.icon} />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName}>
                      {item.b_name || 'Bank'}
                    </Text>
                    <Text style={styles.transactionType}>{item.wr_status}</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.amountPositive}>{item.wr_amount}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(item.wr_date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Image source={AppImages.Warning} style={styles.noDataImage} />
              <Text style={styles.noDataText}>No Active Contract</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {downloadLink && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() =>
              navigation.navigate('DownloadScreen', {url: downloadLink})
            }>
            {/* <Text style={styles.downloadButtonText}>Download Report</Text> */}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() =>
            navigation.navigate('Withdrawamount', {totalAmount: totalAmount})
          }>
          <Text style={styles.withdrawButtonText}>WITHDRAW</Text>
        </TouchableOpacity>
      </View>
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
    color: '#000',
    fontFamily: 'serif',
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
    height: '100%',
    marginHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    color: AppColors.NavyBlue,
    fontWeight: '600',
    marginRight: 20,
    // marginTop:20,
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
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'serif',
  },
});

export default Withdraw;
