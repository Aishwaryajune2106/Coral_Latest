import React, {useEffect, useState} from 'react';
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
import {Dropdown} from 'react-native-element-dropdown';
import DocumentPicker from 'react-native-document-picker';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import {ImageBackground} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';

const EditProfile = ({navigation}) => {
  const {t} = useTranslation();
  const [name, setName] = useState('Messi');
  const [relationship, setRelationship] = useState('UAE');
  const [email, setEmail] = useState('youremail@domain.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [country, setCountry] = useState('United States');
  const [gender, setGender] = useState('Female');
  const [address, setAddress] = useState('45 New Avenue, New York');
  const [idProof, setIdProof] = useState(null);
  const [fileName, setFileName] = useState('nationalityidproof.pdf');
  const [pdfFile, setPdfFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCurrencyFocus, setIsCurrencyFocus] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [countryCode, setCountryCode] = useState('+81');
  const [items, setItems] = useState([
    {label: 'Passport', value: 'passport'},
    {label: 'National ID', value: 'national_id'},
    {label: 'Driving License', value: 'driving_license'},
  ]);

  const countries = [
    {name: 'Afghanistan', flag: '🇦🇫', currency: 'AFN'},
    {name: 'Albania', flag: '🇦🇱', currency: 'ALL'},
    {name: 'Algeria', flag: '🇩🇿', currency: 'DZD'},
    {name: 'Andorra', flag: '🇦🇩', currency: 'EUR'},
    {name: 'Angola', flag: '🇦🇴', currency: 'AOA'},
    {name: 'Antigua and Barbuda', flag: '🇦🇬', currency: 'XCD'},
    {name: 'Argentina', flag: '🇦🇷', currency: 'ARS'},
    {name: 'Armenia', flag: '🇦🇲', currency: 'AMD'},
    {name: 'Australia', flag: '🇦🇺', currency: 'AUD'},
    {name: 'Austria', flag: '🇦🇹', currency: 'EUR'},
    {name: 'Azerbaijan', flag: '🇦🇿', currency: 'AZN'},
    {name: 'Bahamas', flag: '🇧🇸', currency: 'BSD'},
    {name: 'Bahrain', flag: '🇧🇭', currency: 'BHD'},
    {name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT'},
    {name: 'Barbados', flag: '🇧🇧', currency: 'BBD'},
    {name: 'Belarus', flag: '🇧🇾', currency: 'BYN'},
    {name: 'Belgium', flag: '🇧🇪', currency: 'EUR'},
    {name: 'Belize', flag: '🇧🇿', currency: 'BZD'},
    {name: 'Benin', flag: '🇧🇯', currency: 'XOF'},
    {name: 'Bhutan', flag: '🇧🇹', currency: 'BTN'},
    {name: 'Bolivia', flag: '🇧🇴', currency: 'BOB'},
    {name: 'Bosnia and Herzegovina', flag: '🇧🇦', currency: 'BAM'},
    {name: 'Botswana', flag: '🇧🇼', currency: 'BWP'},
    {name: 'Brazil', flag: '🇧🇷', currency: 'BRL'},
    {name: 'Brunei', flag: '🇧🇳', currency: 'BND'},
    {name: 'Bulgaria', flag: '🇧🇬', currency: 'BGN'},
    {name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF'},
    {name: 'Burundi', flag: '🇧🇮', currency: 'BIF'},
    {name: 'Cambodia', flag: '🇰🇭', currency: 'KHR'},
    {name: 'Cameroon', flag: '🇨🇲', currency: 'XAF'},
    {name: 'Canada', flag: '🇨🇦', currency: 'CAD'},
    {name: 'Cape Verde', flag: '🇨🇻', currency: 'CVE'},
    {name: 'Chad', flag: '🇹🇩', currency: 'XAF'},
    {name: 'Chile', flag: '🇨🇱', currency: 'CLP'},
    {name: 'China', flag: '🇨🇳', currency: 'CNY'},
    {name: 'Colombia', flag: '🇨🇴', currency: 'COP'},
    {name: 'Comoros', flag: '🇰🇲', currency: 'KMF'},
    {name: 'Congo', flag: '🇨🇬', currency: 'XAF'},
    {name: 'Costa Rica', flag: '🇨🇷', currency: 'CRC'},
    {name: 'Croatia', flag: '🇭🇷', currency: 'EUR'},
    {name: 'Cuba', flag: '🇨🇺', currency: 'CUP'},
    {name: 'Cyprus', flag: '🇨🇾', currency: 'EUR'},
    {name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK'},
    {name: 'Denmark', flag: '🇩🇰', currency: 'DKK'},
    {name: 'Djibouti', flag: '🇩🇯', currency: 'DJF'},
    {name: 'Dominica', flag: '🇩🇲', currency: 'XCD'},
    {name: 'Dominican Republic', flag: '🇩🇴', currency: 'DOP'},
    {name: 'Ecuador', flag: '🇪🇨', currency: 'USD'},
    {name: 'Egypt', flag: '🇪🇬', currency: 'EGP'},
    {name: 'El Salvador', flag: '🇸🇻', currency: 'USD'},
    {name: 'Estonia', flag: '🇪🇪', currency: 'EUR'},
    {name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB'},
    {name: 'Fiji', flag: '🇫🇯', currency: 'FJD'},
    {name: 'Finland', flag: '🇫🇮', currency: 'EUR'},
    {name: 'France', flag: '🇫🇷', currency: 'EUR'},
    {name: 'Gabon', flag: '🇬🇦', currency: 'XAF'},
    {name: 'Gambia', flag: '🇬🇲', currency: 'GMD'},
    {name: 'Georgia', flag: '🇬🇪', currency: 'GEL'},
    {name: 'Germany', flag: '🇩🇪', currency: 'EUR'},
    {name: 'Ghana', flag: '🇬🇭', currency: 'GHS'},
    {name: 'Greece', flag: '🇬🇷', currency: 'EUR'},
    {name: 'Grenada', flag: '🇬🇩', currency: 'XCD'},
    {name: 'Guatemala', flag: '🇬🇹', currency: 'GTQ'},
    {name: 'Guinea', flag: '🇬🇳', currency: 'GNF'},
    {name: 'Guyana', flag: '🇬🇾', currency: 'GYD'},
    {name: 'Honduras', flag: '🇭🇳', currency: 'HNL'},
    {name: 'Hungary', flag: '🇭🇺', currency: 'HUF'},
    {name: 'Iceland', flag: '🇮🇸', currency: 'ISK'},
    {name: 'India', flag: '🇮🇳', currency: 'INR'},
    {name: 'Indonesia', flag: '🇮🇩', currency: 'IDR'},
    {name: 'Iran', flag: '🇮🇷', currency: 'IRR'},
    {name: 'Iraq', flag: '🇮🇶', currency: 'IQD'},
    {name: 'Ireland', flag: '🇮🇪', currency: 'EUR'},
    {name: 'Israel', flag: '🇮🇱', currency: 'ILS'},
    {name: 'Italy', flag: '🇮🇹', currency: 'EUR'},
    {name: 'Jamaica', flag: '🇯🇲', currency: 'JMD'},
    {name: 'Japan', flag: '🇯🇵', currency: 'JPY'},
    {name: 'Jordan', flag: '🇯🇴', currency: 'JOD'},
    {name: 'Kazakhstan', flag: '🇰🇿', currency: 'KZT'},
    {name: 'Kenya', flag: '🇰🇪', currency: 'KES'},
    {name: 'Kiribati', flag: '🇰🇮', currency: 'AUD'},
    {name: 'Kuwait', flag: '🇰🇼', currency: 'KWD'},
    {name: 'Kyrgyzstan', flag: '🇰🇬', currency: 'KGS'},
    {name: 'Laos', flag: '🇱🇦', currency: 'LAK'},
    {name: 'Latvia', flag: '🇱🇻', currency: 'EUR'},
    {name: 'Lebanon', flag: '🇱🇧', currency: 'LBP'},
    {name: 'Lesotho', flag: '🇱🇸', currency: 'LSL'},
    {name: 'Liberia', flag: '🇱🇷', currency: 'LRD'},
    {name: 'Libya', flag: '🇱🇾', currency: 'LYD'},
    {name: 'Liechtenstein', flag: '🇱🇮', currency: 'CHF'},
    {name: 'Lithuania', flag: '🇱🇹', currency: 'EUR'},
    {name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR'},
    {name: 'Madagascar', flag: '🇲🇬', currency: 'MGA'},
    {name: 'Malawi', flag: '🇲🇼', currency: 'MWK'},
    {name: 'Malaysia', flag: '🇲🇾', currency: 'MYR'},
    {name: 'Maldives', flag: '🇲🇻', currency: 'MVR'},
    {name: 'Mali', flag: '🇲🇱', currency: 'XOF'},
    {name: 'Malta', flag: '🇲🇹', currency: 'EUR'},
    {name: 'Marshall Islands', flag: '🇲🇭', currency: 'USD'},
    {name: 'Mauritania', flag: '🇲🇷', currency: 'MRU'},
    {name: 'Mauritius', flag: '🇲🇺', currency: 'MUR'},
    {name: 'Mexico', flag: '🇲🇽', currency: 'MXN'},
    {name: 'Micronesia', flag: '🇫🇲', currency: 'USD'},
    {name: 'Moldova', flag: '🇲🇩', currency: 'MDL'},
    {name: 'Monaco', flag: '🇲🇨', currency: 'EUR'},
    {name: 'Mongolia', flag: '🇲🇳', currency: 'MNT'},
    {name: 'Montenegro', flag: '🇲🇪', currency: 'EUR'},
    {name: 'Morocco', flag: '🇲🇦', currency: 'MAD'},
    {name: 'Mozambique', flag: '🇲🇿', currency: 'MZN'},
    {name: 'Myanmar', flag: '🇲🇲', currency: 'MMK'},
    {name: 'Namibia', flag: '🇳🇦', currency: 'NAD'},
    {name: 'Nauru', flag: '🇳🇷', currency: 'AUD'},
    {name: 'Nepal', flag: '🇳🇵', currency: 'NPR'},
    {name: 'Netherlands', flag: '🇳🇱', currency: 'EUR'},
    {name: 'New Zealand', flag: '🇳🇿', currency: 'NZD'},
    {name: 'Nicaragua', flag: '🇳🇮', currency: 'NIO'},
    {name: 'Niger', flag: '🇳🇪', currency: 'XOF'},
    {name: 'Nigeria', flag: '🇳🇬', currency: 'NGN'},
    {name: 'North Korea', flag: '🇰🇵', currency: 'KPW'},
    {name: 'North Macedonia', flag: '🇲🇰', currency: 'MKD'},
    {name: 'Norway', flag: '🇳🇴', currency: 'NOK'},
    {name: 'Oman', flag: '🇴🇲', currency: 'OMR'},
    {name: 'Pakistan', flag: '🇵🇰', currency: 'PKR'},
    {name: 'Palau', flag: '🇵🇼', currency: 'USD'},
    {name: 'Palestine', flag: '🇵🇸', currency: 'ILS'},
    {name: 'Panama', flag: '🇵🇦', currency: 'PAB'},
    {name: 'Papua New Guinea', flag: '🇵🇬', currency: 'PGK'},
    {name: 'Paraguay', flag: '🇵🇾', currency: 'PYG'},
    {name: 'Peru', flag: '🇵🇪', currency: 'PEN'},
    {name: 'Philippines', flag: '🇵🇭', currency: 'PHP'},
    {name: 'Poland', flag: '🇵🇱', currency: 'PLN'},
    {name: 'Portugal', flag: '🇵🇹', currency: 'EUR'},
    {name: 'Qatar', flag: '🇶🇦', currency: 'QAR'},
    {name: 'Romania', flag: '🇷🇴', currency: 'RON'},
    {name: 'Russia', flag: '🇷🇺', currency: 'RUB'},
    {name: 'Rwanda', flag: '🇷🇼', currency: 'RWF'},
    {name: 'Saint Kitts and Nevis', flag: '🇰🇳', currency: 'XCD'},
    {name: 'Saint Lucia', flag: '🇱🇨', currency: 'XCD'},
    {name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', currency: 'XCD'},
    {name: 'Samoa', flag: '🇼🇸', currency: 'WST'},
    {name: 'San Marino', flag: '🇸🇲', currency: 'EUR'},
    {name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR'},
    {name: 'Senegal', flag: '🇸🇳', currency: 'XOF'},
    {name: 'Serbia', flag: '🇷🇸', currency: 'RSD'},
    {name: 'Seychelles', flag: '🇸🇨', currency: 'SCR'},
    {name: 'Sierra Leone', flag: '🇸🇱', currency: 'SLL'},
    {name: 'Singapore', flag: '🇸🇬', currency: 'SGD'},
    {name: 'Slovakia', flag: '🇸🇰', currency: 'EUR'},
    {name: 'Slovenia', flag: '🇸🇮', currency: 'EUR'},
    {name: 'Solomon Islands', flag: '🇸🇧', currency: 'SBD'},
    {name: 'Somalia', flag: '🇸🇴', currency: 'SOS'},
    {name: 'South Africa', flag: '🇿🇦', currency: 'ZAR'},
    {name: 'South Korea', flag: '🇰🇷', currency: 'KRW'},
    {name: 'South Sudan', flag: '🇸🇸', currency: 'SSP'},
    {name: 'Spain', flag: '🇪🇸', currency: 'EUR'},
    {name: 'Sri Lanka', flag: '🇱🇰', currency: 'LKR'},
    {name: 'Sudan', flag: '🇸🇩', currency: 'SDG'},
    {name: 'Suriname', flag: '🇸🇷', currency: 'SRD'},
    {name: 'Sweden', flag: '🇸🇪', currency: 'SEK'},
    {name: 'Switzerland', flag: '🇨🇭', currency: 'CHF'},
    {name: 'Syria', flag: '🇸🇾', currency: 'SYP'},
    {name: 'Tajikistan', flag: '🇹🇯', currency: 'TJS'},
    {name: 'Tanzania', flag: '🇹🇿', currency: 'TZS'},
    {name: 'Thailand', flag: '🇹🇭', currency: 'THB'},
    {name: 'Timor-Leste', flag: '🇹🇱', currency: 'USD'},
    {name: 'Togo', flag: '🇹🇬', currency: 'XOF'},
    {name: 'Tonga', flag: '🇹🇴', currency: 'TOP'},
    {name: 'Trinidad and Tobago', flag: '🇹🇹', currency: 'TTD'},
    {name: 'Tunisia', flag: '🇹🇳', currency: 'TND'},
    {name: 'Turkey', flag: '🇹🇷', currency: 'TRY'},
    {name: 'Turkmenistan', flag: '🇹🇲', currency: 'TMT'},
    {name: 'Tuvalu', flag: '🇹🇻', currency: 'AUD'},
    {name: 'Uganda', flag: '🇺🇬', currency: 'UGX'},
    {name: 'Ukraine', flag: '🇺🇦', currency: 'UAH'},
    {name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED'},
    {name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP'},
    {name: 'United States', flag: '🇺🇸', currency: 'USD'},
    {name: 'Uruguay', flag: '🇺🇾', currency: 'UYU'},
    {name: 'Uzbekistan', flag: '🇺🇿', currency: 'UZS'},
    {name: 'Vanuatu', flag: '🇻🇺', currency: 'VUV'},
    {name: 'Vatican City', flag: '🇻🇦', currency: 'EUR'},
    {name: 'Venezuela', flag: '🇻🇪', currency: 'VES'},
    {name: 'Vietnam', flag: '🇻🇳', currency: 'VND'},
    {name: 'Yemen', flag: '🇾🇪', currency: 'YER'},
    {name: 'Zambia', flag: '🇿🇲', currency: 'ZMW'},
    {name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL'},
  ];

  // Create currency dropdown data from countries array
  const currencyData = countries.map(country => ({
    label: `${country.currency} - ${country.name}`,
    value: country.currency,
    flag: country.flag,
  }));

  // Remove duplicates and sort
  const uniqueCurrencies = currencyData
    .filter(
      (currency, index, self) =>
        index === self.findIndex(c => c.value === currency.value),
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (res && res[0]) {
        setPdfFile(res[0]);
        setFileName(res[0].name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('File selection canceled');
      } else {
        Alert.alert('Error selecting file', err.message);
      }
    }
  };

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    gender: '',
    u_address: '',
    currency: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.get(
        'https://coral.lunarsenterprises.com/wealthinvestment/user',
        {
          headers: {
            user_id: user_id,
          },
        },
      );

      if (response.data.result) {
        const userData = response.data.data[0];
        setProfile({
          name: userData.u_name || '',
          email: userData.u_email || '',
          phone: userData.u_mobile ? userData.u_mobile.toString() : '',
          country: userData.u_country || '',
          gender: userData.u_gender || '',
          address: userData.u_address || '',
          currency: userData.u_currency || '',
        });
        console.log('profilee', profile);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error fetching profile', error.message);
    }
  };

  const handleEditProfile = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);

    if (!user_id) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    const payload = {
      u_currency: profile.currency,
      u_gender: profile.gender,
      u_address: profile.address,
      u_mobile: Number(profile.phone),
      u_country: profile.country,
    };

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/edit',
        payload,
        {
          headers: {
            user_id: user_id,
          },
        },
      );

      if (response.data.result) {
        console.log(profile, 'profileeee');
        setModalVisible(true);
      } else {
        console.log(profile, 'profileeee');
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  // Filtered country list based on search
  const filteredCountries =
    countries?.filter(country =>
      country?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Render Country Item
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

  // Function to close modal
  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name */}
      <Text style={styles.label}>{t('Full Name')}</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={text => setProfile({...profile, name: text})}
        editable={false}
      />

      {/* Currency Dropdown */}
      <Text style={styles.label}>{t('Currency')}</Text>
      <Dropdown
        style={[
          styles.dropdown,
          isCurrencyFocus && styles.focusedDropdown, // or {borderColor: AppColors.Yellow}
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.dropdownContainer} // Add this for list container
        itemContainerStyle={styles.dropdownItem} // Add this for individual items
        itemTextStyle={styles.dropdownItemText} // Add this for item text
        data={uniqueCurrencies}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isCurrencyFocus ? 'Select Currency' : '...'}
        searchPlaceholder="Search currency..."
        value={profile.currency}
        onFocus={() => setIsCurrencyFocus(true)}
        onBlur={() => setIsCurrencyFocus(false)}
        onChange={item => {
          setProfile({...profile, currency: item.value});
          setIsCurrencyFocus(false);
        }}
        renderLeftIcon={() => (
          <View style={styles.icon}>
            <Text style={styles.iconText}>💰</Text>
          </View>
        )}
      />

      {/* Email */}
      <Text style={styles.label}>{t('Email')}</Text>
      <TextInput
        style={styles.input}
        value={profile.email}
        keyboardType="email-address"
        onChangeText={text => setProfile({...profile, email: text})}
        editable={false}
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
          placeholder="123-456-7890"
          placeholderTextColor={AppColors.Grey}
          value={profile.phone || ''}
          onChangeText={text => setProfile({...profile, phone: text})}
          style={styles.phoneinput}
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
            value={profile.country}
            onChangeText={text => setProfile({...profile, country: text})}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>{t('Gender')}</Text>
          <TextInput
            style={styles.input}
            value={profile.gender || ''}
            onChangeText={text => setProfile({...profile, gender: text})}
          />
        </View>
      </View>

      {/* Address */}
      <Text style={styles.label}>{t('Address')}</Text>
      <TextInput
        style={styles.input}
        value={profile.address}
        onChangeText={text => setProfile({...profile, address: text})}
      />

      {/* SUBMIT Button */}
      <Button
        title={t('SUBMIT')}
        buttonStyle={styles.downloadButton}
        titleStyle={styles.buttonText}
        onPress={handleEditProfile}
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
                  {t('Profile Edit Successful')}!
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleBackToLogin}>
                  <Text style={styles.buttonText}>{t('Back To profile')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer1}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Country"
            placeholderTextColor={AppColors.Grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCountries}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCountryItem}
            contentContainerStyle={styles.list}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 10,
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
    backgroundColor: AppColors.Yellow,
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
  uploadImage: {
    width: 24,
    height: 24,
  },
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
    marginBottom: 25,
    resizeMode: 'contain',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6BCFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage1: {
    fontSize: 13,
    color: AppColors.red,
    marginBottom: 25,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 8, // Increase button padding
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18, // Increase font size
    color: 'white',
    fontFamily: 'serif',
    // fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  phoneinput: {
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginVertical: 10,
    color: AppColors.Black,
    width: '80%',
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
  countryItem: {padding: 10, borderBottomWidth: 1, borderColor: AppColors.Grey},
  countryText: {fontSize: 16, color: AppColors.Black},
  searchInput: {
    backgroundColor: AppColors.OffWhite,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    color: AppColors.Black,
  },
  modalContainer1: {flex: 1, padding: 20, backgroundColor: AppColors.Ash},
});

export default EditProfile;
