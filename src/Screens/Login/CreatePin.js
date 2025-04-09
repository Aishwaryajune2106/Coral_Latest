import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';

const CreatePin = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const maxPinLength = 4;

  const handleNumberPress = async num => {
    if (pin?.length < maxPinLength) {
      const newPin = pin + num; // Concatenate the new number to the PIN
      setPin(newPin);

      if (newPin?.length === maxPinLength) {
        // Send PIN to the API
        await submitPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };
  //.............CreatePIN..................//

  const submitPin = async pin => {
    setIsLoading(true);

    try {
      // Retrieve user_id from storage or context
      const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/easy-pin/setup',
        {pin},
        {
          headers: {
            user_id: userId, // Include user_id in headers
          },
        },
      );

      const data = response.data;

      if (data.result) {
        // If result is true, navigate to ConfirmPinScreen
        navigation.navigate('ConfirmPinScreen', {pin: pin}); // Pass PIN to ConfirmPinScreen
      } else {
        // If result is false, log the error message
        console.log(data.message);
        setPin(''); // Reset PIN on failure
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
      setPin(''); // Reset PIN on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Create PIN')}</Text>
      <View style={styles.dotsContainer}>
        {Array.from({length: maxPinLength})?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: pin.length > index ? '#fff' : '#333'},
            ]}
          />
        ))}
      </View>
      <View style={styles.numpadContainer}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [null, 0, 'X'],
        ]?.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row?.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.numberButton}
                onPress={() =>
                  item === 'X' ? handleBackspace() : handleNumberPress(item)
                }
                disabled={item === null || isLoading}>
                <Text style={styles.numberText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>{t('Back to Login')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  numpadContainer: {
    width: '80%',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numberButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  numberText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default CreatePin;
