import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AppImages from '../Constants/AppImages';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const PaymentScreen = ({route, navigation}) => {
  const {contractId} = route.params;
  console.log(contractId, 'iDddd');

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(result[0]);
      Toast.show(`File selected: ${result[0].name}`, Toast.LONG);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to select a file.');
      }
    }
  };

  const handleUploadInvoice = async () => {
    if (!selectedFile) {
      Toast.show('Please select a file to upload.', Toast.LONG);
      return;
    }

    const formData = new FormData();
    formData.append('c_id', contractId);
    formData.append('invoice', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    // try {
    await axios({
      url: 'https://coral.lunarsenterprises.com/wealthinvestment/user/invoice/upload',
      method: 'POST',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(data => {
        if (data.data.result) {
          Toast.show(`Success: ${data.data.message}`, Toast.LONG);
          setIsModalVisible(true); // Show modal on successful upload
        } else {
          Toast.show(`Error: ${data.data.message}`, Toast.LONG);
        }
      })
      .catch(err => {
        console.log(err, 'error in axios');
      });
    // const response = await axios.post(
    //   'https://coral.lunarsenterprises.com/wealthinvestment/user/invoice/upload',
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   },
    // );
    // console.log("working");
    // if (response.data.result) {
    //   Toast.show(`Success: ${response.data.message}`, Toast.LONG);
    //   setIsModalVisible(true); // Show modal on successful upload
    // } else {
    //   Toast.show(`Error: ${response.data.message}`, Toast.LONG);
    // }
    // } catch (error) {
    //   console.error('Upload error:', error);
    //   Toast.show('An error occurred during the upload.', Toast.LONG);
    // }
  };

  const renderDetails = () => {
    switch (selectedOption) {
      case 'connect':
        return (
          <View>
            <Text style={styles.detailText}>
              mailId : operations@coraluae.com
            </Text>
            <Text style={styles.detailText}>Phone : +971527344136</Text>
          </View>
        );
      case 'bank':
        return (
          <View style={styles.bankDetails}>
            <Text style={styles.detailText}>
              Account Name: CORALWEALTHINVESTMENTINHEALTHCARE ENTERPRISES&
              DEVELOPMENT CO. L.L.C
            </Text>
            <Text style={styles.detailText}>Account Currency: AED</Text>
            <Text style={styles.detailText}>Account Number: 9467791855</Text>
            <Text style={styles.detailText}>
              IFSC/IBAN: AE330860000009467791855
            </Text>
            <Text style={styles.detailText}>SWIFT/BIC: WIOBAEADXXX</Text>
            <View style={{borderWidth: 0.5, backgroundColor: '#888'}}></View>
            <Text
              style={{
                marginHorizontal: 10,
                color: '#000',
                fontSize: 15,
                marginTop: 10,
              }}>
              **After Payment Upload Payment Invoice**
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={[
                  styles.uploadImageContainer,
                  styles.uploadbutton1,
                  {flexDirection: 'row'},
                ]}
                onPress={handleFileSelect}>
                <Image
                  source={AppImages.Upload}
                  style={styles.uploadImage}
                  resizeMode="contain"
                />
                <Text style={[styles.buttonText, {marginLeft: 5}]}>
                  Upload Payment Invoice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadbutton1]}
                onPress={handleUploadInvoice}>
                <Text style={styles.buttonText}>submit</Text>
              </TouchableOpacity>
            </View>
            {selectedFile && (
              <Text style={styles.selectedFileText}>
                Selected File: {selectedFile.name}
              </Text>
            )}
          </View>
        );
      case 'online':
        return (
          <TouchableOpacity style={styles.proceedButton}>
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'connect' && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect('connect')}>
        <Text style={styles.optionText}>Connect Us Before Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'bank' && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect('bank')}>
        <Text style={styles.optionText}>Bank Transfer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'online' && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect('online')}>
        <Text style={styles.optionText}>Online Payment</Text>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>{renderDetails()}</View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Your Document has been sent for verification, you can track your growth after 24hrs!
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate('DrawerScreen'); // Navigate to home
              }}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#78c1e9',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0, // Reduce vertical margins
  },
  uploadImage: {
    width: 22, // Adjust icon size for better appearance
    height: 22,
  },
  uploadbutton1: {
    backgroundColor: '#78c1e9',
    padding: 7,
    borderRadius: 10,
    alignItems: 'center',
  },

  detailText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  bankDetails: {
    marginVertical: 10,
  },
  proceedButton: {
    backgroundColor: '#78c1e9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadButton: {
    marginTop: 15,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#333',
  },
  okButton: {
    backgroundColor: '#78c1e9',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
