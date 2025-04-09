import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const Termination = ({route}) => {
  const navigation = useNavigation();
  const {contractId} = route.params; // Get the selected contractId from the navigation params
  const [reason, setReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // To manage submit button state

  
  const handleSubmit = async () => {
    if (reason?.trim() === '') {
      alert('Please provide a reason for termination.');
      return;
    }

    setIsSubmitting(true);
    const user_id = await AsyncStorage.getItem('user_id');
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/terminate/contract',
        {
          ui_id: contractId, // Replace with actual contract ID if dynamic
          reason: reason,
        },
        {
          headers: {
            user_id: user_id,
          },
        },
      );

      if (response.data.result) {
        setIsModalVisible(true); // Show confirmation modal
        // Navigate to the 'Activity' screen after a delay or immediately
        setTimeout(() => {
          navigation.navigate('Activity'); // Replace 'Activity' with the actual route name
        }, 1000); // Add a short delay for modal display (optional)
      } else {
        alert('Failed to terminate contract. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert(
        'An error occurred while terminating the contract. Please try again.',
      );
    } finally {
      setIsSubmitting(false); // Reset button state after submission
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setReason(''); // Clear input after submission
  };

  return (
    <LinearGradient
      colors={['#78c1e9', '#b8dff5']}
      style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Termination Request</Text>

        <Text style={styles.labelText}>Reason for Termination</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your reason here..."
          placeholderTextColor="#888"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <Text style={styles.submitText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        {/* Confirmation Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Your request is registered, and the team will connect with you
                soon.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '500',
    color: '#888',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontFamily: 'serif',
    color: '#000',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#e5c957',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B2B2B2',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '500',
    color: '#78c1e9',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#38A169',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '600',
  },
});

export default Termination;
