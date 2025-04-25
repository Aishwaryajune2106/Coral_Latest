import React, {useContext, useEffect, useState} from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CountryContext from '../../Context/CountryContext';
import CustomAlert from '../../Components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CustomModal from '../../Components/CustomModal';
import {useTranslation} from 'react-i18next';

const Yourphoto = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {
    selectedCountry,
    frontImage,
    backImage,
    bankDetails,
    dpiPassword,
    verificationMethod,
  } = useContext(CountryContext);

  // For Date Picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // Log photo details and other values inside useEffect
  useEffect(() => {
    console.log(uploadedImage, dob, 'PHOTO_DETAILS');
    console.log(selectedCountry, verificationMethod, 'COUNTRIES');
    console.log(frontImage.name, 'FRONT_IMAGE');
    console.log(backImage, 'BACK_IMAGE');
    console.log(bankDetails, 'BANK_DETAILS');

    const joinedPassword = dpiPassword.join('');
    console.log(joinedPassword, 'PASSWORD');
  }, [dob, selectedCountry, frontImage, backImage, bankDetails, dpiPassword]);

  console.log(Array.isArray(bankDetails), bankDetails, 'fronntttt');

  const [dob, setDob] = useState(''); // State for DOB
  const [uploadedImage, setUploadedImage] = useState(null); // State for uploaded image
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = () => {
    Alert.alert(
      'Upload Your Photo',
      'Choose an option',
      [
        {text: 'Take Photo', onPress: () => pickImage('camera')},
        {text: 'Upload from Gallery', onPress: () => pickImage('gallery')},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  const pickImage = type => {
    const options = {mediaType: 'photo', quality: 1};

    const imageHandler = response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error:', response.errorMessage);
      } else {
        const {uri, type, fileName, fileSize} = response.assets[0];
        const imageData = {uri, type, name: fileName, size: fileSize};
        setUploadedImage(imageData);
      }
    };

    type === 'camera'
      ? launchCamera(options, imageHandler)
      : launchImageLibrary(options, imageHandler);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDob(date.toLocaleDateString()); // Convert to a readable format (you can adjust the format if necessary)
    hideDatePicker();
  };

  //....................Api for KYC...................//
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log('hii');
    if (!dob) {
      setModalMessage('Please enter your Date of Birth.');
      setModalTitle('Error');
      setShowModal(true);
      setIsSubmitting(false); // Reset loader
      return;
    }

    if (!uploadedImage) {
      setModalMessage('Please upload your photo.');
      setModalTitle('Error');
      setShowModal(true);
      setIsSubmitting(false); // Reset loader
      return;
    }

    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    console.log('hiione');
    if (!user_id) {
      setModalMessage('User ID not found. Please log in again.');
      setModalTitle('Error');
      setShowModal(true);
      setIsSubmitting(false); // Reset loader
      return;
    }
    console.log('hiitwo');
    const joinedPassword = Array.isArray(dpiPassword)
      ? dpiPassword.join('')
      : '';

    // Make sure joinedPassword is valid before submitting KYC
    if (!joinedPassword) {
      setModalMessage('DPI Password is required.');
      setModalTitle('Error');
      setShowModal(true);
      setIsSubmitting(false); // Reset loader
      return;
    }

    const formData = new FormData();
    console.log('hiithree');
    formData.append('id_type', verificationMethod);
    formData.append('verification_type', 'photo');
    formData.append('name_per_bank', bankDetails.nameAsPerBank || '');
    formData.append('account_no', Number(bankDetails.accountNumber) || '');
    formData.append('ifsc_code', bankDetails.ifscCode || '');
    formData.append('swift_code', bankDetails.swiftCode || '');
    formData.append('bank_name', bankDetails.bankName || '');
    formData.append('branch_name', bankDetails.bankBranch || '');
    formData.append('currency', selectedCountry?.currency || '');
    formData.append('wfa_password', Number(joinedPassword) || '');
    formData.append('dob', dob);
    formData.append('country', selectedCountry?.name || '');
    console.log('hii4');

    // Handling frontImage
    if (frontImage) {
      formData.append('front_page', frontImage);
    }

    // Handling backImage
    if (backImage) {
      formData.append('back_page', backImage);
    }

    if (uploadedImage) {
      formData.append('image', uploadedImage);
    }

    // Handling bankDetails image
    if (bankDetails && bankDetails.uploadedStatement) {
      formData.append('bank_file', {
        uri: bankDetails.uploadedStatement.uri,
        name: bankDetails.uploadedStatement.name,
        type: bankDetails.uploadedStatement.type,
      });
    }

    console.log(frontImage?.uri, 'Front Image URI');
    console.log(backImage?.uri, 'Back Image URI');
    console.log(uploadedImage?.uri, 'Uploaded Image URI');
    console.log(bankDetails?.uploadedStatement?.uri, 'Bank Details Image URI');

    console.log(formData, 'formdatarahilll');
    try {
      console.log('hii6');
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/kyc-upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            user_id: user_id,
          },
          body: formData,
        },
      );

      const data = await response.json();
      console.log('hii7');
      if (data.result === true) {
        console.log('hii8');
        setModalMessage(data.message || 'KYC submitted successfully.');
        setModalTitle('Success');
        setShowModal(true);
        setTimeout(() => navigation.navigate('KyccheckScreen'), 3000);
      } else {
        console.log('hii9');
        setModalMessage(data.message || 'Something went wrong.');
        setModalTitle('Error');
        setShowModal(true);
      }
    } catch (error) {
      console.log('hii10');
      console.error('Error submitting KYC:', error);
      setModalMessage('Failed to submit KYC. Please try again later.');
      setModalTitle('Error');
      setShowModal(true);
    } finally {
      setIsSubmitting(false); // Reset loader
    }
  };

  console.log(dob, uploadedImage, 'filedd data');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}>
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
      <Text style={styles.title}>{t('Your Photo')}</Text>
      <View style={styles.progressBar}>
        <View style={styles.activeProgress} />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 20,
          borderRadius: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginTop: 20,
        }}>
        <Text style={styles.inputtitle}>{t('Please Upload Your Photo')}</Text>
        {/* Date of Birth Section */}
        <Text style={styles.inputtitle}>{t('Date of Birth')}</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.input}>
            {dob || t('Select your Date of Birth')}
          </Text>
        </TouchableOpacity>

        {/* DatePicker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={t('date')}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,

            borderRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
            <Text style={styles.description}>{t('Upload your Photo')}</Text>
            <Text style={styles.uploadButton}>{t('Upload')}</Text>
          </TouchableOpacity>

          {uploadedImage && (
            <>
              {/* Show image path */}
              <Text style={styles.imagePath}>{uploadedImage.name}</Text>
            </>
          )}

          {/* Note */}
          <Text style={styles.note}>
            *{t('Only PDF and JPEG files are accepted')}*
          </Text>
        </View>
        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <Text style={styles.submitText}>
            {isSubmitting ? t('Submitting...') : t('Submit')}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          {t(
            'If you are facing any difficulties, please get in touch with us on',
          )}{' '}
          <Text style={styles.whatsapp}>{t('Whatsapp')}</Text>
        </Text>
      </View>

      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title="Error"
        message={t(
          'If you are facing any difficulties, please get in touch with us on',
        )}
      />

      {/* Custom Modal for Success/Error Message */}
      <CustomModal
        visible={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          if (modalTitle === 'Success') {
            navigation.navigate('KyccheckScreen'); 
          }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
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
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activeProgress: {
    height: '100%',
    width: '89%',
    backgroundColor: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: AppColors.Black,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    marginTop: 5,
  },

  inputtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
    color: '#000',
  },
  uploadBox: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  uploadButton: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    backgroundColor: '#4D4D4D',
    padding: 10,
    borderRadius: 10,
  },
  note: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  whatsapp: {
    color: '#3B82F6',
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
    color: '#666',
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
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  digitInput: {
    borderWidth: 1,
    borderColor: '#5856D6',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    width: 50,
    fontSize: 18,
    color: AppColors.Black,
  },
});

export default Yourphoto;
