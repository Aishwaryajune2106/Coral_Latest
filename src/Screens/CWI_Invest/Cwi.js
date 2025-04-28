import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const Cwi = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {selectedInvestment, setSelectedInvestment} =
    useContext(CountryContext);
  console.log(selectedInvestment, 'Selected Investment');

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('current');
  const [currentInvestments, setCurrentInvestments] = useState([]);
  const [futureInvestments, setFutureInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const handlePress = () => {
    if (selectedCard) {
      setSelectedInvestment(selectedCard); // Ensure it's set before navigating
      navigation.navigate('CwiAmountScreen');
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchFutureInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/cwiInvestments',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            user_id,
          },
        },
      );
      const data = await response.json();
      if (data.result) {
        setCurrentInvestments(data.data);
      }
    } catch (error) {
      console.error('Error fetching current investments:', error);
    }
    setLoading(false);
  };

  const fetchFutureInvestments = async () => {
    setLoading(true);
    const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/list/futureInvestments',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            user_id,
          },
        },
      );
      const data = await response.json();
      if (data.result) {
        setFutureInvestments(data.data);
      }
    } catch (error) {
      console.error('Error fetching future investments:', error);
    }
    setLoading(false);
  };

  const dummyData = [
    {
      id: '1',
      projectName: 'LMC',
      projectplace: 'LMC USA',
      subCompany: 'Alpha Corp',
      totalAmount: '$432.21',
      investedAmount: '+2.53 (9%)',
      withdrawnAmount: 'Last Return Yrs (9%)',
      image: AppImages.Future,
    },
    {
      id: '2',
      projectName: 'Tech Innovations',
      projectplace: 'LMC USA',
      subCompany: 'Tech Hub',
      totalAmount: '$75,000',
      investedAmount: '$50,000',
      withdrawnAmount: '$15,000',
      image: AppImages.Future,
    },
    {
      id: '3',
      projectName: 'Healthcare Boost',
      projectplace: 'LMC USA',
      subCompany: 'MediCare Ltd',
      totalAmount: '$100,000',
      investedAmount: '$70,000',
      withdrawnAmount: '$20,000',
      image: AppImages.Future,
    },
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleItemPress = item => {
    setSelectedInvestment(item); // Set the selected investment in context
    setSelectedCard(item);
    setModalVisible(true);
  };

  const closeModalNo1 = () => {
    setModalVisible(false);
  };
  // Render each item
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.leftSection}>
        <Image source={AppImages.Future} style={styles.roundImage} />
        <View style={styles.textContainer}>
          <Text style={styles.projectName}>{item.ui_project_name}</Text>
          {/* <Text style={styles.subCompany}>{item.projectplace}</Text> */}
          {/* <Text style={styles.subCompany}>{item.subCompany}</Text> */}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.totalAmount}>Amnt: {item.ui_amount}</Text>
        <Text style={styles.investedAmount}>return: {item.ui_return}</Text>
        <Text style={styles.investedAmount}>
          percentage: {item.ui_percentage}%
        </Text>
        {/* <Text
          style={[
            styles.withdrawnAmount,
            {color: item.return_type === 'profit' ? 'green' : 'red'},
          ]}>
          {item.return_type}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
  const renderItemfuture = ({item}) => (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleItemPress(item)}>
        <View style={styles.leftSection}>
          <Image source={AppImages.Future} style={styles.roundImage} />
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{item.fi_industries}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.totalAmount}>
            Planned to Invest: {item.fi_plan_to_invest}
          </Text>
          <Text style={styles.investedAmount}>
            Expected return: {item.fi_expected_return}
          </Text>
          <Text style={styles.investedAmount}>
            {/* Mini. Investment: {item.fi_minimum_investment} */}
          </Text>
          {/* <Text
          style={[
            styles.withdrawnAmount,
            {color: item.return_type === 'profit' ? 'green' : 'red'},
          ]}>
          {item.return_type}
        </Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image
              source={AppImages.Blackbackicon}
              style={[
                styles.backIcon,
                i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.pageName}>{t('CWI Investment')}</Text>
        </View>
      </View>

      {/* Background and Foreground Images */}
      <View style={styles.backgroundContainer}>
        <Image source={AppImages.Withdrawimg} style={styles.backgroundImage} />
      </View>
      <View style={styles.foregroundContainer}>
        <Image source={AppImages.Cwi_Papa} style={styles.foregroundImage} />
      </View>

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
            {t('Current Investment')}
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
            {t('Future Investment')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginHorizontal: 20, marginBottom: 40}}>
        <Text style={[styles.projectName, {marginTop: 20}]}>
          {t('Top Companies')}
        </Text>
        <View style={{marginTop: 15}}>
          {selectedTab === 'future' ? (
            <FlatList
              data={futureInvestments}
              keyExtractor={item => item?.id?.toString()}
              renderItem={renderItemfuture}
              contentContainerStyle={{
                paddingBottom: 0,
                flexGrow: 1,
                justifyContent:
                  futureInvestments.length === 0 ? 'center' : 'flex-start',
              }}
              ListEmptyComponent={
                <Text
                  style={{textAlign: 'center', color: 'gray', marginTop: 20}}>
                  No future investments
                </Text>
              }
              style={{maxHeight: '80%'}}
            />
          ) : (
            <FlatList
              data={currentInvestments}
              keyExtractor={item => item?.id?.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingBottom: 0,
                flexGrow: 1,
                justifyContent:
                  currentInvestments.length === 0 ? 'center' : 'flex-start',
              }}
              ListEmptyComponent={
                <Text
                  style={{textAlign: 'center', color: 'gray', marginTop: 20}}>
                  No current investments
                </Text>
              }
              style={{maxHeight: '80%'}}
            />
          )}
        </View>
      </View>
      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModalNo1}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModalNo1}>
              <Image source={AppImages.Cross} style={styles.crossIconImage} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {t('Are You Ready To Invest')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('Grow Your Wealth, Secure Your Future')}
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handlePress}>
              <Text style={styles.continueButtonText}>{t('Invest Now')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColors.backwhite,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 80,
    width: '100%',
    height: '20%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  foregroundContainer: {
    marginTop: 40,
    width: '85%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  foregroundImage: {
    width: '100%',
    // height: '50%',
    resizeMode: 'contain',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
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
  listContainer: {
    // paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',

    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginHorizontal: 5,
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
    width: 180,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    // backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  pageName: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginLeft: 10,
  },
  arrowImage: {
    width: 25,
    height: 25,
  },
  subCompany1: {
    fontSize: 12,
    color: AppColors.Black,
    fontFamily: 'serif',
    marginLeft: 5,
  },
  investedAmount1: {
    fontSize: 13,
    color: AppColors.Black,
    marginTop: 5,
    fontFamily: 'serif',
  },
  withdrawnAmount1: {
    fontSize: 12,
    color: AppColors.Black,
    marginTop: 2,
    fontFamily: 'serif',
  },
  expandedContainer: {
    backgroundColor: '#54545657',
    padding: 10,

    marginTop: 65,
    borderRadius: 10,
    width: 160,
    height: 70,

    justifyContent: 'center',
  },

  optionText: {
    color: AppColors.Black,
    fontSize: 12,

    fontFamily: 'serif',
    // textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  crossIconImage: {
    width: 20,
    height: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 10,
    color: AppColors.Black,
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: 'serif',
    color: AppColors.perfectgrey,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: AppColors.Grey,
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: AppColors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColors.Black,
  },
  cancelButtonText: {
    color: AppColors.Black,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'serif',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: AppColors.Yellow,
    borderRadius: 5,
    paddingHorizontal: 25,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'serif',
  },
  continueButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  continueButtonText: {
    color: AppColors.white,
    fontWeight: 'bold',
    color: AppColors.white,
  },
});

export default Cwi;
