import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const Futureoption3 = ({navigation, route}) => {
  const {
    selectedOption,
    setSelectedOption,
    personalDetails,
    setPersonalDetails,
  } = useContext(CountryContext);
  console.log(selectedOption, personalDetails, 'apple');

  const {
    lp_id,
    lp_u_id,
    lp_percent,
    lp_amount,
    lp_duration,
    lp_project,
    lp_wf,
    lp_return,
    status,
    lp_profit_model
  } = route.params;

  console.log(lp_id,
    lp_u_id,
    lp_percent,
    lp_amount,
    lp_duration,
    lp_project,
    lp_wf,
    lp_return,
    lp_profit_model,
    status,"getttt this is gateway");

  const {t, i18n} = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+81');

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to validate personal details
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    idproof: '',
  });

  const validateFields = () => {
    const errors = {};

    if (!personalDetails?.fullName?.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!personalDetails?.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(personalDetails.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!personalDetails?.phoneNumber?.trim()) {
      errors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\+?\d{1,4}?\d{6,15}$/.test(personalDetails.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid phone number.';
    }
    if (!personalDetails?.address?.trim()) {
      errors.address = 'Address is required.';
    }
    if (!personalDetails?.idproof?.trim()) {
      errors.idproof = 'ID Proof is required.';
    }

    setValidationErrors(errors);

    return Object.keys(errors)?.length === 0;
  };

  const handleContinue = () => {
    if (validateFields()) {
      navigation.navigate('FutureOption4', {
        personalDetails,
        lp_id,
        lp_u_id,
        lp_percent,
        lp_amount,
        lp_duration,
        lp_project,
        lp_wf,
        lp_return,
        status,
        lp_profit_model
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPersonalDetails(prev => ({...prev, [field]: value}));

    if (field === 'email') {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Invalid email format.',
        }));
      } else {
        setValidationErrors(prev => ({...prev, email: ''})); // Clear error
      }
    }
  };

  const options = [
    {label: t('Notarization'), value: 'Notarization'},
    {label: t('Shares'), value: 'Shares'},
  ];

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
    countries?.filter(country =>
      country?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];
  // Render Country Item
  const renderCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setCountryCode(item.flag);
        setModalVisible(false);
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
        <Text style={styles.headerText}>{t('Invest Combination')}</Text>
      </View>

      <View style={styles.whiteContainer}>
        <View>
          <View style={styles.greyContainer}>
            <Text style={styles.stepText}>{t('Steps')} - 1/3</Text>
            <TouchableOpacity
              style={styles.optionButton}
              // onPress={() => setModalVisible(true)}
            >
              <Text style={styles.optionText}>{t('Any')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityContainer}>
            <Image
              source={AppImages.securitycard}
              style={styles.securityIcon}
            />
            <Text style={styles.securityText}>{t('Security Assurance')}</Text>
          </View>

          <View
            style={{
              backgroundColor: AppColors.Grey,
              width: '100%',
              borderWidth: 0.2,
              marginVertical: 7,
            }}></View>

          <View style={{marginTop: 20}}>
            <Text style={styles.labelText}>{t('Select Security Option')}</Text>
            <Dropdown
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownTextStyle}
              placeholderStyle={{color: AppColors.perfectgrey}}
              selectedTextStyle={{color: AppColors.darkgrey, fontSize: 14}}
              data={options}
              labelField="label"
              valueField="value"
              placeholder={t('Select Option')}
              value={selectedOption}
              onChange={item => setSelectedOption(item.value)}
            />
            {selectedOption && (
              <>
                <View style={styles.personalDetails}>
                  <View style={styles.securityContainer}>
                    <Image
                      source={AppImages.Personal}
                      style={styles.securityIcon}
                    />
                    <Text style={styles.securityText}>
                      {t('Personal Details')}
                    </Text>
                  </View>
                  <TextInput
                    placeholder={t('Full Name')}
                     maxLength={20}
                    placeholderTextColor={AppColors.Grey}
                    value={personalDetails.fullName}
                    onChangeText={value => handleInputChange('fullName', value)}
                    style={styles.input}
                  />
                  {validationErrors.fullName ? (
                    <Text style={styles.errorText}>
                      {validationErrors.fullName}
                    </Text>
                  ) : null}
                  <TextInput
                    placeholder={t('ID Proof')}
                     maxLength={20}
                    placeholderTextColor={AppColors.Grey}
                    value={personalDetails.idproof}
                    onChangeText={value => handleInputChange('idproof', value)}
                    style={styles.input}
                  />
                  {validationErrors.idproof ? (
                    <Text style={styles.errorText}>
                      {validationErrors.idproof}
                    </Text>
                  ) : null}
                  <TextInput
                    placeholder={t('Address')}
                     maxLength={50}
                    placeholderTextColor={AppColors.Grey}
                    value={personalDetails.address}
                    onChangeText={value => handleInputChange('address', value)}
                    style={styles.input}
                  />
                  {validationErrors.address ? (
                    <Text style={styles.errorText}>
                      {validationErrors.address}
                    </Text>
                  ) : null}
                  <View style={styles.phoneContainer}>
                    <TouchableOpacity
                      style={styles.countryCodeButton}
                      onPress={() => setModalVisible(true)}>
                      <Text style={styles.countryText}>{countryCode}</Text>
                    </TouchableOpacity>
                    <TextInput
                      placeholder={t('Phone Number')}
                      
                      placeholderTextColor={AppColors.Grey}
                      value={personalDetails.phoneNumber}
                      onChangeText={value =>
                        handleInputChange('phoneNumber', value)
                      }
                      style={styles.phoneinput}
                      keyboardType="phone-pad"
                      maxLength={15}
                    />
                  </View>
                  {validationErrors.phoneNumber ? (
                    <Text style={styles.errorText}>
                      {validationErrors.phoneNumber}
                    </Text>
                  ) : null}
                  <TextInput
                    placeholder={t('Email')}
                    placeholderTextColor={AppColors.Grey}
                    value={personalDetails.email}
                    onChangeText={value => handleInputChange('email', value)}
                    style={styles.input}
                    keyboardType="email-address"
                  />
                  {validationErrors.email ? (
                    <Text style={styles.errorText}>
                      {validationErrors.email}
                    </Text>
                  ) : null}
                </View>
              </>
            )}
          </View>
        </View>
        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            disabled={isLoading}
            onPress={handleContinue}>
            {isLoading ? (
              <ActivityIndicator size="small" color={AppColors.bordergreen} /> // Display loader when loading
            ) : (
              <Text style={styles.buttonText}>{t('Next')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* Country Code Modal */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
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
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCountryItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColors.backwhite, // Add uniform background color
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
    fontFamily: 'serif',
    top: '30%',
    alignSelf: 'center',
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
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: AppColors.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
  },
  nextButton: {
    backgroundColor: AppColors.Yellow,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
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
    marginVertical: 7,
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
  personalDetails: {marginTop: 20},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',

    color: AppColors.Black,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginVertical: 10,
    color: AppColors.Black,
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
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
export default Futureoption3;
