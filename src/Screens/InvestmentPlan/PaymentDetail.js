import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import Clipboard from '@react-native-clipboard/clipboard';
import DocumentPicker from 'react-native-document-picker'; // For PDF selection
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CountryContext from '../../Context/CountryContext';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import {TouchableWithoutFeedback} from 'react-native';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const PaymentDetail = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showContactContainer, setShowContactContainer] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState([]);
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentid, setPaymentid] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [user, setUser] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const {confirmPayment, loading} = useConfirmPayment();

  const {investmentAmount, setInvestmentAmount} = useContext(CountryContext);
  console.log(investmentAmount, 'investttt');

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    console.log(uploadedFile);
  }, [uploadedFile]);

  const handleCopy = () => {
    Clipboard.setString('operations@coraluae.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to handle file upload (PDF or Image)

  const pickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log('File picked: ', res[0].name); // log the response to inspect the structure
      setUploadedFile(res[0].name); // Set the name from the response
      setReceiptUploaded(true); // Mark file upload as complete
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setUploadedFile(res[0].name);
      setReceiptUploaded(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  const handleUploadReceipt = () => {
    // Show options for selecting file type
    Alert.alert(
      'Select a file type',
      'Choose either an image or a PDF to upload.',
      [
        {
          text: 'Upload Image',
          onPress: () => pickImage(), // For selecting an image
        },
        {
          text: 'Upload PDF',
          onPress: () => pickPDF(), // For selecting a PDF
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const handleSubmit = () => {
    setShowModal(true); // Show the modal
  };
  const copyToClipboard = () => {
    const bankDetails = `Bank Name: Coral Bank\nA/c: 457838639376\nIFSC Code: IJS00BFD\nSWIFT Code: CORALUAE\nBranch: Dubai Main Branch`;
    Clipboard.setString(bankDetails);
    ToastAndroid.show('Bank details copied to clipboard!', ToastAndroid.SHORT); // Optional
  };

  const handleOnlinePayment = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    const requestBody = {amount: investmentAmount};

    console.log('Request Body:', requestBody); // Log request body

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/createPayment',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            user_id: userId, // Replace with actual user_id
          },
        },
      );
      console.log('Full rquestbody:', requestBody);
      console.log('Full Response:', response.data); // Log full response

      if (response.data && response.data.result) {
        console.log('Client Secret:', response.data.clientSecret);
        setPaymentid(response.data.clientSecret);
        setShowPaymentModal(true);
        // navigation.navigate('OnlinePayment', {
        //   clientSecret: response.data.clientSecret,
        // });
        // resetInvestmentStates();
      } else {
        console.error('Payment initialization failed:', response.data);
        Alert.alert('Error', 'Failed to initialize payment. Try again.');
      }
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user',
          {
            method: 'GET',
            headers: {
              user_id: user_id, // Replace with actual user_id
            },
          },
        );

        const result = await response.json();
        if (result.result && result?.data?.length > 0) {
          setUser(result.data[0]);
        } else {
          // Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        // Alert.alert('Error', 'Failed to fetch user details.');
      } finally {
        // setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    try {
      if (!cardNumber?.complete) {
        showCustomAlert(
          'Incomplete Details',
          'Please enter valid card details.',
        );
        return;
      }

      console.log('Processing payment with client secret:', paymentid);

      const billingDetails = {
        email: user?.u_email,
        name: user?.u_name,
        address: {
          country: selectedCountry,
          postalCode: cardNumber?.postalCode || zipCode, // Use postal code from CardField
        },
      };

      // Extract card details from CardField
      const paymentMethodData = {
        type: 'card',
        card: {
          number: cardNumber.last4, // Not needed, handled by Stripe
          exp_month: cardNumber.expiryMonth,
          exp_year: cardNumber.expiryYear,
          cvc: cardNumber.cvc, // Not needed, handled by Stripe
        },
        billing_details: billingDetails,
      };

      // Confirm payment
      const {error, paymentIntent} = await confirmPayment(paymentid, {
        paymentMethodType: 'Card',
        paymentMethodData,
      });

      console.log('Payment result:', error ? 'Error' : 'Success');

      if (error) {
        console.error('Payment failed:', error.message);
        showCustomAlert('Payment Failed', error.message);
      } else if (paymentIntent) {
        console.log('Payment successful:', paymentIntent);

        if (saveCard) {
          console.log('Saving card for future use');
        }

        showCustomAlert(
          'Payment Successful',
          'Your transaction was successful.',
          () => {
            navigation.navigate('DashBoardStack'); // Navigate on OK press
          },
        );
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      showCustomAlert('Error', 'An error occurred while processing payment.');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('DashBoardStack')}>
          <Image source={AppImages.Leftarrow} style={[
              styles.backIcon,
              i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
            ]}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('Investment Combination')}</Text>
      </View>

      {/* White Container */}
      <View style={styles.whiteContainer}>
        {/* Header Content */}
        <TouchableOpacity
          style={styles.headercontent}
          onPress={() => setShowContactContainer(!showContactContainer)}>
          <Text style={styles.headerTextconnect}>
            {t('CONNECT WITH US BEFORE PAY')}
          </Text>
          <Image source={AppImages.Connect} style={styles.headerIcon} />
        </TouchableOpacity>

        {/* Contact Information */}
        {showContactContainer && (
          <View style={styles.contactContainer}>
            <Text style={styles.contactText}>operations@coraluae.com</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Image source={AppImages.Copygreen} style={styles.copyIcon} />
            </TouchableOpacity>
            {isCopied && (
              <Text style={styles.copiedText}>Copied Successfully</Text>
            )}
            <Text style={styles.contactText}>Contact: 703450099</Text>
          </View>
        )}

        {/* Bank Transfer Section */}
        <TouchableOpacity
          style={styles.tabContainer}
          onPress={() => setShowBankDetails(!showBankDetails)}>
          <Text style={styles.tabText}>{t('BANK TRANSFER')}</Text>
          <Image source={AppImages.Blackbank} style={styles.bankIcon} />
        </TouchableOpacity>

        {/* Bank Details to Submit Button */}
        {showBankDetails && (
          <>
            {/* Bank Details */}
            <View style={styles.contactContainer}>
              <Text style={styles.bankDetailText}>
                Bank Name: CORAL WEALTH INVESTMENT IN HEALTHCARE ENTERPRISES &
                DEVELOPMENT CO. L.L.C
              </Text>
              <Text style={styles.bankDetailText}>A/c: 9467791855</Text>
              <Text style={styles.bankDetailText}>
                IBAN: AE330860000009467791855
              </Text>
              <Text style={styles.bankDetailText}>SWIFT Code: WIOBAEADXXX</Text>
              {/* <Text style={styles.bankDetailText}>
                Branch: Dubai Main Branch
              </Text> */}
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}>
                <Image source={AppImages.Copyblack} style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
            {/* Clipboard Icon */}

            {/* Payment Instructions */}
            <Text style={styles.paymentInstructions}>
              {t(
                'After making the payment, upload the payment receipt. If the screen closes, you can upload it later in your profile',
              )}
            </Text>

            {/* Upload Receipt Section */}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadReceipt}>
              <Text style={styles.uploadButtonText}>
                {t('UPLOAD YOUR RECEIPT')}
              </Text>
              <Image source={AppImages.Upload} style={styles.uploadIcon} />
            </TouchableOpacity>

            {/* Uploaded File Name */}
            {receiptUploaded && (
              <TextInput
                style={styles.fileNameInput}
                value={uploadedFile}
                editable={false}
              />
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{t('SUBMIT')}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Online Payment Section */}
        <TouchableOpacity
          style={styles.onlinePaymentContainer}
          onPress={handleOnlinePayment}>
          <Text style={styles.onlinePaymentText}>{t('ONLINE PAYMENT')}</Text>
          <Image source={AppImages.stripe} style={styles.stripeIcon} />
        </TouchableOpacity>
      </View>
      {/* Modal Section */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t(
                'Your Document has been sent for verification, you can track your growth after 24hrs',
              )}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('DashBoardStack');
              }}>
              <Text style={styles.modalButtonText}>{t('Go to Home')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* //...........Modal section 2.........// */}
      <Modal
        transparent={true}
        visible={showPaymentModal}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowPaymentModal(false)}>
          <View style={styles.modalContainer1}>
            <View style={styles.modalContent1}>
              <Text style={styles.modalHeader}>Add Card</Text>

              <View style={styles.modalContainer1}>
                <CardField
                  postalCodeEnabled={true}
                  placeholders={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={{
                    backgroundColor: 'grey',
                    textColor: '#000000',
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 50,
                  }}
                  onCardChange={cardDetails => {
                    setCardNumber(cardDetails);
                  }}
                  onFocus={focusedField => {
                    console.log('Focused Field:', focusedField);
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.payButton}
                onPress={handlePayment}>
                <Text style={styles.payButtonText}>Pay {investmentAmount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        onClose={() => {
          navigation.navigate('DashBoardStack');
        }}
        title={alertTitle}
        message={alertMessage}
      />
    </ScrollView>
  );
};

export default PaymentDetail;

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
    color: AppColors.white,
    fontSize: 18,
    fontFamily: 'serif',
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
    shadowColor: AppColors.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headercontent: {
    backgroundColor: AppColors.bordergreen,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    borderRadius: 10,
    marginVertical: 10,
  },
  headerTextconnect: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  contactContainer: {
    padding: 15,
    marginVertical: 10,
    borderColor: AppColors.perfectgrey,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 18,
    position: 'relative',
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
    color: AppColors.Black,
  },
  copyButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  copiedText: {
    fontSize: 12,
    color: AppColors.bordergreen,
    marginTop: 5,
    textAlign: 'center',
  },
  tabContainer: {
    backgroundColor: AppColors.Grey,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
    marginRight: 10,
  },
  bankIcon: {
    width: 30,
    height: 30,
  },
  bankDetailText: {
    fontSize: 12,
    marginBottom: 8,
    color: AppColors.Ash,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  paymentInstructions: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
    marginHorizontal: 20,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: AppColors.Yellow,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: 'bold',
    marginRight: 10,
  },
  uploadIcon: {
    width: 24,
    height: 24,
  },
  fileNameInput: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    color: AppColors.Black,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    backgroundColor: AppColors.white,
  },
  submitButton: {
    backgroundColor: AppColors.Yellow,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  onlinePaymentContainer: {
    backgroundColor: AppColors.Grey,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    borderRadius: 10,
    marginVertical: 10,
  },
  onlinePaymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
    marginRight: 10,
  },
  stripeIcon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: AppColors.chillyred,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: AppColors.Yellow,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: 'bold',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  scanIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  scanCardText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    height: 50,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  cardLogo1: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkboxIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderStyle: {
    color: '#888',
    fontSize: 16,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
});
