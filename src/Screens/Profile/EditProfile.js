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
import DropDownPicker from 'react-native-dropdown-picker';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [countryCode, setCountryCode] = useState('+81');
  const [items, setItems] = useState([
    {label: 'Passport', value: 'passport'},
    {label: 'National ID', value: 'national_id'},
    {label: 'Driving License', value: 'driving_license'},
  ]);
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
            user_id: user_id, // Replace with actual user_id
          },
        },
      );

      if (response.data.result) {
        const userData = response.data.data[0]; // Assuming first user
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
  // ✅ Fix: Function to close modal
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

      {/* Currency Name */}

      <Text style={styles.label}>{t('Currency')}</Text>
      <TextInput
        style={styles.input}
        value={profile.currency}
        onChangeText={text => setProfile({...profile, currency: text})}
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
