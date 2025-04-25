import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {Dropdown} from 'react-native-element-dropdown';
import DropdownWithDeleteAndAdd from '../../Components/DropdownWithDeleteAndAdd';
import Dropdownforbank from '../../Components/Dropdownforbank';
import DocumentPicker from 'react-native-document-picker';
import CountryContext from '../../Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const Investmentstep4 = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {
    selectedOption,
    personalDetails,
    investmentAmount,
    duration,
    formattedDuration,
    profitModal,
    withdrawalFrequency,
    returnAmount,
    percentageReturn,
  } = useContext(CountryContext);
  const {
    setSelectedOption,
    setPersonalDetails,
    setInvestmentAmount,
    setDuration,
    setProfitModal,
    setWithdrawalFrequency,
    setReturnAmount,
    setPercentageReturn,
  } = useContext(CountryContext);

  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedNomineeOption, setSelectedNomineeOption] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  console.log(formattedDuration, 'hello this is time');

  const nomineeoptions = [
    {label: 'Lunar', value: 'Lunar'},
    {label: 'ABC', value: 'ABC'},
    {label: 'CBA', value: 'CBA'},
  ];
  const options = [
    {label: 'South India', value: 'South India'},
    {label: 'Union Bank', value: 'Union Bank'},
    {label: 'Fedral Bank', value: 'Fedral Bank'},
  ];

  // Function to handle file upload
  const handleUpload = async () => {
    try {
      setLoadingUpload(true); // Show loading spinner

      // Pick a PDF file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allow only PDF files
      });

      if (!res || res.length === 0) {
        throw new Error('No file selected');
      }

      const file = res[0];

      // Retrieve user ID from AsyncStorage
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
      if (!userId) {
        alert('User ID is missing. Please log in again.');
        return;
      }

      // Prepare FormData for the API request
      const formData = new FormData();
      formData.append('contract_no', contract_id); // Replace with actual contract number
      formData.append('contract', {
        uri: file.uri,
        name: file.name,
        type: file.type || 'application/pdf', // Ensure correct MIME type
      });
      console.log(formData, 'hiiiiii');

      // Send API request
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/order/sign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            user_id: userId,
          },
          body: formData,
        },
      );

      const data = await response.json();

      // Handle API response
      if (data.result) {
        alert(data.message);
        setUploadedFileName(file.name);
        setUploadedFilePath(file.uri);
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('An error occurred while uploading the file.');
    } finally {
      setLoadingUpload(false); // Hide loading spinner
    }
  };
  const resetInvestmentStates = () => {
    setSelectedOption(null);
    setPersonalDetails({});
    // setInvestmentAmount(null);
    setDuration(null);
    setProfitModal(null);
    setWithdrawalFrequency(null);
    setReturnAmount(null);
    setPercentageReturn(null);
  };

  //..............INVEST API.....................//
  const [contract_id, setContract_id] = useState('');
  const handleDownload = async () => {
    setLoadingDownload(true);

    const requestBody = {
      bankAccount: selectedOptions.b_id,
      clientInfo: {
        clientName: personalDetails.fullName,
        email: personalDetails.email,
        nationalId: personalDetails.idproof,
        passportId: personalDetails.idproof,
        phone: personalDetails.phoneNumber,
        residentialAddress: personalDetails.address,
      },
      investment: {
        industry: 'any',
        investment_amount: investmentAmount,
        investment_duration: formattedDuration,
        percentage: percentageReturn,
        profit_model: profitModal,
        project_name: 'any',
        return_amount: returnAmount,
        withdrawal_frequency: withdrawalFrequency,
      },
      nomineeDetails: {
        contactNumber: selectedNomineeOption.mobile,
        emiratesOrPassportId: selectedNomineeOption.emiatesId,
        nomineeFullName: selectedNomineeOption.name,
        relationship: selectedNomineeOption.relation,
        residentialAddress: selectedNomineeOption.address,
      },
      securityOption: selectedOption,
    };

    console.log(requestBody, 'REQUESTTTT');

    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    const headers = {
      'Content-Type': 'application/json',
      user_id: user_id,
    };

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/invest',
        requestBody,
        {headers: headers},
      );

      if (response.data.result) {
        resetInvestmentStates();
        const contractid = response.data.contract_id;
        setContract_id(contractid);
        const filePath = response.data.path;
        console.log('Download URL: ', filePath);
        Linking.openURL(filePath);
        setIsDownloaded(true);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error during API call:', err);
      Alert.alert('Error', 'An error occurred while processing your request.');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleProceedToPayment = () => {
    setModalVisible(true);
  };

  const confirmPayment = () => {
    setModalVisible(false);
    navigation.navigate('PaymentDetailScreen');
  };

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.headerText}>{t('Investment Combination')}</Text>
      </View>

      <View style={styles.whiteContainer}>
        <View>
          <View style={styles.greyContainer}>
            <Text style={styles.stepText}>{t('Steps')} - 2/3</Text>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>{t('Any')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityContainer}>
            <Image source={AppImages.Bank} style={styles.securityIcon} />
            <Text style={styles.securityText}>{t('Bank Details')}</Text>
          </View>

          <View
            style={{
              backgroundColor: AppColors.Grey,
              width: '100%',
              borderWidth: 0.2,
              marginVertical: 7,
            }}></View>

          <View style={{marginTop: 20}}>
            {/* <Text style={styles.labelText}>Select Bank</Text> */}
            <DropdownWithDeleteAndAdd
              options={options}
              selectedOption={selectedOptions}
              onSelectOption={option => setSelectedOptions(option)}
            />
          </View>
          <View style={{marginTop: 20}}>
            {/* <Text style={styles.labelText}>Select Nominee</Text> */}
            <Dropdownforbank
              options={nomineeoptions}
              selectedOption={selectedNomineeOption}
              onSelectOption={option => setSelectedNomineeOption(option)}
            />
          </View>
        </View>
        {!isDownloaded ? (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleDownload}
                disabled={loadingDownload}>
                {loadingDownload ? (
                  <ActivityIndicator
                    size="small"
                    color={AppColors.bordergreen}
                  />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {t('Click To Download')}
                    </Text>
                    <Image
                      source={AppImages.Download}
                      style={styles.downloadImage}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.stepTextred}>
              {t(
                'DOWNLOAD THE FORM, SIGN IT, AND UPLOAD IT TO COMPLETE YOUR INVESTMENT',
              )}
            </Text>
          </>
        ) : (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleUpload}
                disabled={loadingUpload}>
                {loadingUpload ? (
                  <ActivityIndicator
                    size="small"
                    color={AppColors.bordergreen}
                  />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {t('Click To Upload')}
                    </Text>
                    <Image
                      source={AppImages.Upload}
                      style={styles.downloadImage}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
            {uploadedFilePath && uploadedFileName && (
              <View style={styles.filecontain}>
                <Text style={styles.uploadedFileText}>
                  {t('Uploaded File')}: {uploadedFileName}
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleProceedToPayment}>
                <Text style={styles.buttonText}>{t('Proceed to Payment')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>
              {t('Confirm to proceed with payment')}?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={confirmPayment}>
                <Text style={styles.proceedButtonText}>{t('Proceed')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Investmentstep4;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColors.backwhite,
  },
  header: {
    height: 150,
    position: 'relative',
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
    fontFamily: 'serif',
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  whiteContainer: {
    flex: 1,
    margin: 20,
    paddingVertical: 10,
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,

    shadowColor: AppColors.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  greyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  optionButton: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: AppColors.Grey,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  downloadImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: AppColors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',

    color: AppColors.Black,
  },
  stepTextred: {
    fontSize: 16,
    fontWeight: 'bold',

    color: AppColors.chillyred,
    textAlign: 'center',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  securityText: {
    fontSize: 18,
    fontFamily: 'serif',
    color: AppColors.Black,
  },
  labelText: {
    fontSize: 16,
    color: AppColors.Black,
    fontFamily: 'serif',
    top: 10,
  },
  dropdown: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.Grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: AppColors.darkgrey,
    marginVertical: 7,
  },
  dropdownContainer: {
    borderColor: AppColors.violet,
    borderRadius: 8,
    color: AppColors.darkgrey,
  },
  dropdownTextStyle: {
    color: AppColors.perfectgrey,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdownListTextStyle: {
    color: AppColors.darkgrey,
    fontSize: 14,
  },
  filecontain: {
    marginVertical: 5,
    marginHorizontal: 15,
    padding: 2,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 7,
  },
  uploadedFileText: {
    color: AppColors.perfectgrey,
    marginHorizontal: 8,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: AppColors.Black,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: AppColors.Black,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.Black,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: AppColors.Black,
    fontWeight: '500',
  },
  proceedButton: {
    flex: 1,
    marginLeft: 5,
    padding: 15,
    borderRadius: 8,

    backgroundColor: AppColors.Yellow,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: '500',
  },
});
