import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import {TouchableOpacity} from 'react-native';
import CountryContext from '../../Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';

const Kycview = () => {
  const {backImage, frontImage, selectedCountry} = useContext(CountryContext);
  console.log(backImage, frontImage, selectedCountry, 'data');
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/kyc',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
        },
      );

      const data = await response.json();
      if (data.result) {
        setKycData(data.data[0]); // Assuming only one entry
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={AppColors.Blue}
        style={styles.loader}
      />
    );
  }

  return (
    <View style={styles.container}>
      {kycData?.uk_front && (
        <Image
          source={{
            uri: `https://coral.lunarsenterprises.com/${kycData.uk_front}`,
          }}
          style={styles.kycImage}
        />
      )}
      {kycData?.uk_back && (
        <Image
          source={{
            uri: `https://coral.lunarsenterprises.com/${kycData.uk_back}`,
          }}
          style={styles.kycImage}
        />
      )}
      <View style={{marginHorizontal: 20, marginVertical: 30}}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.leftSection}>
            <View style={styles.textContainer}>
              <Text style={styles.subCompany}>Proof ID</Text>
              <Text style={styles.projectName}>
                {kycData?.uk_id_type || 'N/A'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Kycview;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColors.white,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: AppColors.backwhite,

    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'serif',
  },
  subCompany: {
    fontSize: 13,
    color: AppColors.perfectgrey,
    fontFamily: 'serif',
    marginLeft: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});
