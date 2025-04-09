import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {Button} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';

const SaveNominee = () => {
  const [name, setName] = useState('Messi');
  const [relationship, setRelationship] = useState('Brother');
  const [email, setEmail] = useState('youremail@domain.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [country, setCountry] = useState('United States');
  const [gender, setGender] = useState('Female');
  const [address, setAddress] = useState('45 New Avenue, New York');
  const [idProof, setIdProof] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Passport', value: 'passport'},
    {label: 'National ID', value: 'national_id'},
    {label: 'Driving License', value: 'driving_license'},
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({type: [DocumentPicker.types.pdf]});
      if (res && res[0]) {
        setPdfFile(res[0]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('File selection canceled');
      } else {
        Alert.alert('Error selecting file', err.message);
      }
    }
  };

  const handleSaveNominee = () => {
    // Simulate API call or validation
    setModalVisible(true);
  };

  const handleBackToProfile = () => {
    setModalVisible(false);
    // Add navigation logic here if needed
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
            placeholder="Relationship"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
          <PhoneInput
            initialCountry={'us'}
            textProps={{
              placeholder: 'Phone Number',
              value: phone,
              onChangeText: setPhone,
            }}
            style={styles.phoneInput}
          />
          <View style={styles.row}>
            <TextInput
              style={styles.inputHalf}
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
            />
            <TextInput
              style={styles.inputHalf}
              value={gender}
              onChangeText={setGender}
              placeholder="Gender"
            />
          </View>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <DropDownPicker
            open={open}
            value={idProof}
            items={items}
            setOpen={setOpen}
            setValue={setIdProof}
            setItems={setItems}
            placeholder="Select ID Proof"
            containerStyle={styles.dropdown}
          />
          <View style={styles.uploadContainer}>
            <TextInput
              style={styles.uploadInput}
              value={pdfFile ? pdfFile.name : 'UPLOAD SIGNED FORM'}
              editable={false}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleFileUpload}>
              <Image source={AppImages.Upload} style={styles.uploadImage} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title="SAVE NOMINEE"
          buttonStyle={styles.saveButton}
          onPress={handleSaveNominee}
        />
      </View>

      {/* Success Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ImageBackground
                  source={AppImages.Successtick}
                  style={styles.backgroundImage}
                />
                <Text style={styles.successMessage}>
                  Your Nominee Documents has been sent for verification, we will
                  update   after 24hrs
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleBackToProfile}>
                  <Text style={styles.buttonText}>Back To Profile</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContainer: {flexGrow: 1, padding: 20},
  formContainer: {flex: 1, marginVertical: 20},
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  input: {
    backgroundColor: '#f3f6fb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  phoneInput: {
    backgroundColor: '#f3f6fb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  inputHalf: {
    backgroundColor: '#f3f6fb',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    marginBottom: 15,
  },
  dropdown: {marginBottom: 15, borderRadius: 8},
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadInput: {flex: 1, padding: 12},
  uploadButton: {padding: 10, borderRadius: 5},
  uploadImage: {width: 24, height: 24},
  saveButton: {backgroundColor: '#1573FE', padding: 15, borderRadius: 8},
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 350, // Increase width
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 30, // Increase padding for more spacing
  },
  backgroundImage: {
    width: 150,
    height: 150,
    marginBottom: 25, // Adjust spacing
    resizeMode: 'contain',
  },
  successMessage: {
    fontSize: 13,
    // fontWeight: 'bold',
    color: AppColors.red,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  successMessage1: {
    fontSize: 13,
    color: AppColors.red,
    fontFamily: 'serif',
    marginBottom: 25,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'serif',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default SaveNominee;
