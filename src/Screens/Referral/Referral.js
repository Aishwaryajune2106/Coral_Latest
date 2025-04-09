import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';

const Referral = ({navigation}) => {
  const {t} = useTranslation();
  const [referralCode, setReferralCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Simulate referral check (replace with real API call)
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
        const data = await response.json();
        if (data?.result && data?.data?.length > 0) {
          setReferralCode(data.data[0].u_referralCode);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch referral code',
            position: 'bottom',
            visibilityTime: 4000,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Something went wrong.');
      }
    };

    fetchUserData();
  }, []);

  const handleCopy = () => {
    Clipboard.setString(referralCode);

    Toast.show('Referral code copied to clipboard', Toast.LONG);
  };

  const handleShare = () => {
    Share.open({
      message: `Use my referral code: ${referralCode}`,
    }).catch(err => console.log(err));
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Referral Image */}
      <Image source={AppImages.Referalpic} style={styles.image} />

      <Text style={styles.title}>
        {t('Earn Money')}
        {'\n'}
        {t('By Refer')}
      </Text>

      <View style={styles.referralContainer}>
        <TextInput
          style={styles.referralInput}
          value={referralCode}
          editable={false}
        />
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.buttonText}>{t('Copy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>{t('SHARE')}</Text>
        </TouchableOpacity>
      </View>

      {/* Reward Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <Image
              source={AppImages.Referalcoins} // Replace with your reward image
              style={styles.rewardImage}
            />
            <Text style={styles.congratsText}>{t('Congratulations')}!</Text>
            <Text style={styles.rewardText}>
              {t('You have just earned AED 50')}
            </Text>
            <Text style={styles.infoText}>
              {t(
                'One of your friends has joined by your referral code. Do more invitations to earn more',
              )}
            </Text>

            <TouchableOpacity style={styles.inviteButton} onPress={handleShare}>
              <Text style={styles.inviteText}>{t('INVITE ANOTHER')}</Text>
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
    backgroundColor: '#07102B',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  referralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051532',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 60,
  },
  referralInput: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
  copyButton: {
    backgroundColor: '#051532',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#FEC83D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  shareText: {
    color: '#07102B',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
  rewardImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07102B',
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07102B',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  inviteButton: {
    backgroundColor: '#FEC83D',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  inviteText: {
    fontWeight: 'bold',
    color: AppColors.white,
  },
});

export default Referral;
