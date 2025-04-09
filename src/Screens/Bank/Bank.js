import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import AppColors from '../../Constants/AppColors';
import {FlatList} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';
import {ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Bank = ({navigation}) => {
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState('current');
  const [bankList, setBankList] = useState([]);
  const [nomineeList, setNomineeList] = useState([]);

  //....................BankList....................//
  useFocusEffect(
    useCallback(() => {
      fetchBankList();
      fetchNomineeList();
    }, []),
  );

  const fetchBankList = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/list',
        {}, // Empty body
        {
          headers: {
            user_id: userId,
          },
        },
      );

      if (response.data.result) {
        setBankList(response.data.list);
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
    }
  };
  //....................Bank Delete....................//
  const handleDeleteBank = async bankId => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/delete',
        {b_id: bankId},
        {headers: {user_id: userId}},
      );

      if (response.data.result) {
        console.log('Bank deleted successfully');

        // Update the bank list state immediately after deletion
        setBankList(prevList => prevList.filter(bank => bank.b_id !== bankId));
      } else {
        console.log('Failed to delete bank:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
    }
  };

  const handleDeleteNominee = async nomineeId => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/delete',
        {}, // Empty body
        {
          headers: {
            user_id: userId,
            n_id: nomineeId,
          },
        },
      );

      if (response.data.result) {
        setNomineeList(prevList =>
          prevList.filter(nominee => nominee.n_id !== nomineeId),
        );
        console.log('Nominee deleted successfully');
      } else {
        console.log('Failed to delete nominee:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting nominee:', error);
    }
  };

  const fetchNomineeList = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/list',
        {},
        {headers: {user_id: userId}},
      );
      if (response.data.result) {
        setNomineeList(response.data.data);
        fetchNomineeList();
      }
    } catch (error) {
      console.error('Error fetching nominee list:', error);
    }
  };

  const nomineeData = [
    {
      id: '1',
      name: 'John Doe',
      relation: 'Brother',
      address: '123 Main St',
      phone: '1234567890',
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      // onPress={{}}
    >
      <View style={styles.leftSection}>
        <Image source={item.image} style={styles.roundImage} />
        <View style={styles.textContainer}>
          <Text style={styles.projectName}>{item.b_name}</Text>
          <Text style={styles.subCompany}>
            Acc: ******{String(item.b_account_no).slice(-4)}
          </Text>
          <Text style={styles.subCompany}>
            {t('Currency')}: {item.b_branch}
          </Text>
          <Text style={styles.subCompany}>
            {t('Currency')}: {item.b_currency}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditBankScreen', {bankId: item.b_id})
          }>
          <Image
            source={AppImages.Editicon} // Replace with your edit icon path
            style={styles.icon}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => handleDeleteBank(item.b_id)}>
          <Image
            source={AppImages.Trashicon} // Replace with your delete icon path
            style={[styles.icon, {marginLeft: 10}]}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const renderNomineeItem = ({item}) => (
    <View>
      <View style={styles.contentContainer}>
        {/* <TouchableOpacity
          style={styles.withdrawButtons}
          onPress={() => navigation.navigate('AddNomineeScreen')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.withdrawButtonTexts}>Add Nominee</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity
        style={styles.card}
        // onPress={{}}
      >
        <View style={styles.leftSection}>
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{item.n_name}</Text>
            <Text style={styles.subCompany}>
              {t('Relationship')}: {item.n_relation}
            </Text>

            <Text style={styles.subCompany}>
              {t('Emirates id')}:{item.n_emiates_id}
            </Text>
            <Text style={styles.subCompany}>
              {t('Phone Number')}: {item.n_mobile}
            </Text>
            <Text style={styles.subCompany}>
              {t('Address')}: {item.n_address}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={() => handleDeleteNominee(item.n_id)}>
            <Image
              source={AppImages.Trashicon} // Replace with your delete icon path
              style={[styles.icon, {marginLeft: 10}]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'current' && styles.activeTab]}
          onPress={() => setSelectedTab('current')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'current' && styles.activeTabText,
            ]}>
            {t('Bank Details')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'future' && styles.activeTab]}
          onPress={() => setSelectedTab('future')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'future' && styles.activeTabText,
            ]}>
            {t('Nominees')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* //............Add Bank.........// */}

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {selectedTab === 'current' ? (
          <View>
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={styles.withdrawButtons}
                onPress={() => navigation.navigate('AddBankScreen')}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.withdrawButtonTexts}>
                    {t('Add Bank')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{marginTop: 15, marginHorizontal: 20, marginVertical: 20}}>
              <FlatList
                data={bankList}
                keyExtractor={item => item.b_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          </View>
        ) : (
          // <View style={{marginTop: 15, marginHorizontal: 20, marginVertical: 20}}>
          //   <FlatList
          //     data={nomineeList}
          //     keyExtractor={item => item.n_id.toString()}
          //     renderItem={renderNomineeItem}
          //     contentContainerStyle={styles.listContainer}
          //   />
          // </View>
          <View>
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={styles.withdrawButtons}
                onPress={() => navigation.navigate('AddNomineeScreen')}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.withdrawButtonTexts}>
                    {t('Add Nominee')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{marginTop: 15, marginHorizontal: 20, marginVertical: 20}}>
              <FlatList
                data={nomineeList}
                keyExtractor={item => item.n_id.toString()}
                renderItem={renderNomineeItem}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Bank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 28,
    backgroundColor: '#E5E5E5',
    borderRadius: 25,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#3D4DB7',
  },
  tabText: {
    fontSize: 12,
    color: '#707070',
    fontFamily: 'serif',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  withdrawButtons: {
    backgroundColor: AppColors.Yellow,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 12,
  },
  withdrawButtonTexts: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppColors.Ash,
    fontFamily: 'serif',
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Black,
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  rightImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  listContainer: {
    // paddingHorizontal: 15,
  },
  card: {
    backgroundColor: AppColors.backwhite,

    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    tintColor: '#ccc',
  },
  textContainer: {
    flexDirection: 'column',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'serif',
  },
  subCompany: {
    fontSize: 13,
    color: AppColors.perfectgrey,
    fontFamily: 'serif',
    marginLeft: 5,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  totalAmount: {
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#000',
    // fontFamily: 'serif',
  },
  investedAmount: {
    fontSize: 13,
    color: 'green',
    marginTop: 5,
    // fontFamily: 'serif',
  },
  withdrawnAmount: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
    // fontFamily: 'serif',
  },
});
