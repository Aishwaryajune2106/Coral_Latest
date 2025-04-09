import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import '../../i18n/i18n';

const LanguageList = () => {
  const {t, i18n} = useTranslation();
  const [selectedId, setSelectedId] = useState(i18n.language);
  const [selectedLabel, setSelectedLabel] = useState('');

  const languages = [
    {id: 'en', label: 'English (US)'},
    // {id: 'hi', label: 'हिन्दी'},
    {id: 'ar', label: 'العربية'},
  ];

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
      const storedLabel = await AsyncStorage.getItem('selectedLanguageLabel');

      if (storedLanguage) {
        setSelectedId(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
      if (storedLabel) {
        setSelectedLabel(storedLabel);
      }
    };
    fetchLanguage();
  }, []);

  const changeLanguage = async lng => {
    const selectedLang = languages.find(lang => lang.id === lng);
    if (!selectedLang) return;

    await i18n.changeLanguage(lng);
    setSelectedId(lng);
    setSelectedLabel(selectedLang.label); // Update the label
    await AsyncStorage.setItem('selectedLanguage', lng);
    await AsyncStorage.setItem('selectedLanguageLabel', selectedLang.label); // Store label

    if (lng === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }

    Toast.show(`Language changed to ${selectedLang.label}`, Toast.LONG);
  };

  const updateLanguage = async (selectedLanguage) => {
    try {
      const user_id = await AsyncStorage.getItem('USER_ID'); // Replace with actual key
      if (!user_id) {
        Toast.show('User ID not found', Toast.LONG);
        return;
      }

      const selectedLang = languages.find(lang => lang.id === selectedLanguage);
      if (!selectedLang) return;

      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/updateLanguage',
        { u_language: selectedLanguage },
        { headers: { user_id } }
      );

      if (response.data.result) {
        Toast.show(response.data.message, Toast.LONG);
        await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
        await AsyncStorage.setItem('selectedLanguageLabel', selectedLang.label);
        changeLanguage(selectedLanguage);
      } else {
        Toast.show('Failed to update language', Toast.LONG);
      }
    } catch (error) {
      console.error('Error updating language:', error);
      Toast.show('Something went wrong. Please try again.', Toast.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Language</Text>

      {languages?.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.languageRow}
          onPress={() => updateLanguage(item.id)}>
          <Text style={styles.languageText}>{item.label}</Text>
          <View
            style={[
              styles.radioCircle,
              selectedId === item.id && styles.selectedRadio,
            ]}
          />
        </TouchableOpacity>
      ))}

      {/* <View style={styles.centeredView}>
        <Text style={styles.selectedLangText}>Selected Language: {selectedLabel}</Text>
        <Text style={styles.welcomeText}>{t('welcome')}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    fontFamily: 'serif',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  languageText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'serif',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2A64F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#2A64F6',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLangText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A64F6',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LanguageList;
