import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AppStrings from '../../Constants/AppStrings';
import {useTranslation} from 'react-i18next';

const ForgotPin = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [pin, setPin] = useState('');
  const [isPinCorrect, setIsPinCorrect] = useState(null); // Track if the PIN is correct
  const [loading, setLoading] = useState(false);
  const maxPinLength = 4;

  //..................Enter PIN APII...............//

  const validatePin = async newPin => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      setLoading(true); // Start loading
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/easy-pin/check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
          body: JSON.stringify({pin: parseInt(newPin, 10)}), // Ensure PIN is a number
        },
      );
      const data = await response.json();
      setLoading(false); // Stop loading

      if (data.result) {
        setIsPinCorrect(true);
        navigation.navigate('DashBoardStack'); // Navigate on success
      } else {
        setIsPinCorrect(false);
      }
    } catch (error) {
      setLoading(false); // Stop loading on error
      console.error('Error validating PIN:', error);
    }
  };

  const handleNumberPress = num => {
    if (pin?.length < maxPinLength) {
      const newPin = pin + num; // Concatenate the new number to the PIN
      setPin(newPin);

      if (newPin?.length === maxPinLength) {
        validatePin(newPin); // Validate PIN when max length is reached
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setIsPinCorrect(null); // Reset validation on backspace
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Enter PIN')}</Text>
      <View style={styles.dotsContainer}>
        {Array.from({length: maxPinLength})?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  pin?.length > index
                    ? isPinCorrect === null
                      ? '#9A4DFF'
                      : isPinCorrect
                      ? 'green'
                      : 'red'
                    : '#333',
              },
            ]}
          />
        ))}
      </View>
      {loading && (
        <Text style={styles.loadingText}>{t('Validating PIN...')}</Text>
      )}
      {isPinCorrect === false && (
        <Text style={styles.errorText}>{t('Wrong PIN')}</Text>
      )}
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
                disabled={item === null}>
                <Text style={styles.numberText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPinNumScreen')}>
        <Text style={styles.backToLogin}>{t('Forgot Your PIN Code')}?</Text>
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
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  loadingText: {
    color: 'yellow',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ForgotPin;
