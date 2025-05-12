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

import DocumentPicker from 'react-native-document-picker';

import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CountryContext from '../../Context/CountryContext';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const Bankkycone = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {bankDetails, setBankDetails} = useContext(CountryContext);
  console.log(bankDetails, 'bankDetails');

  const [localDetails, setLocalDetails] = useState(bankDetails);
  const [nameAsPerBank, setNameAsPerBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [showAlert, setShowAlert] = useState(false); // for showing/hiding the alert
  const [alertMessage, setAlertMessage] = useState(''); // for storing the alert message

  const [fileUri, setFileUri] = useState('');
  console.log(selectedFile, 'selectedfile');

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      const file = res[0];
      const fileType = file.type;

      if (['application/pdf', 'image/jpeg'].includes(fileType)) {
        // If file is valid, store URI, name, size, and type
        const updatedFileDetails = {
          uri: file.uri,
          name: file.name,
          size: file.size,
          type: fileType,
        };

        setSelectedFile(updatedFileDetails);

        // Update the local details and sync with the context
        const updatedDetails = {
          ...localDetails,
          uploadedStatement: updatedFileDetails,
        };
        setLocalDetails(updatedDetails);
        setBankDetails(updatedDetails); // Sync with context

        setAlertMessage('Bank statement uploaded successfully!');
        setShowAlert(true); // Show the alert
      } else {
        setAlertMessage('Please select a valid PDF or JPEG file.');
        setShowAlert(true);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        setAlertMessage('Failed to upload file. Please try again.');
        setShowAlert(true);
      }
    }
  };

  const handleChange = (field, value) => {
    const updatedDetails = {...localDetails, [field]: value};
    setLocalDetails(updatedDetails);
    setBankDetails(updatedDetails); // Sync with context
  };

  const handleSubmit = () => {
    // Validation for required fields (other than Swift Code and uploaded statement)
    if (!localDetails.nameAsPerBank) {
      setAlertMessage('Please enter your Name as per Bank.');
      setShowAlert(true);
      return;
    }

    if (!localDetails.accountNumber) {
      setAlertMessage('Please enter your Account Number.');
      setShowAlert(true);
      return;
    }

    if (localDetails.accountNumber !== confirmAccountNumber) {
      setAlertMessage('Account numbers do not match.');
      setShowAlert(true);
      return;
    }

    if (!localDetails.bankName) {
      setAlertMessage('Please enter your Bank Name.');
      setShowAlert(true);
      return;
    }
    if (!localDetails.bankBranch) {
      setAlertMessage('Please enter your Bank Branch.'); // Bank Branch validation
      setShowAlert(true);
      return;
    }
    if (!localDetails.ifscCode) {
      setAlertMessage('Please enter the IFSC/IBAN/Routing Number.');
      setShowAlert(true);
      return;
    }

    // Bank statement is mandatory and must be uploaded
    if (!localDetails.uploadedStatement) {
      setAlertMessage('Please upload your bank statement.');
      setShowAlert(true);
      return;
    }

    // If all validation passed, navigate to the next screen
    setAlertMessage('Details submitted successfully!');
    setShowAlert(true);

    // Ensure navigation happens after all checks
    navigation.navigate('WfaScreen'); // Navigate to the next screen only if everything is validated
  };

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
      <Text style={styles.title}>{t('Bank Account Details')}</Text>
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
        <Text style={styles.description}>
          {t(
            'Please enter your bank account details with which you are going to make payment for investment',
          )}
        </Text>

        <Text style={styles.inputtitle}>*{t('Name as per Bank Account')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={localDetails.nameAsPerBank}
          onChangeText={value =>
            handleChange('nameAsPerBank', value.replace(/[^a-zA-Z ]/g, ''))
          }
        />

        <Text style={styles.inputtitle}>*{t('Account Number')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={localDetails.accountNumber}
          onChangeText={value => handleChange('accountNumber', value)}
          keyboardType="numeric"
          maxLength={20}
        />

        <Text style={styles.inputtitle}>*{t('Confirm Account Number')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={AppColors.darkgrey}
          keyboardType="numeric"
          maxLength={20}
          value={confirmAccountNumber}
          onChangeText={setConfirmAccountNumber}
        />

        <Text style={styles.inputtitle}>*{t('Bank Name')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={AppColors.darkgrey}
          value={localDetails.bankName}
          onChangeText={value =>
            handleChange('bankName', value.replace(/[^a-zA-Z ]/g, ''))
          }
        />
        {/* Bank Branch */}
        <Text style={styles.inputtitle}>*{t('Bank Branch')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={AppColors.darkgrey}
          value={localDetails.bankBranch}
          onChangeText={value =>
            handleChange('bankBranch', value.replace(/[^a-zA-Z ]/g, ''))
          }
        />

        <Text style={styles.inputtitle}>*{t('IFSC/IBAN/Routing Number')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={AppColors.darkgrey}
          value={localDetails.ifscCode}
          onChangeText={value => handleChange('ifscCode', value)}
        />
        <Text style={styles.inputtitle}>*{t('SWIFT Code (Optional)')}*</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor={AppColors.darkgrey}
          value={localDetails.swiftCode}
          onChangeText={value => handleChange('swiftCode', value)}
        />
        {/* Upload Button */}
        <View
          style={{
            borderWidth: 1,
            borderColor: AppColors.Grey,
            padding: 10,

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
              {t('Upload your Bank Statement')}
            </Text>
            <Text style={styles.uploadButton}>{t('Upload')}</Text>
          </TouchableOpacity>

          {/* Display selected file name */}
          {selectedFile && (
            <Text style={styles.imagePath}>
              {t('Selected File')}: {selectedFile.name}
            </Text>
          )}

          {/* Note */}
          <Text style={styles.note}>
            *{t('Only PDF and JPEG files are accepted')} *
          </Text>
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
        )}
        <Text style={styles.whatsapp}>operations@coraluae.com</Text>.
      </Text>
      <CustomAlert
        visible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)} // Close the alert when pressed
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
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
    width: '69%',
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
    color: AppColors.Black,
    marginBottom: 20,
    marginTop: 5,
  },

  inputtitle: {
    fontSize: 14,
    color: AppColors.Black,
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
    width: '100%',
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
    fontFamily: 'serif',
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
    color: AppColors.Grey,
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

export default Bankkycone;
