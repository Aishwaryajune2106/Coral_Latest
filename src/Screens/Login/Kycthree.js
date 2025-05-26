import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CountryContext from '../../Context/CountryContext';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const Kycthree = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {backImage, setBackImage, verificationMethod} =
    useContext(CountryContext);
  console.log(backImage, 'backImage');

  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [showAlert, setShowAlert] = useState(false);
  const handleUpload = () => {
    pickImage('gallery'); // Directly trigger gallery upload
  };

  const pickImage = type => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const imageHandler = response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const image = {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName ?? `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
        setBackImage(image);
      } else {
        console.warn('Unexpected image response:', response);
      }
    };

    // Only gallery usage now
    launchImageLibrary(options, imageHandler);
  };

  const handleSubmit = () => {
    if (!backImage) {
      setShowAlert(true); // Show the custom alert if the back image is missing
      return;
    }
    if (!isChecked) {
      setShowAlert(true); // Show the custom alert if checkbox is not checked
      return;
    }
    navigation.navigate('PhotocardScreen');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      {/* Header */}
      {/* <View style={styles.header}>
   
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={AppImages.greaterarrow} // Replace with the correct image path
            style={styles.backArrowImage}
          />
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={styles.headerTitle}>KYC</Text>
        </View>
      </View> */}

      {/* Title */}
      <Text style={styles.title}>{t('National ID')}</Text>
      <View style={styles.progressBar}>
        <View style={styles.activeProgress} />
      </View>

      {/* Upload Section */}
      <View
        style={{
          borderWidth: 1,
          borderColor: AppColors.Grey,
          padding: 20,
          borderRadius: 10,
          backgroundColor: AppColors.white,
          shadowColor: AppColors.Black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Text style={styles.sectionTitle}>
          {t('National Identity Card (Back)')}
        </Text>
        <Text style={styles.description}>
          {t(
            'Please upload your National Identity card below for completing your first step of KYC',
          )}
        </Text>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholderTextColor={AppColors.darkgrey}
          placeholder={verificationMethod}
          editable={false}
        />

        {/* Upload Button */}
        <View
          style={{
            borderWidth: 1,
            borderColor: AppColors.Grey,
            padding: 20,
            borderRadius: 10,
            backgroundColor: AppColors.white,
            shadowColor: AppColors.Black,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
            <Text style={styles.description}>
              {t('Upload National Identity card back photo')}
            </Text>
            <Text style={styles.uploadButton}>{t('Upload')}</Text>
            {/* <Text style={styles.uploadButton}>{t('Take Photo')}</Text> */}
          </TouchableOpacity>

          {/* Note */}
          <Text style={styles.note}>
            *{t('Only PDF and JPEG files are accepted')} *
          </Text>

          {backImage && (
            <>
              {/* Show image path */}
              <Text style={styles.imagePath}>{backImage.name}</Text>
            </>
          )}
          {/* Declaration and Checkbox */}
          <View style={styles.declarationContainer}>
            <BouncyCheckbox
              isChecked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
              size={25} // Adjust size as needed
              fillColor={AppColors.miniblue} // You can set your desired color
              unfillColor={AppColors.white}
            />
            <Text style={styles.declarationText}>
              {t(
                'I hereby agree that the above document belongs to me and voluntarily give my consent to Coral Wealth (CWi) to utilize it as my address proof for KYC purposes only',
              )}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>{t('Submit')}</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <Text style={styles.footer}>
        {t(
          'If you are facing any difficulties, please get in touch with us on',
        )}{' '}
        <Text style={styles.whatsapp}>operations@coraluae.com</Text>
      </Text>

      {/* Custom Alert */}
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)} // Close the alert
        title="Error"
        message={
          isChecked
            ? 'Please upload your National Identity card back photo.'
            : 'Please fill declaration.'
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.miniblue,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.OffWhite,
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activeProgress: {
    height: '100%',
    width: '49%',
    backgroundColor: AppColors.miniblue,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: AppColors.Black,
  },
  description: {
    fontSize: 14,
    color: AppColors.darkgrey,
    marginBottom: 20,
    marginTop: 5,
  },

  inputtitle: {
    fontSize: 14,
    color: AppColors.darkgrey,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
    color: AppColors.Black,
  },
  uploadBox: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    backgroundColor: AppColors.darkgrey,
    padding: 10,
    borderRadius: 10,
  },
  note: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: AppColors.miniblue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: AppColors.darkgrey,
  },
  whatsapp: {
    color: AppColors.miniblue,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  imagePath: {
    textAlign: 'center',
    fontSize: 12,
    color: AppColors.Grey,
    marginTop: 5,
  },
  declarationContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  declarationText: {
    fontSize: 11,
    color: AppColors.Black,
    flexWrap: 'wrap',
    right: '90%',
    marginHorizontal: 20,
  },
});

export default Kycthree;
