import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const KycOne = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {
    selectedCountry,
    setSelectedCountry,
    verificationMethod,
    setVerificationMethod, // Access the function to update the verification method
  } = useContext(CountryContext);

  console.log(selectedCountry, verificationMethod, 'heloooooo');

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle method change, example if using a dropdown or button to change verification method
  const handleVerificationMethodChange = method => {
    setVerificationMethod(method);
  };

  const countries = [
    {name: 'Bahrain', flag: '🇧🇭', currency: 'BHD'},
    {name: 'Kuwait', flag: '🇰🇼', currency: 'KWD'},
    {name: 'Oman', flag: '🇴🇲', currency: 'OMR'},
    {name: 'Qatar', flag: '🇶🇦', currency: 'QAR'},
    {name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR'},
    {name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED'},
    {name: 'Yemen', flag: '🇾🇪', currency: 'YER'},
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
    {name: 'United States', flag: '🇺🇸', currency: 'USD'},
    {name: 'Philippines', flag: '🇵🇭', currency: 'PHP'},
  ];

  const handleCountryChange = country => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const renderCountry = ({item}) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountryChange(item)}>
      <Text style={styles.countryText}>{item.flag}</Text>
      <Text style={styles.countryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  // Filter countries based on the search query
  const filteredCountries = countries?.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={AppImages.greaterarrow}
            style={styles.backArrowImage}
          />
        </TouchableOpacity> */}
        <Text style={styles.title}>{t('Proof of Residency')}</Text>

        <Text style={styles.label}>{t('Nationality')}</Text>
        <TouchableOpacity
          style={styles.nationalityContainer}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.nationalityText}>
            {selectedCountry.flag} {selectedCountry.name}
          </Text>
          <Text style={styles.currencyText}>{selectedCountry.currency}</Text>
          <Text style={styles.changeText}>{t('Change')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>{t('Verification method')}</Text>
        <View style={styles.verificationMethods}>
          {[
            t('National Identity Card'),
            t('Passport'),
            t('Driver License'),
          ]?.map(method => (
            <TouchableOpacity
              key={method}
              style={[
                styles.verificationOption,
                verificationMethod === method && styles.selectedOption,
              ]}
              onPress={() => handleVerificationMethodChange(method)}>
              <View
                style={[
                  styles.radioCircle,
                  verificationMethod === method && styles.selectedCircle,
                ]}
              />
              <Text style={styles.optionText}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('KycTwoScreen')}>
          <Text style={styles.continueButtonText}>{t('CONTINUE')}</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search country"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={AppColors.Grey}
                />
                <FlatList
                  data={filteredCountries}
                  keyExtractor={item => item.name}
                  renderItem={renderCountry}
                  style={styles.countryList}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 20,
    color: AppColors.Black,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  nationalityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.LightBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  nationalityText: {
    flex: 1,
    fontSize: 16,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  currencyText: {
    marginRight: 10,
    color: AppColors.Grey,
  },
  changeText: {
    color: AppColors.Blue,
    fontWeight: 'bold',
  },
  verificationMethods: {
    marginBottom: 20,
  },
  verificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.LightBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: AppColors.Blue,
    borderWidth: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: AppColors.Grey,
    marginRight: 10,
  },
  selectedCircle: {
    borderColor: AppColors.Blue,
    backgroundColor: AppColors.Blue,
  },
  optionText: {
    fontSize: 16,
    color: AppColors.Black,
    fontFamily: 'serif',
  },
  continueButton: {
    backgroundColor: AppColors.Yellow,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
    fontFamily: 'serif',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    marginVertical: '30%',
  },
  searchInput: {
    backgroundColor: AppColors.OffWhite,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    color: AppColors.Black,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.OffWhite,
  },
  countryText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'serif',
    color: AppColors.Black,
  },
  backButton: {
    position: 'absolute',

    top: -40,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  countryList: {
    color: AppColors.Black,
  },
});

export default KycOne;
