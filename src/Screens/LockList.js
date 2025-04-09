import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Button, // Import Button for manual navigation
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation for navigation

const LockList = () => {
  // State to store the API response data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show spinner

  const navigation = useNavigation(); // Initialize navigation

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/lock/period/list',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              user_id: user_id, // Replace with actual user_id
            },
            body: JSON.stringify({}), // Empty body as per your API request
          },
        );

        const result = await response.json();

        if (result.result) {
          setData(result.list); // Store the data in state if successful
        } else {
          console.error('Error fetching data:', result.message);
        }
      } catch (error) {
        console.error('API fetch error:', error);
      } finally {
        setLoading(false); // Set loading to false when the fetch is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  // Handle case where no data is found
  if (!loading && data?.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No future option found.</Text>
        <Text style={styles.redirectText}>
          Please go to the Home screen to add Future Option.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Locked Investment</Text>

      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.spinner}
        />
      )}

      {/* Render fetched data */}
      {!loading &&
        data?.map(item => (
          <View key={item.lp_id} style={styles.record}>
            <View style={styles.row}>
              <Text style={styles.label}>Industry:</Text>
              <Text style={styles.value}>{item.lp_project}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Investment Amount:</Text>
              <Text style={styles.value}>${item.lp_amount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Locking Period:</Text>
              <Text style={styles.value}>{item.lp_duration} Years</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date of Locked:</Text>
              <Text style={styles.value}>
                {new Date(item.lp_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Withdrawal Frequency:</Text>
              <Text style={styles.value}>{item.lp_wf}</Text>
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

export default LockList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  record: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    width: '40%',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    width: '60%',
  },
  spinner: {
    marginVertical: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  redirectText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
