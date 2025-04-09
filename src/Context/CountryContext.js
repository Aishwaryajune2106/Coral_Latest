import moment from 'moment';
import React, {createContext, useEffect, useState} from 'react';
import {I18nManager} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../Constants/AppStrings';

const CountryContext = createContext();

export const CountryProvider = ({children}) => {
  const {i18n} = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (storedLanguage) {
        setLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async lng => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
    await AsyncStorage.setItem('selectedLanguage', lng);

    if (lng === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  const [selectedCountry, setSelectedCountry] = useState({
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
  });
  // Derived property for formatted duration

  const [frontImage, setFrontImage] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const [backImage, setBackImage] = useState(null);
  const [dob, setDob] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    nameAsPerBank: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    swiftCode: '',
    bankBranch: '',
    uploadedStatement: null,
  });
  const [dpiPassword, setDpiPassword] = useState(['', '', '', '']);
  const [verificationMethod, setVerificationMethod] = useState(
    'National Identity Card',
  );

  // New states for investment plan
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [duration, setDuration] = useState(null);
  const [profitModal, setProfitModal] = useState('');
  const [withdrawalFrequency, setWithdrawalFrequency] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [personalDetails, setPersonalDetails] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [percentageReturn, setPercentageReturn] = useState('');
  const [selectedCiIndustry, setSelectedCiIndustry] = useState(null);
  const [selectedOptiony, setSelectedOptiony] = useState('Any');
  const [isPinCreated, setIsPinCreated] = useState(false);

  const setPinCreated = status => {
    setIsPinCreated(status);
  };
  useEffect(async () => {
    setIsPinCreated(await AsyncStorage.getItem(AppStrings.IS_MPIN));
  }, []);
  const formattedDuration = duration
    ? moment(duration).format('DD-MM-YYYY')
    : '';
  // Function to reset investment data
  const resetInvestmentData = () => {
    setInvestmentAmount('');
    setDuration(null);
    setProfitModal('');
    setWithdrawalFrequency('');
  };

  // Function to set image with URI, type, and name
  const handleImageUpload = (image, type, name) => {
    return {
      uri: image.uri,
      type: type,
      name: name,
    };
  };

  return (
    <CountryContext.Provider
      value={{
        language,
        changeLanguage,
        selectedCountry,
        setSelectedCountry,
        frontImage,
        setFrontImage,
        backImage,
        setBackImage,
        dob,
        setDob,
        uploadedPhoto,
        setUploadedPhoto,
        bankDetails,
        setBankDetails,
        dpiPassword,
        setDpiPassword,
        verificationMethod,
        setVerificationMethod,
        handleImageUpload,
        investmentAmount,
        setInvestmentAmount,
        duration,
        setDuration,
        formattedDuration,
        profitModal,
        setProfitModal,
        withdrawalFrequency,
        setWithdrawalFrequency,
        resetInvestmentData,
        selectedOption,
        setSelectedOption,
        personalDetails,
        setPersonalDetails,
        returnAmount,
        setReturnAmount,
        percentageReturn,
        setPercentageReturn,
        selectedCiIndustry,
        setSelectedCiIndustry,
        selectedOptiony,
        setSelectedOptiony,
        isPinCreated,
        setPinCreated,
        selectedInvestment,
        setSelectedInvestment,
      }}>
      {children}
    </CountryContext.Provider>
  );
};

export default CountryContext;
