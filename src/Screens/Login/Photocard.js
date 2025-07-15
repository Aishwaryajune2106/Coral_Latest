import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import {useTranslation} from 'react-i18next';

const Photocard = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {backImage, frontImage, selectedCountry} = useContext(CountryContext);
  console.log(backImage, frontImage, selectedCountry, 'data');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Back Button */}
        {/* <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image source={AppImages.greaterarrow} style={styles.backArrowImage} />
      </TouchableOpacity> */}

        {/* Title */}
        <Text style={styles.title}>{t('Photo ID Card')}</Text>
        <Text style={styles.subtitle}>
          {t('Please point the camera at the ID card')}
        </Text>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{uri: frontImage.uri}} style={styles.image} />
          <View style={styles.imageSpacer} />
          <Image source={{uri: backImage.uri}} style={styles.image} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.tryAgainText}>{t('TRY AGAIN')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('BankkyconeScreen')}>
            <Text style={styles.continueText}>{t('CONTINUE')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: AppColors.Black,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: AppColors.Black,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
    color: AppColors.Black,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 50,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 200, // Height for a better proportionate image display
    resizeMode: 'contain',
  },
  imageSpacer: {
    height: 20, // Spacer between images
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  tryAgainButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 10,
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  continueButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginLeft: 10,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Photocard;
