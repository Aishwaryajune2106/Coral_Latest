import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Investstep1 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [securityOption, setSecurityOption] = useState('');
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    passportId: '',
    nationalId: '',
    residentialAddress: '',
    phone: '',
    email: '',
  });
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyId: '',
    nationalId: '',
    licenseNumber: '',
    legalNumber: '',
  });
  const [bankAccount, setBankAccount] = useState('');
  const [nomineeDetails, setNomineeDetails] = useState({
    nomineeFullName: '',
    relationship: '',
    emiratesOrPassportId: '',
    contactNumber: '',
    residentialAddress: '',
  });

  const bankOptions = ['Bank A', 'Bank B', 'Bank C'];

  const handleNext = () => {
    if (currentStep === 1 && !securityOption) {
      Alert.alert('Error', 'Please select a security assurance option.');
      return;
    }
    if (currentStep === 2) {
      const {clientName, passportId, nationalId, residentialAddress, phone, email} = clientInfo;
      if (!clientName || !passportId || !nationalId || !residentialAddress || !phone || !email) {
        Alert.alert('Error', 'Please fill in all client information.');
        return;
      }
    }
    if (currentStep === 3) {
      const {companyName, companyId, nationalId, licenseNumber, legalNumber} = companyInfo;
      if (!companyName || !companyId || !nationalId || !licenseNumber || !legalNumber) {
        Alert.alert('Error', 'Please fill in all company details.');
        return;
      }
    }
    if (currentStep === 4) {
      const {nomineeFullName, relationship, emiratesOrPassportId, contactNumber, residentialAddress} = nomineeDetails;
      if (!bankAccount) {
        Alert.alert('Error', 'Please select a bank account.');
        return;
      }
      if (!nomineeFullName || !relationship || !emiratesOrPassportId || !contactNumber || !residentialAddress) {
        Alert.alert('Error', 'Please fill in all nominee details.');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submission',
      JSON.stringify({securityOption, clientInfo, companyInfo, bankAccount, nomineeDetails}, null, 2)
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>Step 1: Security Assurance</Text>
            {['Security Cheque', 'Notarisation', 'Shares']?.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  securityOption === option && styles.optionSelected,
                ]}
                onPress={() => setSecurityOption(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.title}>Step 2: Client Information</Text>
            {[
              {key: 'clientName', placeholder: 'Client Name'},
              {key: 'passportId', placeholder: 'Passport/Emirates ID'},
              {key: 'nationalId', placeholder: 'National ID'},
              {key: 'residentialAddress', placeholder: 'Residential Address'},
              {key: 'phone', placeholder: 'Contact Number'},
              {key: 'email', placeholder: 'Email Address'},
            ]?.map(({key, placeholder}) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#888" 
                value={clientInfo[key]}
                onChangeText={value => setClientInfo({...clientInfo, [key]: value})}
              />
            ))}
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.title}>Step 3: Company Details</Text>
            {[
              'companyName',
              'companyId',
              'nationalId',
              'licenseNumber',
              'legalNumber',
            ]?.map(field => (
              <TextInput
                key={field}
                style={styles.input}
                placeholderTextColor="#888" 
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={companyInfo[field]}
                onChangeText={value => setCompanyInfo({...companyInfo, [field]: value})}
              />
            ))}
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.title}>Step 4: Bank & Nominee Details</Text>
            <Text style={styles.subtitle}>Select Bank Account</Text>
            {bankOptions?.map(bank => (
              <TouchableOpacity
                key={bank}
                style={[
                  styles.option,
                  bankAccount === bank && styles.optionSelected,
                ]}
                onPress={() => setBankAccount(bank)}>
                <Text style={styles.optionText}>{bank}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.subtitle}>Nominee Details</Text>
            {[
              {key: 'nomineeFullName', placeholder: 'Nominee Full Name'},
              {key: 'relationship', placeholder: 'Relationship'},
              {key: 'emiratesOrPassportId', placeholder: 'Emirates/Passport ID'},
              {key: 'contactNumber', placeholder: 'Contact Number'},
              {key: 'residentialAddress', placeholder: 'Residential Address'},
            ]?.map(({key, placeholder}) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#888" 
                value={nomineeDetails[key]}
                onChangeText={value => setNomineeDetails({...nomineeDetails, [key]: value})}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderStepContent()}
      <View style={styles.buttonRow}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentStep < 4 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Investstep1;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: '#000',
    padding: 10,
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#e5c957',
    padding: 15,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
