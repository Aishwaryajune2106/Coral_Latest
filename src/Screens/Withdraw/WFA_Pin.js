import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../Components/CustomAlert';
import {useTranslation} from 'react-i18next';

const WFA_Pin = ({navigation, route}) => {
  const {t} = useTranslation();
  const {selectedBankId, enteredAmount} = route.params;

  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({title: '', message: ''});
  const [loading, setLoading] = useState(false); // State for loader
  const MAX_LENGTH = 4;

  const API_URL = 'https://coral.lunarsenterprises.com/wealthinvestment/user/withdrawal';

  const handlePress = value => {
    setErrorMessage('');
    if (value === 'clear') {
      setPin(pin.slice(0, -1));
    } else if (value !== null && pin?.length < MAX_LENGTH) {
      setPin(pin + value);
    }
  };
  //...............Withdraw Api...................//

  const handleWithdraw = async () => {
    if (pin?.length === MAX_LENGTH) {
      setLoading(true);
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id,
          },
          body: JSON.stringify({
            amount: enteredAmount,
            bank_id: selectedBankId,
            wfa_password: parseInt(pin),
          }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok && data.result) {
          setAlertData({
            title: 'Success',
            message: data.message,
          });
          setAlertVisible(true);
          navigation.navigate('DashBoardStack');
        } else {
          setAlertData({
            title: 'Error',
            message: data.message || 'PIN is incorrect',
          });
          setAlertVisible(true);
        }
      } catch (error) {
        setLoading(false);
        setAlertData({
          title: 'Error',
          message: 'Something went wrong. Please try again later.',
        });
        setAlertVisible(true);
      }
    } else {
      setAlertData({
        title: 'Incomplete PIN',
        message: 'Please enter the complete PIN',
      });
      setAlertVisible(true);
    }
  };

  const keypad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [null, 0, 'clear'],
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={AppImages.Blackbackicon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Cash Out</Text>
        </View> */}

        {/* PIN Title */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <Text style={styles.title}>{t('WFA PIN')}</Text>
        </View>

        {/* PIN Input Boxes */}
        <View style={styles.pinContainer}>
          {Array(MAX_LENGTH)
            .fill('')
            ?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinBox,
                  {borderColor: index === pin.length ? '#000' : '#ccc'},
                ]}>
                <Text style={styles.pinText}>{pin[index] || ''}</Text>
              </View>
            ))}
        </View>

        {/* Loader */}
        {loading && <ActivityIndicator size="large" color={AppColors.Yellow} />}

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/* Keypad */}
        <View style={styles.numberPad}>
          {keypad?.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, keyIndex) => (
                <TouchableOpacity
                  key={keyIndex}
                  style={[
                    styles.key,
                    key === 'clear' && {backgroundColor: '#FFCCCC'},
                  ]}
                  onPress={() => handlePress(key)}
                  disabled={key === null}>
                  <Text style={styles.keyText}>
                    {key === 'clear' ? '×' : key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WithdrawverifyScreen')}>
          <Text style={styles.forgotPin}>{t('Forgot Pin')}?</Text>
        </TouchableOpacity>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdraw}
          disabled={loading}>
          <Text style={styles.withdrawText}>{t('WITHDRAW')}</Text>
        </TouchableOpacity>

        {/* Custom Alert */}
        <CustomAlert
          visible={alertVisible}
          onClose={() => {
            setAlertVisible(false);
            if (alertData.title === 'Success') {
              navigation.navigate('DashBoardStack');
            }
          }}
          title={alertData.title}
          message={alertData.message}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    height: 60,
    position: 'relative',
    backgroundColor: '#fff',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    position: 'absolute',
    top: '45%',

    marginLeft: 60,
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    fontFamily: 'serif',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pinBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  numberPad: {
    width: '100%',
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  key: {
    width: 60,
    height: 60,
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  keyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
    fontFamily: 'serif',
  },
  forgotPin: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  withdrawButton: {
    width: '90%',
    padding: 15,
    backgroundColor: AppColors.Yellow,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  withdrawText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'serif',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'serif',
  },
});

export default WFA_Pin;
