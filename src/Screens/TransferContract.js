import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const TransferContract = ({route}) => {
  const {contractId} = route.params;
  console.log(contractId, 'contractId');

  const [nomineeList, setNomineeList] = useState([]);
  const [newNominee, setNewNominee] = useState({
    fullName: '',
    relationship: '',
    idNumber: '',
    contactDetails: '',
    address: '',
  });
  const [isAddingNominee, setIsAddingNominee] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const navigation= useNavigation()

  // Fetch nominees from API
  useEffect(() => {
    const fetchNomineeList = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/list',
          {},
          {
            headers: {
              user_id: user_id,
            },
          },
        );

        if (response.data.result) {
          const fetchedNominees = response?.data?.data?.map(nominee => ({
            id: nominee.n_id, // Add unique ID for selection
            fullName: nominee.n_name,
            relationship: nominee.n_relation,
            idNumber: nominee.n_emiates_id,
            contactDetails: nominee.n_mobile.toString(),
            address: nominee.n_address,
          }));
          setNomineeList(fetchedNominees);
        } else {
          Alert.alert(
            'Error',
            response.data.message || 'Failed to fetch data.',
          );
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Error',
          'Unable to fetch nominee list. Please try again later.',
        );
      }
    };

    fetchNomineeList();
  }, []);

  const handleAddNominee = () => {
    const {fullName, relationship, idNumber, contactDetails, address} =
      newNominee;

    if (
      !fullName ||
      !relationship ||
      !idNumber ||
      !contactDetails ||
      !address
    ) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    setNomineeList([...nomineeList, {...newNominee, id: Date.now()}]); // Add unique ID for new nominee
    setNewNominee({
      fullName: '',
      relationship: '',
      idNumber: '',
      contactDetails: '',
      address: '',
    });
    setIsAddingNominee(false);
    Alert.alert('Success', 'Nominee details added successfully!');
  };

  const handleTransfer = async () => {
    if (!selectedNominee) {
      Toast.showWithGravity(
        'Please select a nominee before transferring.',
        Toast.SHORT,
        Toast.CENTER,
      );
      return;
    }

    const user_id = await AsyncStorage.getItem('user_id');
    const ui_id = contractId;
    const n_id = selectedNominee.id;

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/transfer/contract',
        { ui_id, n_id },
        {
          headers: { user_id: user_id },
        },
      );

      if (response.data.result) {
        Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.CENTER);
        navigation.goBack();
      } else {
        Toast.showWithGravity(
          response.data.message || 'Transfer failed.',
          Toast.SHORT,
          Toast.CENTER,
        );
      }
    } catch (error) {
      console.error(error);
      Toast.showWithGravity(
        'Unable to process the transfer. Please try again.',
        Toast.SHORT,
        Toast.CENTER,
      );
    }
  };

  
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Transfer Contract</Text>

      {nomineeList?.length === 0 && !isAddingNominee && (
        <View style={styles.noNomineeContainer}>
          <Text style={styles.noNomineeText}>
            No nominee details available.
          </Text>
        </View>
      )}

      <View style={styles.listAndButtonContainer}>
        {nomineeList?.length > 0 && (
          <FlatList
            data={nomineeList}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.nomineeCard}
                onPress={() => setSelectedNominee(item)}>
                <View style={styles.nomineeRow}>
                  <View style={styles.radioButtonContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedNominee?.id === item.id &&
                          styles.radioButtonSelected,
                      ]}
                    />
                  </View>
                  <View style={styles.nomineeDetails}>
                    <Text style={styles.nomineeDetail}>
                      <Text style={styles.label}>Full Name: </Text>
                      {item.fullName}
                    </Text>
                    <Text style={styles.nomineeDetail}>
                      <Text style={styles.label}>Relationship: </Text>
                      {item.relationship}
                    </Text>
                    <Text style={styles.nomineeDetail}>
                      <Text style={styles.label}>ID/Passport No: </Text>
                      {item.idNumber}
                    </Text>
                    <Text style={styles.nomineeDetail}>
                      <Text style={styles.label}>Contact Details: </Text>
                      {item.contactDetails}
                    </Text>
                    <Text style={styles.nomineeDetail}>
                      <Text style={styles.label}>Residential Address: </Text>
                      {item.address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity
          style={styles.addNomineeButton}
          onPress={() => setIsAddingNominee(true)}>
          <Text style={styles.addNomineeText}>Add Nominee</Text>
        </TouchableOpacity>
        {nomineeList?.length > 0 && (
          <TouchableOpacity
            style={styles.transferButton}
            onPress={handleTransfer}>
            <Text style={styles.transferText}>Transfer</Text>
          </TouchableOpacity>
        )}
      </View>

      {isAddingNominee && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={newNominee.fullName}
            placeholderTextColor="#888" 
            onChangeText={text =>
              setNewNominee({...newNominee, fullName: text})
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Relationship"
            placeholderTextColor="#888" 
            value={newNominee.relationship}
            onChangeText={text =>
              setNewNominee({...newNominee, relationship: text})
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Emirates ID/Passport No"
            placeholderTextColor="#888" 
            value={newNominee.idNumber}
            onChangeText={text =>
              setNewNominee({...newNominee, idNumber: text})
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Details"
            placeholderTextColor="#888" 
            value={newNominee.contactDetails}
            onChangeText={text =>
              setNewNominee({...newNominee, contactDetails: text})
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Residential Address"
            placeholderTextColor="#888" 
            value={newNominee.address}
            onChangeText={text => setNewNominee({...newNominee, address: text})}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddNominee}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
   
    </View>
  );
};

export default TransferContract;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  noNomineeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNomineeText: {
    fontSize: 16,
    color: '#888',
  },
  addNomineeButton: {
    backgroundColor: '#e5c957', // Green color for positive actions
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addNomineeText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nomineeCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nomineeDetail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#e5c957',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  listAndButtonContainer: {
    flex: 1,
    marginBottom: 20,
  },
  radioButtonContainer: {
    alignSelf: 'center',
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#78c1e9',
    backgroundColor: '#FFF',
  },
  radioButtonSelected: {
    backgroundColor: '#78c1e9',
  },
  transferButton: {
    backgroundColor: '#78c1e9',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transferText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nomineeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonContainer: {
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#78c1e9',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#78c1e9',
  },
  nomineeDetails: {
    flex: 1,
  },
});
