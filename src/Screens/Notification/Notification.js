import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppColors from '../../Constants/AppColors';
import AppImages from '../../Constants/AppImages';
import AppStrings from '../../Constants/AppStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const Notification = () => {
  const {t, i18n} = useTranslation();
  const withdrawHistory = [
    {
      id: '1',
      b_name: 'Transfered money to William',
      wr_status: '08:58 PM',
    },
    {
      id: '2',
      b_name: 'Received money $20 from Dito',
      wr_status: '08:58 PM',
    },
    {
      id: '3',
      b_name: 'Transfered money to William',
      wr_status: '08:58 PM',
    },
    {
      id: '4',
      b_name: 'Received money $20 from Dito',
      wr_status: '08:58 PM',
    },
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const response = await fetch(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/notifications',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              user_id: user_id,
            },
          },
        );
        const result = await response.json();
        if (result.result) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.bellContainer}
        onPress={() => alert('Notifications')}>
        <Image source={AppImages.Greynotify} style={styles.bellIcon} />
      </TouchableOpacity> */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {/* //...............Date..................// */}

        <View>
          <Text style={styles.profitHistory}></Text>
          <View style={styles.contentContainer}>
            {notifications?.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionName}>{item.type}</Text>
                      <Text style={styles.transactionType}>{item.message}</Text>
                      <Text style={styles.dateText}>
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noDataText}>
                {t('No notifications available')}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.whitegrey,
  },
  // New style for "Profit History" text
  profitHistory: {
    color: AppColors.Black,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'serif',
    marginHorizontal: 45,
    marginVertical: 15,
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 30,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  transactionType: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    fontFamily: 'Eina03-Regular',
  },
  greenText: {
    color: 'green',
    fontWeight: 'bold',
  },
  bellContainer: {
    right: 20,
    top: 20,
    alignItems: 'flex-end',
    position: 'absolute', // Fix it at the top
    zIndex: 10,
    borderRadius: 50,
  },
  bellIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
