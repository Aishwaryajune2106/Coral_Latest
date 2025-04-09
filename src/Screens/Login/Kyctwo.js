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
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CustomAlert from '../../Components/CustomAlert';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const Kyctwo = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {frontImage, setFrontImage, verificationMethod} =
    useContext(CountryContext);

  console.log('frontImage', frontImage);

  const [showAlert, setShowAlert] = useState(false);

  const handleUpload = () => {
    Alert.alert(
      'Upload National Identity Card Front Photo',
      'Choose an option',
      [
        {text: 'Take Photo', onPress: () => pickImage('camera')},
        {text: 'Upload from Gallery', onPress: () => pickImage('gallery')},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  const pickImage = type => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    if (type === 'camera') {
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const imageData = response.assets[0];
          const imageDetails = {
            uri: imageData.uri,
            type: imageData.type,
            name: imageData.fileName,
            size: imageData.fileSize,
          };
          setFrontImage(imageDetails); // Set the front image with all the details
        }
      });
    } else if (type === 'gallery') {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const imageData = response.assets[0];
          const imageDetails = {
            uri: imageData.uri,
            type: imageData.type,
            name: imageData.fileName,
            size: imageData.fileSize,
          };
          setFrontImage(imageDetails); // Set the front image with all the details
        }
      });
    }
  };

  const handleSubmit = () => {
    if (!frontImage) {
      setShowAlert(true); // Show the custom alert
      return;
    }
    navigation.navigate('KycthreeScreen');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={AppImages.greaterarrow} // Replace with the correct image path
            style={styles.backArrowImage}
          />
        </TouchableOpacity>  */}

        {/* <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={styles.headerTitle}>KYC</Text>
        </View> */}
      </View>

      {/* Title */}
      <Text style={styles.title}>{t('National ID')}</Text>
      <View style={styles.progressBar}>
        <View style={styles.activeProgress} />
      </View>

      {/* Upload Section */}
      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 20,
          borderRadius: 10,
          backgroundColor: '#fff', // Ensure background color is set
          shadowColor: '#000', // Shadow color (black)
          shadowOffset: {width: 0, height: 2}, // Offset for the shadow
          shadowOpacity: 0.25, // Opacity of the shadow
          shadowRadius: 3.84, // Spread radius
          elevation: 5, // For Android shadows
        }}>
        <Text style={styles.sectionTitle}>
          {t('National Identity Card (Front)')}
        </Text>
        <Text style={styles.description}>
          {t(
            'Please upload your National Identity card below for completing your first step of KYC',
          )}
        </Text>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder={verificationMethod}
          placeholderTextColor={AppColors.darkgrey}
          editable={false}
        />

        {/* Upload Button */}
        <View
          style={{
            borderWidth: 1,
            borderColor: AppColors.lightgrey,
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
            {t('Upload National Identity card front photo')}
          </Text>
          <View style={styles.uploadBox}>
            <TouchableOpacity onPress={handleUpload}>
              <Text style={styles.uploadButton}>{t('Upload')}</Text>

              <Text style={styles.uploadButton}>{t('Take Photo')}</Text>
            </TouchableOpacity>
          </View>

          {/* Note */}
          <Text style={styles.note}>
            *{t('Only PDF and JPEG files are accepted')} *
          </Text>
        </View>

        {/* Preview Image */}
        {frontImage && (
          <>
            {/* Show image path */}
            <Text style={styles.imagePath}>{frontImage.name}</Text>
          </>
        )}

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
        <Text style={styles.whatsapp}>{t('Whatsapp')}</Text>
      </Text>

      {/* Custom Alert */}
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)} // Close the alert
        title="Error"
        message="Please upload your National Identity card front photo."
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
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
    width: '33%', // Adjust based on progress
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
    padding: 10,

    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    backgroundColor: '#4D4D4D',
    padding: 13,
    borderRadius: 10,
    textAlign: 'center',
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
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
    width: 24, // Adjust width as needed
    height: 24, // Adjust height as needed
    tintColor: AppColors.Black, // Optional: Change the color of the image if it's an SVG or monochromatic
  },
  imagePath: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default Kyctwo;
