import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import AppImages from '../Constants/AppImages';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const BankList = ({route}) => {
  const navigation = useNavigation();
  const [bankDetails, setBankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const {withdrawAmount} = route.params || {};

  console.log('Withdraw Amount:', withdrawAmount);

  useFocusEffect(
    useCallback(() => {
      fetchBankList();
    }, []),
  );

  const fetchBankList = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    try {
      if (!user_id) {
        console.error('User ID is missing. Cannot fetch bank list.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        user_id: user_id,
      };

      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/list',
        {},
        {headers},
      );

      if (response.data.result) {
        const fetchedBanks = response?.data?.list?.map(bank => ({
          id: bank.b_id,
          bankName: bank.b_name,
          branchName: bank.b_branch,
          accountNumber: bank.b_account_no,
          currency: bank.b_currency,
          ibanOrCode: bank.b_ifsc_code || '',
          swiftCode: bank.b_swift_code || '',
        }));

        setBankDetails(fetchedBanks);
        console.log('Fetched Banks:', fetchedBanks);
      } else {
        console.error('Failed to fetch bank list:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching bank list:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async id => {
    const user_id = await AsyncStorage.getItem('user_id');
    const headers = {user_id};

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/delete',
        {b_id: id},
        {headers},
      );

      if (response.data.result) {
        setBankDetails(bankDetails.filter(details => details.id !== id));
        if (selectedBankId === id) {
          setSelectedBankId(bankDetails?.length > 1 ? bankDetails[0].id : null);
        }
        Toast.show('Bank details deleted successfully.');
      } else {
        console.error('Failed to delete bank:', response.data.message);
        Toast.show(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
      Toast.show('Failed to delete bank. Please try again.');
    }
  };

  const handleSelectBank = id => {
    setSelectedBankId(id);
  };

  const handleProceedToWithdrawal = async () => {
    const user_id = await AsyncStorage.getItem('user_id');

    if (!selectedBankId || !withdrawAmount) {
      Toast.show('Please select a bank and enter a valid withdrawal amount.');
      return;
    }

    try {
      const headers = {user_id};
      const body = {
        amount: withdrawAmount.toString(),
        bank_id: selectedBankId,
      };

      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/withdrawal',
        body,
        {headers},
      );

      if (response.data.result) {
        Toast.show(response.data.message);
        navigation.goBack(); // Navigate back after successful submission
      } else {
        Toast.show(response.data.message);
      }
    } catch (error) {
      console.error(
        'Error submitting withdrawal request:',
        error.message || error,
      );
      Toast.show(
        'Failed to submit withdrawal request. Please try again later.',
      );
    }
  };

  return (
    <LinearGradient
      colors={['#78c1e9', '#b8dff5']}
      style={styles.gradientBackground}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 'auto'}}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : bankDetails && bankDetails?.length > 0 ? (
          bankDetails?.map(details => (
            <View key={details.id} style={styles.detailsContainer}>
              <RadioButton
                value={details.id}
                status={selectedBankId === details.id ? 'checked' : 'unchecked'}
                onPress={() => handleSelectBank(details.id)}
              />
              <View style={styles.detailsContent}>
                <Text style={styles.detailsText}>Bank: {details.bankName}</Text>
                <Text style={styles.detailsText}>
                  Branch: {details.branchName}
                </Text>
                <Text style={styles.detailsText}>
                  Account No: {details.accountNumber}
                </Text>
                <Text style={styles.detailsText}>
                  Currency: {details.currency}
                </Text>
                <Text style={styles.detailsText}>
                  IBAN/Code: {details.ibanOrCode}
                </Text>
                <Text style={styles.detailsText}>
                  SWIFT Code: {details.swiftCode}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDelete(details.id)}
                  style={styles.deleteButton}>
                  <Image source={AppImages.Trash} style={styles.trashIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noBankDetailsText}>
            No bank details available. Please Add Bank for further Procedure
          </Text>
        )}

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => navigation.navigate('Newbank')}>
          <Text style={styles.addNewButtonText}>+ Add New Bank Details</Text>
        </TouchableOpacity>

        {selectedBankId && (
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedToWithdrawal}>
            <Text style={styles.proceedButtonText}>Proceed for Withdrawal</Text>
          </TouchableOpacity>
        )}
        <View style={{marginBottom: 30}}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,

    padding: 20,
  },
  noBankDetailsText: {
    fontSize: 16,
    color: '#6c757d', // Subtle gray color
    textAlign: 'center',
    marginVertical: 20,
  },

  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#78c1e9',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 15,
  },
  detailsContent: {
    flex: 1,
    paddingLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  trashIcon: {
    width: 20,
    height: 20,
  },
  addNewButton: {
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addNewButtonText: {
    color: '#78c1e9',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  proceedButton: {
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 5,

    alignItems: 'center',
    marginVertical: 10,
  },
  proceedButtonText: {
    color: '#78c1e9',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  loadingText: {
    color: '#78c1e9',
    fontSize: 18,
    fontFamily: 'serif',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default BankList;
