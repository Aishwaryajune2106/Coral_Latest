import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

export default function Profile({navigation}) {
  const {t} = useTranslation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  //.....................kyc status..............//
  const [datahome, setDatahome] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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
  }, [selectedLanguage]);
  console.log(user, 'user');
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await getStoredLanguage(); // 🔄 First, fetch language
        await fetchUserData(); // 🔄 Then fetch user
        await fetchHgfData(); // 🔄 HGF
        await getNotificationPreference(); // 🔄 Notification
      } catch (error) {
        console.error('Error in fetchAllData:', error);
      }
    };

    fetchAllData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        await getStoredLanguage();
        await fetchUserData();
        await fetchHgfData();

        await getNotificationPreference();
      };

      fetchAllData();
    }, []),
  );

  const fetchHgfData = async () => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.get(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/hfs/list',
        {headers: {user_id}},
      );

      if (response.data.result) {
        setDatahome(response.data);
        // setHgfData(response.data.data);
      } else {
        console.error('Error fetching HGF data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Fetch stored langua
  const getStoredLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem('selectedLanguageLabel');
      console.log('Stored Language Label:', lang); // Debug

      if (lang) {
        setSelectedLanguage(lang);
      }
    } catch (error) {
      console.error('Error fetching stored language:', error);
    }
  };
  console.log('Stored Language Labell:', selectedLanguage); // Debug

  const getNotificationPreference = async () => {
    try {
      const savedState = await AsyncStorage.getItem('notificationPreference');
      if (savedState !== null) {
        setIsNotificationEnabled(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error fetching notification preference:', error);
    }
  };

  //.....................Notification Api....................//

  const toggleNotification = async () => {
    const newValue = !isNotificationEnabled;
    setIsNotificationEnabled(newValue); // Update UI immediately

    try {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/updateNotification',
        {u_isNotificationTrue: newValue},
        {headers: {user_id}},
      );

      if (response.data.result) {
        console.log(response.data.message);
        Toast.show(response.data.message, Toast.LONG);
        await AsyncStorage.setItem(
          'notificationPreference',
          JSON.stringify(newValue),
        ); // Store the updated value
      } else {
        console.error(
          'Failed to update notification preference:',
          response.data.message,
        );
        Toast.show('Failed to update notification', Toast.LONG);
        setIsNotificationEnabled(!newValue); // Revert state if API call fails
      }
    } catch (error) {
      console.error('Error updating notification preference:', error);
      Toast.show('Something went wrong. Please try again.', Toast.LONG);
      setIsNotificationEnabled(!newValue); // Revert state if API call fails
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section with Background */}
      <View style={styles.profileBackground}>
        <Image
          source={AppImages.ProfileBackground}
          style={styles.backgroundImage}
        />
        <View style={styles.profileSection}>
          {/* <Image
            source={{
              uri: user?.u_profile_pic
                ? `https://coral.lunarsenterprises.com/${user.u_profile_pic}`
                : AppImages.Aavatar, // fallback image if user pic is not available
            }}
            style={styles.avatar}
          /> */}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate('EditProfileScreen')}>
            <Image source={AppImages.Edit} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.profileName}>{user?.u_name}</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ProfileinfoScreen')}>
          <Image source={AppImages.Profileicon} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('profileInfo')}</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Image source={AppImages.Notifyicon} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Notifications')}</Text>
          <Switch
            trackColor={{false: '#767577', true: AppColors.Blue}}
            thumbColor={isNotificationEnabled ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotification}
            value={isNotificationEnabled}
          />
        </View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('LanguageListScreen')}>
          <Image source={AppImages.Language} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Language')}</Text>
          <Text style={styles.rightText}>{selectedLanguage}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('PinGenerateScreen')}>
          <Image source={AppImages.Pin} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('MPin')}</Text>
          
        </TouchableOpacity>
      </View>

      {/* KYC Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('KycviewScreen')}>
          <Image source={AppImages.Notifyicon} style={styles.rowIcon} />

          <Text style={styles.rowText}>{t('KYC')}</Text>

          <Image
            source={
              user?.u_kyc === 'rejected'
                ? AppImages.Rejected // red icon
                : user?.u_kyc === 'pending'
                ? AppImages.PendingIcon // yellow icon
                : AppImages.Verified // green icon
            }
            style={styles.rightIcon}
          />

          <Text style={styles.rowText}>
            {user?.u_kyc === 'pending'
              ? 'In Review'
              : user?.u_kyc === 'rejected'
              ? 'Rejected'
              : 'Verified'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('BankScreen')}>
          <Image source={AppImages.Bankicon} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Bank')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ContractsScreen')}>
          <Image source={AppImages.Doc} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Activity of Contract')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('YourLogsScreen')}>
          <Image source={AppImages.Book} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Your Activities')}</Text>
        </TouchableOpacity>
      </View>

      {/* Referral and Theme Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ReferralScreen')}>
          <Image source={AppImages.Projector} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Referral')}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.row}>
          <Image source={AppImages.Head} style={styles.rowIcon} />
          <Text style={styles.rowText}>Theme</Text>
          <Text style={styles.rightText}>Light mode</Text>
        </TouchableOpacity> */}
      </View>

      {/* FAQ Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('FaqScreen')}>
          <Image source={AppImages.Usericon} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('FAQ')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ContactusScreen')}>
          <Image source={AppImages.Chat} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Raise a Ticket')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('PrivacyScreen')}>
          <Image source={AppImages.Lockicon} style={styles.rowIcon} />
          <Text style={styles.rowText}>{t('Privacy policy')}</Text>
        </TouchableOpacity>
      </View>

      {/* Log Out Button */}
      {/* <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>LOG OUT</Text>
        <Image source={AppImages.Logout} style={styles.reloadIcon} />
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: '45%',
  },
  profileBackground: {
    position: 'relative',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',

    resizeMode: 'cover',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
  },
  editIcon: {
    position: 'absolute',
    bottom: 20,
    left: 80,
    resizeMode: 'contain',

    padding: 6,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    padding: 10,
    marginHorizontal: 25,
    marginVertical: 10,
    shadowColor: '#888',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  rowText: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
    left: 10,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.Blue,
  },
  rightIcon: {
    width: 30,
    height: 30,

    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: AppColors.Yellow,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    margin: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  reloadIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});
