import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppColors from '../../Constants/AppColors';
import axios from 'axios';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NomineeList = ({navigation, userId}) => {
  const [nominees, setNominees] = useState([]);
  const [selectedNomineeId, setSelectedNomineeId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNomineeList();
  }, []);

  const fetchNomineeList = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/list',
        {},
        {
          headers: {
            user_id: await AsyncStorage.getItem(AppStrings.USER_ID),
          },
        },
      );
      console.log('Nominee List Response:', response.data);
      console.log('UserrIDD', userId);

      if (response.data.result && response.data.data) {
        setNominees(response.data.data);
      } else {
        setNominees([]);
      }
    } catch (error) {
      console.error('Error fetching nominees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = id => {
    setSelectedNomineeId(id);
  };

  const renderNominee = ({item}) => {
    const isSelected = item.n_id === selectedNomineeId;
    return (
      <TouchableOpacity
        style={[styles.nomineeCard, isSelected && styles.selectedNominee]}
        onPress={() => handleSelect(item.n_id)}>
        <Text style={[styles.nomineeText, isSelected && styles.selectedText]}>
          Name : {item.n_name}
        </Text>
        <Text style={[styles.nomineeText, isSelected && styles.selectedText]}>
          Relation : {item.n_relation}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: AppColors.white}}>
      <View style={styles.container}>
        <Text style={styles.heading}>Select a Nominee</Text>

        {loading ? (
          <ActivityIndicator size="large" color={AppColors.Blue} />
        ) : (
          <FlatList
            data={nominees}
            renderItem={renderNominee}
            keyExtractor={item => item.n_id.toString()}
            ListEmptyComponent={<Text>No nominees found</Text>}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => console.log('Submit pressed')}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => navigation.navigate('DashBoardStack')}>
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NomineeList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nomineeCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  selectedNominee: {
    backgroundColor: AppColors.Blue,
  },
  nomineeText: {
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backToHomeButton: {
    position: 'absolute',
    // bottom: 30,
    alignSelf: 'center',
    backgroundColor: AppColors.Yellow, // Yellow
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },

  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 70,

    alignItems: 'center',
  },

  submitButton: {
    backgroundColor: AppColors.Blue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    top: 90,
    marginBottom: 10,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
