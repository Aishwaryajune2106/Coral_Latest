import {Image, Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import AppColors from '../../Constants/AppColors';
import {FlatList} from 'react-native';
import AppImages from '../../Constants/AppImages';
import {TouchableWithoutFeedback} from 'react-native';
import {ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import CustomAlert from '../../Components/CustomAlert';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const Contracts = ({navigation}) => {
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState('current');
  const [modalVisible, setModalVisible] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [terminationReason, setTerminationReason] = useState('');
  const [isTransfer, setIsTransfer] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyData = [
    {
      id: '1',
      projectName: 'LMC',
      projectplace: 'LMC USA',

      image: AppImages.Future,
    },
    {
      id: '2',
      projectName: 'Ardy Inc.',
      projectplace: 'Ardy',

      image: AppImages.Future,
    },
  ];
  const nomineeData = [
    {
      id: '1',
      projectName: 'LMC',
      projectplace: 'LMC USA',
      nomine: 'Lunar',

      image: AppImages.Future,
    },
    {
      id: '2',
      projectName: 'Ardy Inc.',
      projectplace: 'Ardy',

      image: AppImages.Future,
    },
  ];

  useEffect(() => {
    fetchContracts();
  }, []);
  //..............Contract List...............//

  const fetchContracts = async () => {
    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);
    setLoading(true);

    try {
      const response = await axios({
        method: 'POST', // Changed to POST
        url: 'https://coral.lunarsenterprises.com/wealthinvestment/user/contractlist',
        headers: {
          'Content-Type': 'application/json',
          user_id: userId,
        },
        data: {
          type: 'invest', // Moved type to the request body
        },
      });

      if (response.data.result) {
        setContracts(response.data.data);
      } else {
        console.log('Error fetching contracts:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(contracts, 'contracts');

  const renderItem = ({item}) => {
    let buttonText = t('Terminate');

    if (item.ui_status === 'completed') {
      buttonText = 'Contract Completed';
    } else if (
      item.ui_request === 'termination' &&
      item.ui_request_status === 'pending'
    ) {
      buttonText = 'Termination in Review';
    }

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.leftSection}>
          <Image source={item.image} style={styles.roundImage} />
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{item.ui_project_name}</Text>
            <Text style={styles.subCompany}>{item.ui_amount}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.terminateButton}
            disabled={buttonText !== t('Terminate')} // Disable if not actively terminable
            onPress={() => handleTerminatePress(item)}>
            <Text style={styles.terminateText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNomineeItem = ({item}) => (
    <View>
      <TouchableOpacity
        style={styles.card}
        //  onPress={{}}
      >
        <View style={styles.leftSection}>
          <Image source={item.image} style={styles.roundImage} />
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{item.ui_project_name}</Text>
            <Text style={styles.subCompany}>{item.ui_amount}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.terminateButton}
            onPress={() => {
              if (item.n_id) {
                setSelectedItem(item); // Set selectedItem before transfer
                confirmTransfer();
              } else {
                navigation.navigate('NomineeListScreen', {item});
              }
            }}>
            <Text style={styles.terminateText}>
              {item.n_id ? t('Transfer') : t('Add Nominee')}
            </Text>
          </TouchableOpacity>

          {/* Show nominee name if available */}
          {item?.n_name && (
            <Text style={styles.belowTerminateText}>
              {t('Nominee')} : {item.n_name}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState('');
  const [terminatedItems, setTerminatedItems] = useState([]);

  const handleTerminatePress = item => {
    setSelectedItem(item);
    setIsTransfer(selectedTab === 'future');
    setModalVisible(true);
    setTerminatedItems(prev => [...prev, item.ui_id]);
  };

  const confirmTerminationOrTransfer = () => {
    setModalVisible(false);
    if (isTransfer) {
      setSuccessModalVisible(true);
    } else {
      setReasonModalVisible(true);
    }
  };

  //............Submit Termination Api.............//

  const submitTerminationReason = async () => {
    if (!terminationReason?.trim()) {
      alert('Please enter a reason for termination.');
      return;
    }

    setReasonModalVisible(false);

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/terminate/contract',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ui_id: selectedItem?.ui_id,
            reason: terminationReason,
          }),
        },
      );
      console.log('Selected Item:', selectedItem?.ui_id); // Optional, for debugging
      console.log('Termination Reason:', terminationReason); // Optional

      const data = await response.json();

      if (data.result) {
        setSuccessModalVisible(true);
      } else {
        setCustomAlertMessage(
          data.message || 'Termination failed. Please try again.',
        );
        setCustomAlertVisible(true);
      }
    } catch (error) {
      console.error('Error terminating contract:', error);
      setCustomAlertMessage(
        'An error occurred while terminating the contract.',
      );
      setCustomAlertVisible(true);
    } finally {
      setTerminationReason('');
    }
  };

  //............Transfer Api.............//

  const transferContract = async (ui_id, n_id) => {
    if (!ui_id || !n_id) {
      setCustomAlertMessage('Contract ID or Nominee ID is missing.');
      setCustomAlertVisible(true);
      return;
    }

    const userId = await AsyncStorage.getItem(AppStrings.USER_ID);

    console.log('Selected Item:', ui_id, n_id); // Debugging log
    console.log('userId :', userId); // Debugging log

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/transfer/contract',
        {ui_id, n_id},
        {
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
        },
      );

      if (response.data.result) {
        setSuccessModalVisible(true);
      } else {
        setCustomAlertMessage(response.data.message || 'Transfer failed.');
        setCustomAlertVisible(true);
      }
    } catch (error) {
      console.error('Error transferring contract:', error);
      setCustomAlertMessage(
        'An error occurred while transferring the contract.',
      );
      setCustomAlertVisible(true);
    }
  };

  // Call this function when the user confirms the transfer

  const confirmTransfer = () => {
    if (!selectedItem || !selectedItem.ui_id || !selectedItem.n_id) {
      setCustomAlertMessage('Invalid contract or nominee ID.');
      setCustomAlertVisible(true);
      return;
    }
    transferContract(selectedItem.ui_id, selectedItem.n_id);
  };

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
            {t('Termination Contract')}
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
            {t('Transfer Contract')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* //............Add Bank.........// */}

      {selectedTab === 'current' ? (
        contracts?.length > 0 ? (
          <View
            style={{
              marginTop: 15,
              marginHorizontal: 20,
              marginVertical: 20,
              marginBottom: 80,
            }}>
            <FlatList
              data={contracts}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item.ui_id ? item.ui_id.toString() : index.toString()
              }
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.withdrawButtons}
              onPress={() => navigation.navigate('Investplan')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.withdrawButtonTexts}>
                  {t('Start Investment')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      ) : contracts?.length > 0 ? (
        <View
          style={{
            marginTop: 15,
            marginHorizontal: 20,
            marginVertical: 20,
            marginBottom: 80,
          }}>
          <FlatList
            data={contracts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.ui_id ? item.ui_id.toString() : index.toString()
            }
            renderItem={renderNomineeItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.withdrawButtons}
            onPress={() => navigation.navigate('Investplan')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.plusIcon}>+</Text>
              <Text style={styles.withdrawButtonTexts}>
                {t('Start Investment')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal 1 - Confirmation */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {isTransfer
                ? t('Are you sure to Transfer')
                : t('Are you sure you want to terminate')}
              <Text style={{fontWeight: 'bold'}}>
                {selectedItem?.projectName}?
              </Text>
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={confirmTerminationOrTransfer}>
                <Text style={styles.proceedButtonText}>{t('Yes')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal 2 - Reason for Termination */}
      <Modal transparent visible={reasonModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{t('Reason for Termination')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter reason..."
              value={terminationReason}
              onChangeText={setTerminationReason}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setReasonModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={submitTerminationReason}>
                <Text style={styles.proceedButtonText}>{t('Submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal 3 - Success */}
      <Modal transparent visible={successModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setSuccessModalVisible(false)}>
          <View style={styles.modalContainer1}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ImageBackground
                  source={AppImages.Successtick}
                  style={styles.backgroundImage}
                />
                <Text
                  style={[
                    isTransfer
                      ? styles.successMessageTransfer
                      : styles.successMessageTermination,
                  ]}>
                  {isTransfer
                    ? t('Transfer Successful')
                    : t(
                        'Your Termination Documents has been sent for verification, we will update after 24hrs',
                      )}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setSuccessModalVisible(false);
                    navigation.navigate('Profile');
                  }}>
                  <Text style={styles.buttonText}>{t('Back To profile')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CustomAlert
        visible={customAlertVisible}
        message={customAlertMessage}
        onClose={() => setCustomAlertVisible(false)}
      />
    </View>
  );
};

export default Contracts;

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
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  terminateButton: {
    backgroundColor: AppColors.red,

    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  terminateText: {
    color: '#fff',
    fontSize: 12,
    // fontWeight: 'bold',
  },
  belowTerminateText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: AppColors.Black,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: AppColors.Black,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.Black,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: AppColors.Black,
    fontWeight: '500',
  },
  proceedButton: {
    flex: 1,
    marginLeft: 5,
    padding: 15,
    borderRadius: 8,

    backgroundColor: AppColors.Yellow,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: '500',
  },
  textInput: {
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: AppColors.Grey,
  },
  backgroundImage: {
    width: 150,
    height: 150,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  successMessageTermination: {
    fontSize: 15,
    color: AppColors.red,
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessageTransfer: {
    fontSize: 21,
    color: '#A6BCFF',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    // fontFamily: 'serif',
  },

  successMessage1: {
    fontSize: 13,
    color: AppColors.red,
    marginBottom: 25,
  },
  button: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 8, // Increase button padding
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18, // Increase font size
    color: 'white',
    fontFamily: 'serif',
    // fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalContent: {
    width: 350, // Increase width
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 30, // Increase padding for more spacing
  },
});
