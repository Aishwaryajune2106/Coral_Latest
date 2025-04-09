import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const MarketNewsone = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [searchText, setSearchText] = useState('');
  const {selectedCiIndustry, setSelectedCiIndustry} =
    useContext(CountryContext);

  // Dummy Data with required details
  const dummyData = [
    {
      id: '1',
      projectName: 'Project Alphas',
      subCompany: 'Alpha Corp',
      totalAmount: '$50,000',
      investedAmount: '$30,000',
      withdrawnAmount: '$10,000',
      image: AppImages.Future,
    },
    {
      id: '2',
      projectName: 'Tech Innovations',
      subCompany: 'Tech Hub',
      totalAmount: '$75,000',
      investedAmount: '$50,000',
      withdrawnAmount: '$15,000',
      image: AppImages.Future,
    },
    {
      id: '3',
      projectName: 'Healthcare Boost',
      subCompany: 'MediCare Ltd',
      totalAmount: '$100,000',
      investedAmount: '$70,000',
      withdrawnAmount: '$20,000',
      image: AppImages.Future,
    },
  ];

  const handleItemPress = item => {
    setSelectedCiIndustry(item.name);
    navigation.navigate('MarketNewstwoScreen', {
      id: item.id,
      name: item.name,
      ri_amount_from: item.ri_amount_from,
      ri_amount_to: item.ri_amount_to,
      ri_return_year: item.ri_return_year,
    });
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/project/list',
          {},
        );
        if (response.data.result) {
          const apiData = response?.data?.data?.map((item, index) => ({
            id: index.toString(),
            name: item.ci_industry,
            ri_amount_from: item.ri_amount_from,
            ri_amount_to: item.ri_amount_to,
            ri_return_year: item.ri_return_year,
          }));
          setData(apiData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const filteredData = (data?.length > 0 ? data : dummyData).filter(
    item =>
      item.name && item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Render each item
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.leftSection}>
        <Image source={AppImages.Future} style={styles.roundImage} />
        <View style={styles.textContainer}>
          <Text style={styles.projectName}>{item.name}</Text>
          {/* <Text style={styles.subCompany}>{item.ri_amount_to}</Text> */}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.totalAmount}>{item.ri_amount_from}</Text>
        <Text style={styles.totalAmount}>{item.ri_amount_to}</Text>
        <Text style={styles.investedAmount}>{item.ri_return_year} Yr</Text>
        {/* <Text style={styles.withdrawnAmount}>{item.withdrawnAmount}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={AppImages.Leftarrow}
            style={[
              styles.backIcon,
              i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('Market News / Insight')}</Text>
        <TextInput
          style={styles.searchBar}
          placeholder={t('Search')}
          placeholderTextColor={AppColors.Grey}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 150,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    position: 'absolute',
    top: '60%',
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
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
    tintColor: '#EDEFF8',
  },
  textContainer: {
    flexDirection: 'column',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  investedAmount: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
    fontFamily: 'serif',
  },
  withdrawnAmount: {
    fontSize: 14,
    color: 'red',
    marginTop: 2,
    fontFamily: 'serif',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1, // Ensure FlatList gets full height for scrolling
    marginTop: 10,
  },
});

export default MarketNewsone;
