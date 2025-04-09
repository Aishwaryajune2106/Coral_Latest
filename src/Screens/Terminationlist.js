import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Terminationlist = () => {
  const [contractDetails, setContractDetails] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data from the API
    const fetchContracts = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/withdraw/history',
          {},
          {
            headers: {user_id: user_id},
          },
        );
        console.log(user_id, 'user_id');
        console.log(response.data, 'investoryyy');
        if (response.data.result) {
          const investHistory = response.data.investhistory;
          const formattedContracts = investHistory?.map(contract => ({
            id: contract.ui_id,
            contractName: `Contract Type: ${contract.ui_type}`,
            contractDetails: `Amount: ${contract.ui_amount}, Return: ${contract.ui_return}, Duration: ${contract.ui_duration} months`,
          }));

          setContractDetails(formattedContracts);
        } else {
          // Alert.alert('Error', response.data.message);
        }
      } catch (error) {
        // Alert.alert('Error', 'Failed to fetch contract data');
        console.error(error);
      }
    };

    fetchContracts();
  }, []);

  const handleSelectContract = id => {
    setSelectedContractId(id);
  };

  const handleSubmit = () => {
    if (!selectedContractId) {
      Alert('Please select a contract to proceed.');
    } else {
      // Navigate to the Termination screen with selectedContractId
      navigation.navigate('Termination', {contractId: selectedContractId});
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
        {contractDetails?.length === 0 ? (
          // Display message if no contracts are found
          <View style={styles.noContractContainer}>
            <Text style={styles.noContractText}>
              No contracts found, please invest.
            </Text>
           
          </View>
        ) : (
          // Display list of contracts
          contractDetails?.map(details => (
            <View key={details.id} style={styles.detailsContainer}>
              <RadioButton
                value={details.id}
                status={
                  selectedContractId === details.id ? 'checked' : 'unchecked'
                }
                onPress={() => handleSelectContract(details.id)}
              />
              <View style={styles.detailsContent}>
                <Text style={styles.detailsText}>{details.contractName}</Text>
                <Text style={styles.detailsText}>
                  {details.contractDetails}
                </Text>
              </View>
            </View>
          ))
        )}

        {selectedContractId && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Contract</Text>
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
  submitButton: {
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitButtonText: {
    color: '#78c1e9',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  noContractContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  noContractText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },

  investButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  
});

export default Terminationlist;
