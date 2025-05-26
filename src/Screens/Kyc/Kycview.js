import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import AppImages from '../../Constants/AppImages';
import {launchImageLibrary} from 'react-native-image-picker';

const Kycview = () => {
  const {backImage, frontImage, selectedCountry} = useContext(CountryContext);
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedFront, setUpdatedFront] = useState(null);
  const [updatedBack, setUpdatedBack] = useState(null);
  const [updatedBank, setUpdatedBank] = useState(null);

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
  //.............Update Api..............//


  const pickImage = async setImageState => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.errorCode) {
        console.log('User cancelled image picker');
        return;
      }

      const selectedAsset = response.assets?.[0];
      if (selectedAsset) {
        setImageState({
          uri: selectedAsset.uri,
          type: selectedAsset.type,
          name: selectedAsset.fileName,
        });
      }
    });
  };
  const handleUpdateKYC = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    const formData = new FormData();

    formData.append('kyc_id', kycData?.uk_id);

    if (updatedFront) {
      formData.append('front_page', updatedFront);
    }
    if (updatedBack) {
      formData.append('back_page', updatedBack);
    }
    if (updatedBank) {
      formData.append('bank_file', updatedBank);
    }

    try {
      const res = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/kyc/re_upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            user_id: userId,
          },
          body: formData,
        },
      );

      const data = await res.json();
      if (data.result) {
        alert(data.message);
        fetchKycData();
        setUpdatedFront(null);
        setUpdatedBack(null);
        setUpdatedBank(null);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
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
              onPress={() => pickImage(setUpdatedFront)}>
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
             onPress={() => pickImage(setUpdatedBack)}>
              <Image source={AppImages.Edit} style={styles.editIcon} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* UK Bank Statement */}
      {kycData?.uk_bank_statement && (
        <View style={[styles.imageWrapper, {alignItems: 'center'}]}>
          <TouchableOpacity
            onPress={() => {
              const url = `https://coral.lunarsenterprises.com${kycData.uk_bank_statement}`;
              Linking.openURL(url);
            }}
            style={styles.pdfContainer}>
            <Image source={AppImages.Pdf} style={styles.pdfIcon} />
            <Text style={styles.pdfText}>View Bank Statement</Text>
          </TouchableOpacity>

          {/* Show Edit if rejected */}
          {kycData?.uk_reject_message && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => pickImage(setUpdatedBank)}>
              <Image source={AppImages.Edit} style={styles.editIcon} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {kycData?.uk_reject_message && (
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          {/* <Text style={{marginBottom: 10, fontWeight: '600'}}>Update KYC</Text> */}
{/* 
          <TouchableOpacity
            style={styles.pickButton}
            onPress={() => pickImage(setUpdatedFront)}>
            <Text>Select Front Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickButton}
            onPress={() => pickImage(setUpdatedBack)}>
            <Text>Select Back Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickButton}
            onPress={() => pickImage(setUpdatedBank)}>
            <Text>Select Bank File</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateKYC}>
            <Text style={{color: '#fff'}}>Update KYC</Text>
          </TouchableOpacity>
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
  pdfContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  pdfIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  pdfText: {
    marginTop: 5,
    fontSize: 14,
    color: AppColors.Blue,
    textDecorationLine: 'underline',
    fontFamily: 'serif',
  },
  updateButton: {
    marginTop: 15,
    backgroundColor: AppColors.Blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  pickButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
