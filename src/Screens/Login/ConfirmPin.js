import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';

const ConfirmPin = ({route, navigation}) => {
  const {t, i18n} = useTranslation();
  const [pin, setPin] = useState('');
  const {isPinCreated, setPinCreated} = useContext(CountryContext);
  console.log(isPinCreated, 'isPinCreated');

  const [error, setError] = useState(''); // State to store the error message
  const maxPinLength = 4;
  const {pin: createdPin} = route.params; // Retrieve the created PIN from navigation params
  console.log(createdPin, 'pinnnn');

  const handleNumberPress = async num => {
    if (pin?.length < maxPinLength) {
      const newPin = pin + num;
      setPin(newPin);
      setError(''); // Clear any previous error

      if (newPin?.length === maxPinLength) {
        if (newPin === createdPin) {
          let ispin = await AsyncStorage.setItem(AppStrings.IS_MPIN, 'true');

          navigation.navigate('SetPinSuccessScreen'); // Navigate to Home if PINs match
        } else {
          setError('Wrong PIN. Please try again.'); // Set error message
          setTimeout(() => setPin(''), 500); // Clear PIN after a short delay
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(''); // Clear any error on backspace
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Confirm PIN')}</Text>
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.numpadContainer}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [null, 0, 'X'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.numberButton}
                onPress={() =>
                  item === 'X' ? handleBackspace() : handleNumberPress(item)
                }>
                <Text style={styles.numberText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.Black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: AppColors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: AppColors.Grey,
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
    color: AppColors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: AppColors.red,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ConfirmPin;
