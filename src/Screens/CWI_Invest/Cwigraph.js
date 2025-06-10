import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {LineChart} from 'react-native-chart-kit';
import AppImages from '../../Constants/AppImages'; // Ensure you have local image references
import AppColors from '../../Constants/AppColors'; // Ensure you have a defined color palette
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Cwigraph = ({navigation, route}) => {
  const screenWidth = Dimensions?.get('window').width;
  const {investmentId} = route.params;

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('investmentId:', investmentId);

  useEffect(() => {
    fetchIndustryGrowth();
  }, []);

  const fetchIndustryGrowth = async () => {
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/industry-growth',
        {
          industry_id: investmentId,
        },
        {
          headers: {
            user_id: await AsyncStorage.getItem(AppStrings.USER_ID),
          },
        },
      );
      console.log('API Response:', response.data);

      if (response.data.result) {
        const apiData = response?.data?.data?.map(item => ({
          ci_industry: item.ig_year.toString(),
          ri_return_year: item.ig_growths.toString(),
        }));
        setChartData(apiData);
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={AppImages.Leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Current Investment</Text>

        {/* <View style={styles.searchBar}>
          <View style={styles.leftSection}>
            <Image source={AppImages.Future} style={styles.roundImage} />
            <View style={styles.textContainer}>
              <Text style={styles.projectName}>Demo Project</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.totalAmount}>$100K</Text>
            <Text style={styles.investedAmount}>5 yr</Text>
          </View>
        </View> */}
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View style={{marginTop: 50}}>
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator color="#4CAF50" size="large" />
            ) : chartData.length > 0 ? (
              <LineChart
                data={{
                  labels: chartData.map(item => item.ci_industry),
                  datasets: [
                    {
                      data: chartData.map(item =>
                        parseFloat(item.ri_return_year),
                      ),
                    },
                  ],
                }}
                width={screenWidth - 60}
                height={280}
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
                    textAnchor: 'start',
                    dx: -10,
                  },
                }}
                bezier
                style={{
                  borderRadius: 8,
                  marginVertical: 10,
                  alignSelf: 'flex-start',
                }}
              />
            ) : (
              <Text style={{textAlign: 'center'}}>No data available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Cwigraph;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {
    height: 220,
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  backButton: {position: 'absolute', top: 40, left: 15, zIndex: 1},
  backIcon: {width: 24, height: 24, tintColor: '#fff'},
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {flexDirection: 'row', alignItems: 'center'},
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    tintColor: '#768CFE',
  },
  textContainer: {flexDirection: 'column'},
  projectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.white,
    fontFamily: 'serif',
  },
  rightSection: {alignItems: 'flex-end'},
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  investedAmount: {fontSize: 12, color: AppColors.white},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 6,
    elevation: 1,
  },
  newsHeadline: {
    fontSize: 14,
    color: '#444',
  },
});
