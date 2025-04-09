import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppImages from '../../Constants/AppImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';

const Profileinfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user',
          {
            method: 'GET',
            headers: {
              user_id: user_id, // Replace with actual user_id
            },
          },
        );

        const result = await response.json();
        if (result?.result && result?.data?.length > 0) {
          setUser(result.data[0]);
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
console.log(user,"user");

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileContainer}>
        {/* <Image source={{uri: user.profileImage}} style={styles.profileImage} /> */}
        <Text style={styles.userName}>{user?.u_name}</Text>
      </View>

      {/* User Details Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={AppImages.Emails} style={styles.icon} />
          <Text style={styles.text}>{user?.u_email}</Text>
        </View>
        <View style={styles.row}>
          <Image source={AppImages.Phone} style={styles.icon} />
          <Text style={styles.text}>{user?.u_mobile}</Text>
        </View>
        <View style={styles.row}>
          <Image source={AppImages.Country} style={styles.icon} />
          <Text style={styles.text}>{user?.u_country}</Text>
        </View>
        <View style={styles.row}>
          <Image source={AppImages.Gender} style={styles.icon} />
          <Text style={styles.text}>{user?.u_gender}</Text>
        </View>
        <View style={styles.row}>
          <Image source={AppImages.Location} style={styles.icon} />
          <Text style={styles.text}>{user?.u_address}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // borderWidth: 2,
    // borderColor: '#ddd',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
export default Profileinfo;
