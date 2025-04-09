import React, {useCallback, useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../Constants/AppStrings';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Dropdownforbank = ({options = [], selectedOption, onSelectOption}) => {
  const {t, i18n} = useTranslation();
  const [selectedBank, setSelectedBank] = useState(selectedOption || null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchBanks = async () => {
        const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
        try {
          const response = await axios.post(
            'https://coral.lunarsenterprises.com/wealthinvestment/user/nominee/list',
            {},
            {headers: {user_id}},
          );

          if (response.data.result && response.data.data?.length > 0) {
            const mappedBanks = response?.data?.data?.map(bank => ({
              id: bank.n_id,
              name: bank.n_name,
              relation: bank.n_relation,
              emiatesId: bank.n_emiates_id,
              mobile: bank.n_mobile,
              address: bank.n_address,
            }));
            setBanks(mappedBanks);
          } else {
            setBanks([]); // No nominees found
          }
        } catch (error) {
          console.error('Failed to fetch nominees:', error);
          setBanks([]);
        } finally {
          setLoading(false);
        }
      };

      fetchBanks();
    }, []),
  );

  const handleSelectBank = option => {
    setSelectedBank(option);
    setDropdownVisible(false);
    if (onSelectOption) onSelectOption(option);
  };

  const handleAddBank = () => {
    navigation.navigate('AddNomineeScreen');
  };

  return (
    <View>
      <Text style={styles.label}>{t('Select a Nominee')}</Text>

      {/* Dropdown Toggle */}
      <TouchableOpacity
        style={styles.placeholder}
        onPress={() => setDropdownVisible(!dropdownVisible)}>
        <Text style={styles.placeholderText}>
          {selectedBank
            ? banks.find(bank => bank.id === selectedBank.id)?.name ||
              t('Nominee not found')
            : banks.length === 0
            ? t('Nominee not found')
            : t('Select a Nominee')}
        </Text>

        <Image
          source={dropdownVisible ? AppImages.Uparrow : AppImages.Downarrow}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* Dropdown List */}
      {dropdownVisible && (
        <FlatList
          data={banks}
          keyExtractor={item =>
            item?.id?.toString() || Math.random().toString()
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.bankItem,
                selectedBank?.id === item.id && styles.selectedBankItem,
              ]}
              onPress={() => handleSelectBank(item)}>
              <Text
                style={[
                  styles.bankText,
                  selectedBank?.id === item.id && styles.selectedBankText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              style={styles.addBankItem}
              onPress={handleAddBank}>
              <Image source={AppImages.Add} style={styles.addIcon} />
              <Text style={styles.addBankText}>{t('Add Nominee')}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.addBankText}>{/* No Nominee found  */}</Text>
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
    padding: 8,
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
    color: AppColors.Ash,
  },
  selectedBankText: {
    color: AppColors.white,
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
    // fontWeight: 'bold',
  },
});

export default Dropdownforbank;
