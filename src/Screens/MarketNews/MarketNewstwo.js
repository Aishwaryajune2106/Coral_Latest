import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import {LineChart} from 'react-native-chart-kit';
import axios from 'axios';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';

const MarketNewstwo = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {id, name, ri_amount_from, ri_amount_to, ri_return_year} = route.params;
  console.log(
    id,
    name,
    ri_amount_from,
    ri_amount_to,
    ri_return_year,
    'helooooo this is me',
  );

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {selectedCiIndustry, setSelectedCiIndustry} =
    useContext(CountryContext);
  const screenWidth = Dimensions.get('window').width;

  //................News Api...................//

  useEffect(() => {
    const fetchMarketNews = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/news/api',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.result) {
          setNewsData(response.data.data);
        } else {
          setError('Failed to retrieve data.');
        }
      } catch (error) {
        setError('Error fetching news.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketNews();
  }, []);
  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening link:', err),
    );
  };
  //................Project List...................//

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/project/list',
        );

        if (response.data.result && response.data.data) {
          setChartData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/project/list',
          {},
        );
        if (response?.data?.result) {
          const apiData = response?.data?.data?.map((item, index) => ({
            id: index.toString(),
            name: item.ci_industry,
            ri_amount_from: item.ri_amount_from,
            ri_amount_to: item.ri_amount_to,
            ri_return_year: item.ri_return_year,
          }));
          setData(apiData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchIndustries();
  }, []);
  useEffect(() => {
    if (chartData?.length > 0) {
      console.log(
        'Chart Data Processed:',
        chartData?.map(item => ({
          label: item.ci_industry,
          value: parseFloat(item.ri_return_year),
        })),
      );
    }
  }, [chartData]);

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
        <Text style={styles.headerText}>{t('Market News / Insight')}</Text>

        <View style={styles.searchBar}>
          <View style={styles.leftSection}>
            <Image source={AppImages.Future} style={styles.roundImage} />
            <View style={styles.textContainer}>
              <Text style={styles.projectName}>{name}</Text>
              {/* <Text style={styles.subCompany}>Coral</Text> */}
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.totalAmount}>{ri_amount_to}</Text>
            <Text style={styles.investedAmount}>{ri_return_year} yr</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View style={{marginTop: 50}}>
          {/* Chart Section */}
          <View style={styles.card}>
            {chartData?.length > 0 ? (
              <LineChart
                data={{
                  labels: chartData?.map(item => item.ci_industry || 'Unknown'),
                  datasets: [
                    {
                      data: chartData?.map(item =>
                        item.ri_return_year
                          ? parseFloat(item.ri_return_year)
                          : 0,
                      ),
                    },
                  ],
                }}
                width={screenWidth - 60}
                height={280}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#4CAF50',
                  },
                  propsForLabels: {
                    fontSize: 10,
                    rotation: 45,
                    textAnchor: 'start', // Align labels to start (left)
                    dx: -10, // Adjust spacing to shift labels to the left
                  },
                }}
                bezier
                style={{
                  borderRadius: 8,
                  marginVertical: 10,
                  paddingBottom: 10,
                  alignSelf: 'flex-start', // Align chart to the left
                }}
              />
            ) : (
              <Text style={{textAlign: 'center', padding: 20}}>
                No data available
              </Text>
            )}
          </View>

          <View style={{marginHorizontal: 30, marginVertical: 10}}>
            <Text style={styles.newsTitle}>Headlines</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#4CAF50"
              style={{marginTop: 20}}
            />
          ) : newsData?.length > 0 ? (
            newsData?.map((newsItem, index) => (
              <TouchableOpacity
                key={index}
                style={styles.newsContainer}
                onPress={() => openLink(newsItem.link)}>
                <Text style={styles.newsHeadline}>{newsItem.headline}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{textAlign: 'center', padding: 20}}>
              No news available
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 220, // Increased height
    position: 'relative',
    borderBottomLeftRadius: 30, // Keep bottom radius
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Ensures the image stays within the radius
  },

  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    position: 'absolute',
    top: '60%',
    left: 15,
    right: 15,
    backgroundColor: AppColors.NavyBlue,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Spread elements properly
    alignItems: 'center', // Align items vertically
  },

  listContainer: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'stretch',
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    tintColor: '#768CFE',
  },
  textContainer: {
    flexDirection: 'column',
  },
  projectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.white,
    fontFamily: 'serif',
  },
  subCompany: {
    fontSize: 12,
    color: AppColors.white,
    fontFamily: 'serif',
    marginLeft: 5,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.white,
    fontFamily: 'serif',
  },
  investedAmount: {
    fontSize: 12,
    color: AppColors.white,
    marginTop: 5,
    fontFamily: 'serif',
  },
  withdrawnAmount: {
    fontSize: 14,
    color: 'red',
    marginTop: 2,
    fontFamily: 'serif',
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
  chartStyle: {
    marginTop: 10,
    borderRadius: 8,
  },
  newsContainer: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'serif',
    marginTop: 10,
  },
  newsText: {
    fontSize: 12,
    color: '#555',
    marginTop: 10,
    fontFamily: 'serif',
    marginLeft: 15,
  },
  newsItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  newsHeadline: {fontSize: 16, color: 'blue', textDecorationLine: 'underline'},
});

export default MarketNewstwo;
