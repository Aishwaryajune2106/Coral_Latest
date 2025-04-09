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
import axios from 'axios';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const CashIn = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {selectedCiIndustry, setSelectedCiIndustry} =
    useContext(CountryContext);

  console.log(selectedCiIndustry, 'hii');

  //...........Industry List.................//

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
            // code: `CODE-${index + 1}`, // Add dummy codes if needed
            // roi: 'N/A', // Add dummy ROI if not provided
            // mini: 'N/A', // Add dummy Mini if not provided
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

  // Filter data based on the search text
  const filteredData = data?.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const handleItemPress = item => {
    setSelectedCiIndustry(item.name); // Store the selected industry in context
    navigation.navigate('InvestPlanIndividualScreen', {id: item.id});
  };

  // Render each item
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <View>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.companyCode}>{item.code}</Text>
      </View>
      <View>
        {/* <Text style={styles.roi}>ROI: {item.roi}</Text>
        <Text style={styles.mini}>Mini: {item.mini}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
         style={[
          styles.backIcon,
          i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
        ]}
          onPress={() => navigation.navigate('DashBoardStack')}>
         
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('CashIn')}</Text>
        <TextInput
          style={styles.searchBar}
          placeholder={t('Search')}
          placeholderTextColor={AppColors.Grey}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={{marginTop: 50}}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
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
    height: 150, // Adjust the height to fit both text and search bar
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
    fontFamily: 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    position: 'absolute',
    top: '60%', // Position it below the "CashIn" text
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  companyCode: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  roi: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  mini: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
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
});

export default CashIn;
