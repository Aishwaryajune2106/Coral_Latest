import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import AppImages from '../../Constants/AppImages';

export default function Statusviewer({navigation}) {
  const [statuses, setStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const duration = 3000; // 3 seconds per status

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/list/status',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          },
        );

        const result = await response.json();

        if (result.result && Array.isArray(result.status)) {
          const formattedStatuses = result.status.map(item => ({
            image: `https://coral.lunarsenterprises.com/${item.st_image}`,
            description: item.st_status, // Optional: you can display or log this
          }));
          setStatuses(formattedStatuses);
        } else {
          console.error('API error:', result.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0) {
      const timer = setTimeout(() => {
        if (currentStatusIndex < statuses.length - 1) {
          setCurrentStatusIndex(prev => prev + 1);
        } else {
          navigation.goBack(); // End of statuses
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [currentStatusIndex, statuses]);

  const currentImage =
    statuses[currentStatusIndex]?.image || AppImages.DefaultImage;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        {statuses?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                flex: 1,
                backgroundColor:
                  index < currentStatusIndex
                    ? '#888'
                    : index === currentStatusIndex
                    ? '#fff'
                    : '#333',
              },
            ]}
          />
        ))}
      </View>

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
