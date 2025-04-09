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
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const InvestReturnIndividual = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const {chartData, returnAmount, percentageReturn} = route.params; // Accessing the passed chartData

  console.log(returnAmount, percentageReturn);

  const {
    investmentAmount,
    setInvestmentAmount,
    duration,
    setDuration,
    formattedDuration,
    profitModal,
    setProfitModal,
    withdrawalFrequency,
    setWithdrawalFrequency,
    selectedCiIndustry,
    setSelectedCiIndustry,
  } = useContext(CountryContext);

  const [loading, setLoading] = useState(false);
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

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Investstep3IndividualScreen');
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
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
              <Text style={styles.colorBlockGreen}>⬤</Text> {t('Investment Amount')} :
              {investmentAmount}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockBlue}>⬤</Text> {t('End Date')} :{' '}
              {formattedDuration}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockOrange}>⬤</Text> {t('Investment Mode')} :
              Any
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.colorBlockPurple}>⬤</Text>  {t('Profit Modal')} :{' '}
              {profitModal}({withdrawalFrequency})
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue} // Trigger the handler on button press
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color={AppColors.bordergreen} /> // Display loader when loading
          ) : (
            <Text style={styles.continueButtonText}>{t('CONTINUE')}</Text> // Default button text
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InvestReturnIndividual;

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
});
