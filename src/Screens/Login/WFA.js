import React, {useContext, useEffect, useRef, useState} from 'react';
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

import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const WFA = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {dpiPassword, setDpiPassword} = useContext(CountryContext);
  console.log(dpiPassword, 'dpiPassword');

  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const passwordRefs = useRef([]);

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem(AppStrings.USER_ID);
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = () => {
    // Join the password array into a single string
    const joinedPassword = dpiPassword.join('');
    console.log(joinedPassword, 'Joined WFA Password');

    // Check if WFA password is complete
    if (joinedPassword?.length === dpiPassword?.length) {
      setError('');
      navigation.navigate('YourphotoScreen');
    } else {
      setError('Please fill in the complete WFA password');
    }
  };

  const handleTextChange = (text, index) => {
    const newPassword = [...dpiPassword];
    newPassword[index] = text;
    setDpiPassword(newPassword);

    if (text && index < dpiPassword?.length - 1) {
      // Move focus to the next TextInput
      passwordRefs.current[index + 1]?.focus();
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}>
      {/* Header */}
      {/* <View style={styles.header}>
   
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={AppImages.greaterarrow}
            style={styles.backArrowImage}
          />
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={styles.headerTitle}>KYC</Text>
        </View>
      </View> */}

      {/* Title */}
      <Text style={styles.title}>{t('CUSTOM ID')}</Text>
      <View style={styles.progressBar}>
        <View style={styles.activeProgress} />
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: AppColors.Grey,
          padding: 20,
          borderRadius: 10,
          backgroundColor: AppColors.white,
          shadowColor: AppColors.Black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginTop: 20,
        }}>
        <Text style={styles.inputtitle}>{t('User ID')}</Text>
        <TextInput
          style={styles.input}
          value={userId}
          placeholder={t('User ID')}
          placeholderTextColor={AppColors.Grey}
          editable={false}
        />
        <Text style={styles.inputtitle}>{t('WFA Password')}</Text>
        <View style={styles.passwordContainer}>
          {dpiPassword?.map((value, index) => (
            <TextInput
              key={index}
              ref={el => (passwordRefs.current[index] = el)}
              style={styles.digitInput}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={text => {
                // Allow only numeric input
                if (/^\d*$/.test(text)) {
                  handleTextChange(text, index);
                }
              }}
              onSubmitEditing={() => {
                if (index < dpiPassword?.length - 1) {
                  passwordRefs.current[index + 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>{t('Submit')}</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          {t(
            'If you are facing any difficulties, please get in touch with us on',
          )}{' '}
          <Text style={styles.whatsapp}>operations@coraluae.com</Text>.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
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
    color: AppColors.miniblue,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.OffWhite,
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activeProgress: {
    height: '100%',
    width: '79%',
    backgroundColor: AppColors.miniblue,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: AppColors.Black,
  },
  description: {
    fontSize: 14,
    color: AppColors.darkgrey,
    marginBottom: 20,
    marginTop: 5,
  },

  inputtitle: {
    fontSize: 14,
    color: AppColors.darkgrey,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'serif',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
    color: AppColors.Black,
  },
  uploadBox: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  uploadButton: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    backgroundColor: AppColors.darkgrey,
    padding: 10,
    borderRadius: 10,
  },
  note: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: AppColors.miniblue,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: AppColors.Grey,
  },
  whatsapp: {
    color: AppColors.miniblue,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  imagePath: {
    textAlign: 'center',
    fontSize: 12,
    color: AppColors.Grey,
    marginTop: 5,
  },
  declarationContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  declarationText: {
    fontSize: 11,
    color: AppColors.Black,
    flexWrap: 'wrap',
    right: '90%',
    marginHorizontal: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  digitInput: {
    borderWidth: 1,
    borderColor: AppColors.violet,
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    width: 50,
    fontSize: 18,
    color: AppColors.Black,
  },
});

export default WFA;
