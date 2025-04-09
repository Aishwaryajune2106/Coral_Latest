import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppImages from '../Constants/AppImages';
import { useTranslation } from 'react-i18next';

const Header = ({pageName, navigation}) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow and Page Name */}
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
        <Text style={styles.pageName}>{pageName}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
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
    marginLeft: 10, // Adjust spacing between the icon and text
  },
});
