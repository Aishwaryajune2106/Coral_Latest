import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import AppImages from '../../Constants/AppImages';

export default function Statusviewer({navigation}) {
  const [statuses, setStatuses] = useState([]); // State for storing statuses from API
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const duration = 3000; // Duration for each status in milliseconds (3 seconds)

  // Fetch data from the API
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(
          'https://lunarsenterprises.com:6017/wealthinvestment/user/list/status',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // If the API expects a request body, add it here. If not, send an empty object or skip it
            body: JSON.stringify({}),
          },
        );

        const result = await response.json();

        if (result.result) {
          // Transform API data to match the statuses structure
          const formattedStatuses = result?.data?.map(item => ({
            image: `https://coral.lunarsenterprises.com/${item.o_file}`,
            description: item.o_description || 'No description available',
          }));
          setStatuses(formattedStatuses);
        } else {
          console.error('Failed to retrieve data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchStatuses();
  }, []);

  // Handle status viewing logic
  useEffect(() => {
    if (statuses?.length > 0) {
      const timer = setTimeout(() => {
        if (currentStatusIndex < statuses.length - 1) {
          setCurrentStatusIndex(currentStatusIndex + 1);
        } else {
          navigation.goBack(); // Close the viewer when all statuses are done
        }
      }, duration);

      return () => clearTimeout(timer); // Clear timer on component unmount or index change
    }
  }, [currentStatusIndex, statuses]);

  const currentImage =
    statuses[currentStatusIndex]?.image || AppImages.DefaultImage;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        {statuses?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {flex: index <= currentStatusIndex ? 1 : 0},
            ]}
          />
        ))}
      </View>

      {/* Status image */}
      {currentImage ? (
        <Image source={{uri: currentImage}} style={styles.statusImage} />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    width: '90%',
    height: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  statusImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
  },
});
