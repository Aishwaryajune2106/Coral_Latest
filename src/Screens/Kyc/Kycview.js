import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import AppImages from '../../Constants/AppImages';

const Kycview = () => {
  const {backImage, frontImage, selectedCountry} = useContext(CountryContext);
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
        console.log('KYC Data:', data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = side => {
    // Replace this with navigation or image picker
    console.log(`Edit ${side} image clicked`);
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
      {/* UK Front Image */}
      {kycData?.uk_front && (
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: `https://coral.lunarsenterprises.com/${kycData.uk_front}`,
            }}
            style={styles.kycImage}
          />
          {/* Show Edit button only if rejected */}
          {kycData?.uk_reject_message && (
            <TouchableOpacity
              style={styles.editButton}
              // onPress={() => handleEditImage('front')}
            >
              <Image source={AppImages.Edit} style={styles.editIcon} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* UK Back Image */}
      {kycData?.uk_back && (
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: `https://coral.lunarsenterprises.com/${kycData.uk_back}`,
            }}
            style={styles.kycImage}
          />
          {kycData?.uk_reject_message && (
            <TouchableOpacity
              style={styles.editButton}
              // onPress={() => handleEditImage('front')}
            >
              <Image source={AppImages.Edit} style={styles.editIcon} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Card Info */}
      <View style={{marginHorizontal: 20, marginVertical: 10}}>
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
        {/* Show reject message if present */}
      </View>
      {kycData?.uk_reject_message && (
        <View style={styles.rejectBox}>
          <Text style={styles.rejectText}>
            Rejected your KYC due to : {kycData.uk_reject_message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Kycview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
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
  imageWrapper: {
    position: 'relative',
    marginHorizontal: 20,
  },
  editButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,

    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectBox: {
    backgroundColor: '#FFCCCC',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  rejectText: {
    color: '#D8000C',
    fontSize: 14,
    fontWeight: '500',
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
});
