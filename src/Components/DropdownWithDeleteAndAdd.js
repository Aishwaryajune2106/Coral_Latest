import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import AppImages from '../Constants/AppImages';
import AppColors from '../Constants/AppColors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../Constants/AppStrings';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const DropdownWithDeleteAndAdd = ({
  options = [],
  selectedOption,
  onSelectOption,
}) => {
  const navigation = useNavigation();
  const [selectedBank, setSelectedBank] = useState(selectedOption || null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle for dropdown visibility
  const [banks, setBanks] = useState(options || []); // Use prop options as default
  // State for banks list
  const [loading, setLoading] = useState(true);
  console.log(selectedBank, 'sss');
  const {t, i18n} = useTranslation();

  //............BanklISTAPI...............//
  useEffect(() => {
    const fetchBanks = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/list',
          {},
          {
            headers: {
              user_id: user_id,
            },
          },
        );

        if (response?.data?.result && response?.data?.list?.length > 0) {
          setBanks(response?.data?.list);
        } else {
          setBanks([]); // Ensure banks is empty if no data is returned
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        setBanks([]); // Ensure banks is empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Handle bank deletion
  const handleDelete = async b_id => {
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/company/bank/delete',
        {b_id}, // Pass the bank ID in the body
        {
          headers: {
            user_id: user_id,
          },
        },
      );

      if (response.data.result) {
        console.log(response?.data?.message); // Log the success message
        setBanks(prevBanks => prevBanks?.filter(bank => bank.b_id !== b_id)); // Update the state
      } else {
        console.error('Failed to delete the bank:', response.data.message);
      }
    } catch (error) {
      console.error('Error while deleting the bank:', error);
    }
  };

  const handleAddBank = () => {
    navigation.navigate('AddBankScreen');
  };

  // Select Bank Function
  const handleSelectBank = option => {
    setSelectedBank(option); // Set selected bank as complete object (option)
    setDropdownVisible(false); // Close dropdown
    if (onSelectOption) onSelectOption(option); // Send full option to parent component
  };
  console.log(selectedBank, 'selectedOption');

  return (
    <View style={{}}>
      <Text style={styles.label}>{t('Select Bank')}</Text>

      {/* Placeholder */}
      <TouchableOpacity
        style={styles.placeholder}
        onPress={() => setDropdownVisible(!dropdownVisible)}
        disabled={banks?.length === 0}>
        <Text style={styles.placeholderText}>
          {selectedBank
            ? banks.find(bank => bank?.b_id === selectedBank?.b_id)?.b_name ||
              t('Bank not found')
            : banks?.length === 0
            ? t('No Bank found')
            : t('Select a Bank')}
        </Text>
        <Image
          source={dropdownVisible ? AppImages.Uparrow : AppImages.Downarrow}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* Dropdown Options */}
      {dropdownVisible && (
        <FlatList
          data={banks}
          keyExtractor={item =>
            item?.b_id?.toString() || Math.random().toString()
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.bankItem,
                selectedBank &&
                  selectedBank.b_id === item.b_id &&
                  styles.selectedBankItem,
              ]}
              onPress={() => handleSelectBank(item)}>
              <Text
                style={[
                  styles.bankText,
                  selectedBank &&
                    selectedBank.b_id === item.b_id &&
                    styles.selectedBankText,
                ]}>
                {item.b_name}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.b_id)}>
                <Image source={AppImages.Trash} style={styles.trashIcon} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              style={styles.addBankItem}
              onPress={handleAddBank}>
              <Image source={AppImages.Add} style={styles.addIcon} />
              <Text style={styles.addBankText}>{t('Add Bank')}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.bankText}>{t('No Bank found')}</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    backgroundColor: AppColors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.Grey,
    borderRadius: 8,
    backgroundColor: AppColors.white,
  },
  placeholderText: {
    fontSize: 16,
    color: AppColors.Ash,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: AppColors.Ash,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.Grey,
  },
  selectedBankItem: {
    backgroundColor: AppColors.lightviolet,
  },
  bankText: {
    fontSize: 16,
    color: '#333',
  },
  selectedBankText: {
    color: '#fff',
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: '#FF5252',
  },
  addBankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    marginTop: 8,
  },
  addIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  addBankText: {
    fontSize: 15,
    color: AppColors.Ash,
    fontWeight: 'bold',
  },
});

export default DropdownWithDeleteAndAdd;
