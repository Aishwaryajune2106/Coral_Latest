import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
  ImageBackground,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const FutureStep3Ind = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const {selectedCiIndustry, setSelectedCiIndustry} =
    useContext(CountryContext);
  const {
    chartData,
    returnAmount,
    percentageReturn,
    investmentAmount,
    duration,
    profitModal,
    withdrawalFrequency,
    selectedOptiony,
  } = route.params;

  console.log(
    chartData,
    returnAmount,
    percentageReturn,
    investmentAmount, //amount
    duration,
    profitModal,
    withdrawalFrequency, //wf
    selectedOptiony, //project
    selectedCiIndustry,
    'dataabike',
  ); // Accessing the passed chartData
  const formattedDuration = duration
    ? moment(duration).format('MMMM D, YYYY')
    : 'Unknown';

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(selectedCiIndustry, 'hello');

  console.log('Chart Data:', chartData);

  const data = {
    labels: ['2024', '2025', '2026', '2027', '2028', '2029'],
    datasets: [
      {
        data: [200, 400, 300, 100, 150, 500],
        color: () => AppColors.bordergreen,
        strokeWidth: 2,
      },
    ],
  };

  const handleLockPress = async () => {
    setLoading(true);
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    const requestBody = {
      amount: investmentAmount,
      year: formattedDuration,
      wf: withdrawalFrequency,
      project: selectedCiIndustry,
    };
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/lock/period',
        requestBody,

        {
          headers: {
            user_id: user_id,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(requestBody, 'requestBody');

      if (response.data.result) {
        console.log('API Response:', response.data);
        setModalVisible(true);
      } else {
        alert(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error in API:', error);
      alert('Failed to lock investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setModalVisible(false);
    navigation.navigate('FutureOptionLastScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {' '}
            {t('Track Your Investment Returns')}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {t('Investment End by')} {formattedDuration}
          </Text>
          <Text style={styles.chartPercentage}>{percentageReturn}</Text>
          <LineChart
            data={{
              labels: chartData?.labels || ['No Data'], // Fallback for missing labels
              datasets: chartData?.datasets || [
                {
                  data: [0],
                },
              ],
            }}
            width={Dimensions.get('window').width - 70}
            height={250}
            chartConfig={{
              backgroundColor: AppColors.white,
              backgroundGradientFrom: AppColors.white,
              backgroundGradientTo: AppColors.white,
              decimalPlaces: 0, // No decimal places in data values
              color: () => AppColors.bordergreen, // Line color
              labelColor: () => '#000', // Label color
              style: {
                borderRadius: 16, // Rounded edges for the chart
              },
              propsForDots: {
                r: '4', // Dot radius
                strokeWidth: '2',
                stroke: AppColors.bordergreen,
              },
            }}
            bezier // For smooth curve effect
            style={styles.chart}
          />

          <Text style={styles.chartValue}>{investmentAmount}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <Image source={AppImages.Profit} style={styles.profitIcon} />
          <Text style={styles.profitText}>{t('Estimated Profit Growth')}</Text>
          <Text style={styles.profitValue}>
            {returnAmount}({percentageReturn})
          </Text>
          <View style={styles.detailsList}>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockGreen}>⬤</Text>{' '}
              {t('Investment Amount')} :{investmentAmount}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockBlue}>⬤</Text> {t('End Date')} :{' '}
              {formattedDuration}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockOrange}>⬤</Text>{' '}
              {t('Investment Mode')} : Any
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockPurple}>⬤</Text> {t('Profit Modal')}{' '}
              : {profitModal}({withdrawalFrequency})
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleLockPress}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={AppColors.bordergreen} />
          ) : (
            <View style={styles.imageRow}>
              <Text style={styles.continueButtonText}>{t('Lock')}</Text>
              <Image source={AppImages.Lock} style={styles.lockImage} />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      {/*............. Modal..............*/}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ImageBackground
              source={AppImages.VioletDot}
              style={styles.backgroundImage}
            />
            <Text style={styles.successMessage}>{t('Locked Successful')}!</Text>
            <Text style={styles.successMessage1}>
              {t('Lock Period will be Valid Only For 3 Month')}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
              <Text style={styles.buttonText}>
                {t('Back to Future Option')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FutureStep3Ind;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backwhite,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  chartContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.Black,
  },
  chartPercentage: {
    fontSize: 14,
    fontFamily: 'serif',
    color: AppColors.bordergreen,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartValue: {
    fontSize: 14,
    color: AppColors.Black,
    fontFamily: 'serif',
    textAlign: 'right',
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profitIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  profitText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.bordergreen,
    fontFamily: 'serif',
    marginBottom: 5,
  },
  profitValue: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: AppColors.bordergreen,
    marginBottom: 15,
  },
  detailsList: {
    alignItems: 'flex-start',
  },
  detailItem: {
    fontSize: 16,
    fontFamily: 'serif',
    color: AppColors.Black,
    marginBottom: 5,
  },
  colorBlockGreen: {color: AppColors.bordergreen},
  colorBlockBlue: {color: AppColors.buttonblue},
  colorBlockOrange: {color: AppColors.orange},
  colorBlockPurple: {color: AppColors.magenta},
  continueButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  lockContainer: {
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lockImage: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 350, // Increase width
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 30, // Increase padding for more spacing
  },
  backgroundImage: {
    width: 150,
    height: 150, // Slightly increase height for better proportions
    marginBottom: 25, // Adjust spacing
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6BCFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage1: {
    fontSize: 13,
    color: AppColors.red,
    marginBottom: 25,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 12, // Increase button padding
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18, // Increase font size
    color: 'white',
    fontWeight: 'bold',
  },
});
