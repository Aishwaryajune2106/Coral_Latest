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
} from 'react-native';
import {Button} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {ImageBackground} from 'react-native';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const AddNominee = ({navigation}) => {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [idProof, setIdProof] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('+81');
  const [alertVisible, setAlertVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [items, setItems] = useState([
    {label: 'Nationality ID', value: 'Nationality ID'},
    {label: 'Emirates ID', value: 'Emirates ID'},
    {label: 'Driver Licence', value: 'Driver Licence'},
  ]);

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (res && res[0]) {
        setPdfFile(res[0]);
        setFileName(res[0].name);
        setAlertTitle('Success');
        setAlertMessage('File uploaded successfully');
        setAlertVisible(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setAlertTitle('Cancelled');
        setAlertMessage('File selection was cancelled');
      } else {
        setAlertTitle('Error');
        setAlertMessage('Error selecting file: ' + err.message);
      }
      setAlertVisible(true);
    }
  };

  const renderCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setCountryCode(item.flag);
        setIsModalVisible(false);
      }}>
      <Text
        style={{
          color: AppColors.white,
          fontSize: 17,
          fontFamily: 'serif',
          fontWeight: 'bold',
        }}>{`${item.flag} ${item.name} (${item.currency})`}</Text>
    </TouchableOpacity>
  );
  const countries = [
    {name: 'Afghanistan', flag: '🇦🇫', currency: 'AFN'},
    {name: 'Albania', flag: '🇦🇱', currency: 'L'},
    {name: 'Algeria', flag: '🇩🇿', currency: 'DZD'},
    {name: 'Andorra', flag: '🇦🇩', currency: '€'},
    {name: 'Angola', flag: '🇦🇴', currency: 'Kz'},
    {name: 'Antigua and Barbuda', flag: '🇦🇬', currency: 'EC$'},
    {name: 'Argentina', flag: '🇦🇷', currency: '$'},
    {name: 'Armenia', flag: '🇦🇲', currency: '֏'},
    {name: 'Australia', flag: '🇦🇺', currency: 'A$'},
    {name: 'Austria', flag: '🇦🇹', currency: '€'},
    {name: 'Azerbaijan', flag: '🇦🇿', currency: '₼'},
    {name: 'Bahamas', flag: '🇧🇸', currency: 'B$'},
    {name: 'Bahrain', flag: '🇧🇭', currency: 'BD'},
    {name: 'Bangladesh', flag: '🇧🇩', currency: '৳'},
    {name: 'Barbados', flag: '🇧🇧', currency: 'Bds$'},
    {name: 'Belarus', flag: '🇧🇾', currency: 'Br'},
    {name: 'Belgium', flag: '🇧🇪', currency: '€'},
    {name: 'Belize', flag: '🇧🇿', currency: 'BZ$'},
    {name: 'Benin', flag: '🇧🇯', currency: 'CFA'},
    {name: 'Bhutan', flag: '🇧🇹', currency: 'Nu.'},
    {name: 'Bolivia', flag: '🇧🇴', currency: 'Bs.'},
    {name: 'Bosnia and Herzegovina', flag: '🇧🇦', currency: 'KM'},
    {name: 'Botswana', flag: '🇧🇼', currency: 'P'},
    {name: 'Brazil', flag: '🇧🇷', currency: 'R$'},
    {name: 'Brunei', flag: '🇧🇳', currency: 'B$'},
    {name: 'Bulgaria', flag: '🇧🇬', currency: 'лв'},
    {name: 'Burkina Faso', flag: '🇧🇫', currency: 'CFA'},
    {name: 'Burundi', flag: '🇧🇮', currency: 'FBu'},
    {name: 'Cambodia', flag: '🇰🇭', currency: '៛'},
    {name: 'Cameroon', flag: '🇨🇲', currency: 'CFA'},
    {name: 'Canada', flag: '🇨🇦', currency: 'C$'},
    {name: 'Cape Verde', flag: '🇨🇻', currency: 'CVE'},
    {name: 'Chad', flag: '🇹🇩', currency: 'CFA'},
    {name: 'Chile', flag: '🇨🇱', currency: 'CLP'},
    {name: 'China', flag: '🇨🇳', currency: '¥'},
    {name: 'Colombia', flag: '🇨🇴', currency: 'COP'},
    {name: 'Comoros', flag: '🇰🇲', currency: 'KMF'},
    {name: 'Congo', flag: '🇨🇬', currency: 'CFA'},
    {name: 'Costa Rica', flag: '🇨🇷', currency: '₡'},
    {name: 'Croatia', flag: '🇭🇷', currency: '€'},
    {name: 'Cuba', flag: '🇨🇺', currency: 'CUP'},
    {name: 'Cyprus', flag: '🇨🇾', currency: '€'},
    {name: 'Czech Republic', flag: '🇨🇿', currency: 'Kč'},
    {name: 'Denmark', flag: '🇩🇰', currency: 'kr'},
    {name: 'Djibouti', flag: '🇩🇯', currency: 'Fdj'},
    {name: 'Dominica', flag: '🇩🇲', currency: 'EC$'},
    {name: 'Dominican Republic', flag: '🇩🇴', currency: 'RD$'},
    {name: 'Ecuador', flag: '🇪🇨', currency: '$'},
    {name: 'Egypt', flag: '🇪🇬', currency: 'E£'},
    {name: 'El Salvador', flag: '🇸🇻', currency: '$'},
    {name: 'Estonia', flag: '🇪🇪', currency: '€'},
    {name: 'Ethiopia', flag: '🇪🇹', currency: 'Br'},
    {name: 'Fiji', flag: '🇫🇯', currency: 'FJ$'},
    {name: 'Finland', flag: '🇫🇮', currency: '€'},
    {name: 'France', flag: '🇫🇷', currency: '€'},
    {name: 'Gabon', flag: '🇬🇦', currency: 'CFA'},
    {name: 'Gambia', flag: '🇬🇲', currency: 'D'},
    {name: 'Georgia', flag: '🇬🇪', currency: '₾'},
    {name: 'Germany', flag: '🇩🇪', currency: '€'},
    {name: 'Ghana', flag: '🇬🇭', currency: '₵'},
    {name: 'Greece', flag: '🇬🇷', currency: '€'},
    {name: 'Grenada', flag: '🇬🇩', currency: 'EC$'},
    {name: 'Guatemala', flag: '🇬🇹', currency: 'Q'},
    {name: 'Guinea', flag: '🇬🇳', currency: 'FG'},
    {name: 'Guyana', flag: '🇬🇾', currency: 'G$'},
    {name: 'Honduras', flag: '🇭🇳', currency: 'L'},
    {name: 'Hungary', flag: '🇭🇺', currency: 'Ft'},
    {name: 'Iceland', flag: '🇮🇸', currency: 'kr'},
    {name: 'India', flag: '🇮🇳', currency: '₹'},
    {name: 'Indonesia', flag: '🇮🇩', currency: 'Rp'},
    {name: 'Iran', flag: '🇮🇷', currency: 'IRR'},
    {name: 'Iraq', flag: '🇮🇶', currency: 'IQD'},
    {name: 'Ireland', flag: '🇮🇪', currency: '€'},
    {name: 'Israel', flag: '🇮🇱', currency: '₪'},
    {name: 'Italy', flag: '🇮🇹', currency: '€'},
    {name: 'Jamaica', flag: '🇯🇲', currency: 'J$'},
    {name: 'Japan', flag: '🇯🇵', currency: '¥'},
    {name: 'Jordan', flag: '🇯🇴', currency: 'JOD'},
    {name: 'Kazakhstan', flag: '🇰🇿', currency: '₸'},
    {name: 'Kenya', flag: '🇰🇪', currency: 'KSh'},
    {name: 'Kiribati', flag: '🇰🇮', currency: 'A$'},
    {name: 'Kuwait', flag: '🇰🇼', currency: 'KD'},
    {name: 'Kyrgyzstan', flag: '🇰🇬', currency: 'сом'},
    {name: 'Laos', flag: '🇱🇦', currency: '₭'},
    {name: 'Latvia', flag: '🇱🇻', currency: '€'},
    {name: 'Lebanon', flag: '🇱🇧', currency: 'ل.ل'},
    {name: 'Lesotho', flag: '🇱🇸', currency: 'L'},
    {name: 'Liberia', flag: '🇱🇷', currency: 'L$'},
    {name: 'Libya', flag: '🇱🇾', currency: 'LYD'},
    {name: 'Liechtenstein', flag: '🇱🇮', currency: 'CHF'},
    {name: 'Lithuania', flag: '🇱🇹', currency: '€'},
    {name: 'Luxembourg', flag: '🇱🇺', currency: '€'},
    {name: 'Madagascar', flag: '🇲🇬', currency: 'Ar'},
    {name: 'Malawi', flag: '🇲🇼', currency: 'MK'},
    {name: 'Malaysia', flag: '🇲🇾', currency: 'RM'},
    {name: 'Maldives', flag: '🇲🇻', currency: 'Rf'},
    {name: 'Mali', flag: '🇲🇱', currency: 'CFA'},
    {name: 'Malta', flag: '🇲🇹', currency: '€'},
    {name: 'Marshall Islands', flag: '🇲🇭', currency: 'US$'},
    {name: 'Mauritania', flag: '🇲🇷', currency: 'MRU'},
    {name: 'Mauritius', flag: '🇲🇺', currency: '₨'},
    {name: 'Mexico', flag: '🇲🇽', currency: '$'},
    {name: 'Micronesia', flag: '🇫🇲', currency: 'US$'},
    {name: 'Moldova', flag: '🇲🇩', currency: 'L'},
    {name: 'Monaco', flag: '🇲🇨', currency: '€'},
    {name: 'Mongolia', flag: '🇲🇳', currency: '₮'},
    {name: 'Montenegro', flag: '🇲🇪', currency: '€'},
    {name: 'Morocco', flag: '🇲🇦', currency: 'MAD'},
    {name: 'Mozambique', flag: '🇲🇿', currency: 'MT'},
    {name: 'Myanmar', flag: '🇲🇲', currency: 'K'},
    {name: 'Namibia', flag: '🇳🇦', currency: 'N$'},
    {name: 'Nauru', flag: '🇳🇷', currency: 'A$'},
    {name: 'Nepal', flag: '🇳🇵', currency: '₨'},
    {name: 'Netherlands', flag: '🇳🇱', currency: '€'},
    {name: 'New Zealand', flag: '🇳🇿', currency: 'NZ$'},
    {name: 'Nicaragua', flag: '🇳🇮', currency: 'C$'},
    {name: 'Niger', flag: '🇳🇪', currency: 'CFA'},
    {name: 'Nigeria', flag: '🇳🇬', currency: '₦'},
    {name: 'North Korea', flag: '🇰🇵', currency: '₩'},
    {name: 'North Macedonia', flag: '🇲🇰', currency: 'ден'},
    {name: 'Norway', flag: '🇳🇴', currency: 'kr'},
    {name: 'Oman', flag: '🇴🇲', currency: 'OMR'},
    {name: 'Pakistan', flag: '🇵🇰', currency: '₨'},
    {name: 'Palau', flag: '🇵🇼', currency: 'US$'},
    {name: 'Palestine', flag: '🇵🇸', currency: 'ILS'},
    {name: 'Panama', flag: '🇵🇦', currency: 'B/.'},
    {name: 'Papua New Guinea', flag: '🇵🇬', currency: 'K'},
    {name: 'Paraguay', flag: '🇵🇾', currency: '₲'},
    {name: 'Peru', flag: '🇵🇪', currency: 'S/.'},
    {name: 'Philippines', flag: '🇵🇭', currency: '₱'},
    {name: 'Poland', flag: '🇵🇱', currency: 'zł'},
    {name: 'Portugal', flag: '🇵🇹', currency: '€'},
    {name: 'Qatar', flag: '🇶🇦', currency: 'QAR'},
    {name: 'Romania', flag: '🇷🇴', currency: 'lei'},
    {name: 'Russia', flag: '🇷🇺', currency: '₽'},
    {name: 'Rwanda', flag: '🇷🇼', currency: 'FRw'},
    {name: 'Saint Kitts and Nevis', flag: '🇰🇳', currency: 'EC$'},
    {name: 'Saint Lucia', flag: '🇱🇨', currency: 'EC$'},
    {name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', currency: 'EC$'},
    {name: 'Samoa', flag: '🇼🇸', currency: 'WS$'},
    {name: 'San Marino', flag: '🇸🇲', currency: '€'},
    {name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR'},
    {name: 'Senegal', flag: '🇸🇳', currency: 'CFA'},
    {name: 'Serbia', flag: '🇷🇸', currency: 'дин'},
    {name: 'Seychelles', flag: '🇸🇨', currency: 'SR'},
    {name: 'Sierra Leone', flag: '🇸🇱', currency: 'Le'},
    {name: 'Singapore', flag: '🇸🇬', currency: 'S$'},
    {name: 'Slovakia', flag: '🇸🇰', currency: '€'},
    {name: 'Slovenia', flag: '🇸🇮', currency: '€'},
    {name: 'Solomon Islands', flag: '🇸🇧', currency: 'SI$'},
    {name: 'Somalia', flag: '🇸🇴', currency: 'Sh'},
    {name: 'South Africa', flag: '🇿🇦', currency: 'R'},
    {name: 'South Korea', flag: '🇰🇷', currency: '₩'},
    {name: 'South Sudan', flag: '🇸🇸', currency: 'SSP'},
    {name: 'Spain', flag: '🇪🇸', currency: '€'},
    {name: 'Sri Lanka', flag: '🇱🇰', currency: '₨'},
    {name: 'Sudan', flag: '🇸🇩', currency: 'ج.س'},
    {name: 'Suriname', flag: '🇸🇷', currency: 'SRD'},
    {name: 'Sweden', flag: '🇸🇪', currency: 'kr'},
    {name: 'Switzerland', flag: '🇨🇭', currency: 'CHF'},
    {name: 'Syria', flag: '🇸🇾', currency: 'SYP'},
    {name: 'Tajikistan', flag: '🇹🇯', currency: 'SM'},
    {name: 'Tanzania', flag: '🇹🇿', currency: 'TZS'},
    {name: 'Thailand', flag: '🇹🇭', currency: '฿'},
    {name: 'Timor-Leste', flag: '🇹🇱', currency: '$'},
    {name: 'Togo', flag: '🇹🇬', currency: 'CFA'},
    {name: 'Tonga', flag: '🇹🇴', currency: 'T$'},
    {name: 'Trinidad and Tobago', flag: '🇹🇹', currency: 'TT$'},
    {name: 'Tunisia', flag: '🇹🇳', currency: 'DT'},
    {name: 'Turkey', flag: '🇹🇷', currency: '₺'},
    {name: 'Turkmenistan', flag: '🇹🇲', currency: 'TMT'},
    {name: 'Tuvalu', flag: '🇹🇻', currency: 'A$'},
    {name: 'Uganda', flag: '🇺🇬', currency: 'UGX'},
    {name: 'Ukraine', flag: '🇺🇦', currency: '₴'},
    {name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED'},
    {name: 'United Kingdom', flag: '🇬🇧', currency: '£'},
    {name: 'United States', flag: '🇺🇸', currency: '$'},
    {name: 'Uruguay', flag: '🇺🇾', currency: 'UYU'},
    {name: 'Uzbekistan', flag: '🇺🇿', currency: 'лв'},
    {name: 'Vanuatu', flag: '🇻🇺', currency: 'VT'},
    {name: 'Vatican City', flag: '🇻🇦', currency: '€'},
    {name: 'Venezuela', flag: '🇻🇪', currency: 'Bs.'},
    {name: 'Vietnam', flag: '🇻🇳', currency: '₫'},
    {name: 'Yemen', flag: '🇾🇪', currency: '﷼'},
    {name: 'Zambia', flag: '🇿🇲', currency: 'ZK'},
    {name: 'Zimbabwe', flag: '🇿🇼', currency: 'Z$'},
    // Extend the list further as required
  ];
  // Filtered country list based on search
  const filteredCountries =
    countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      showAlert('Validation Error', 'Please enter the name');
      return false;
    }
    if (!relationship.trim()) {
      showAlert('Validation Error', 'Please enter the relationship');
      return false;
    }
    if (!email.trim()) {
      showAlert('Validation Error', 'Please enter the email');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!phone.trim()) {
      showAlert('Validation Error', 'Please enter the phone number');
      return false;
    } else if (phone.length < 7) {
      showAlert('Validation Error', 'Phone number is too short');
      return false;
    }
    if (!country.trim()) {
      showAlert('Validation Error', 'Please select a country');
      return false;
    }
    if (!gender.trim()) {
      showAlert('Validation Error', 'Please enter gender');
      return false;
    }
    if (!address.trim()) {
      showAlert('Validation Error', 'Please enter address');
      return false;
    }
    if (!idProof) {
      showAlert('Validation Error', 'Please select ID proof');
      return false;
    }
    if (!pdfFile) {
      showAlert('Validation Error', 'Please upload a PDF file');
      return false;
    }

    return true;
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  //..................Add Nominee Api..................//

  const handleAddNominee = async () => {
    if (!validateForm()) return; // Ensure form validation happens first

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('relation', relationship);
    formData.append('gender', gender);
    formData.append('country', country);
    formData.append('mobile', phone);
    formData.append('address', address);
    formData.append('id_type', idProof);

    if (pdfFile) {
      formData.append('image', {
        uri: pdfFile.uri,
        name: pdfFile.name,
        type: pdfFile.type,
      });
    }

    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            user_id: userId,
          },
          body: formData,
        },
      );

      const result = await response.json();
      showCustomAlert(result.message, 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      showCustomAlert('Failed to add nominee', 'error');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name */}
      <Text style={styles.label}>{t('Name')}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      {/* Relationship */}
      <Text style={styles.label}>{t('Relationship')}</Text>
      <TextInput
        style={styles.input}
        value={relationship}
        onChangeText={setRelationship}
      />

      {/* Email */}
      <Text style={styles.label}>{t('Email')}</Text>
      <TextInput
        style={styles.input}
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      {/* Phone Number */}
      <Text style={styles.label}>{t('Phone Number')}</Text>
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.countryText}>{countryCode}</Text>
        </TouchableOpacity>
        <TextInput
          placeholder={t('Phone Number')}
          placeholderTextColor={AppColors.Grey}
          value={phone}
          onChangeText={setPhone}
          style={styles.label}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      {/* Country & Gender Row */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>{t('Country')}</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>{t('Gender')}</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />
        </View>
      </View>

      {/* Address */}
      <Text style={styles.label}>{t('Address')}</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      {/* ID Proof Dropdown */}
      <Text style={styles.label}>{t('Select ID Proof')}</Text>
      <DropDownPicker
        open={open}
        value={idProof}
        items={items}
        setOpen={setOpen}
        setValue={setIdProof}
        setItems={setItems}
        placeholder={t('Select ID Proof')}
        placeholderStyle={{color: '#888'}}
        containerStyle={styles.dropdown}
        dropDownContainerStyle={{borderRadius: 20}}
      />

      {/* File Upload Section */}
      <View style={styles.uploadContainer}>
        <TextInput
          style={styles.uploadInput}
          value={fileName}
          editable={false}
        />
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}>
          <Image source={AppImages.Upload} style={styles.uploadImage} />
        </TouchableOpacity>
      </View>

      {/* Download Button */}
      <Button
        title={t('Save Nominee')}
        buttonStyle={styles.downloadButton}
        titleStyle={styles.buttonText}
        onPress={handleAddNominee}
      />

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
                  {t('Nominee Added Successful')}!
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  // onPress={handleBackToLogin}
                >
                  <Text style={styles.buttonText}>{t('Back To profile')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Country Code Modal */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Country"
            placeholderTextColor={AppColors.Grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCountries}
            // scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCountryItem}
            contentContainerStyle={styles.list}
          />
        </View>
      </Modal>
      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f3f6fb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  phoneInput: {
    backgroundColor: '#f3f6fb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: AppColors.Grey,
    borderWidth: 0.5,
    borderRadius: 20,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadInput: {
    flex: 1,
    padding: 12,
  },
  uploadButton: {
    padding: 10,
    borderRadius: 5,
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    marginBottom: 15,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  downloadButton: {
    backgroundColor: AppColors.NavyBlue,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadImage: {
    width: 24,
    height: 24,
  },
  phoneContainer: {flexDirection: 'row', alignItems: 'center'},
  countryCodeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    marginRight: 10,
  },
  countryCodeText: {color: AppColors.Black},
  phoneInput: {flex: 1},
  modalContainer: {flex: 1, padding: 20, backgroundColor: AppColors.Ash},
  modalTitle: {
    fontSize: 18,

    marginBottom: 10,
    color: AppColors.OffWhite,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  countryItem: {padding: 10, borderBottomWidth: 1, borderColor: AppColors.Grey},
  countryText: {fontSize: 16, color: AppColors.Black},
  searchInput: {
    backgroundColor: AppColors.OffWhite,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    color: AppColors.Black,
  },
});

export default AddNominee;
