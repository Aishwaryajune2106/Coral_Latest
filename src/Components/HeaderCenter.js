import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppImages from '../Constants/AppImages';
import { useTranslation } from 'react-i18next';
const HeaderCenter = ({pageName, navigation}) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image source={AppImages.Blackbackicon}  style={[
              styles.backIcon,
              i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
            ]} />
      </TouchableOpacity>

      {/* Page Name */}
      <Text style={styles.pageName}>{pageName}</Text>
    </View>
  );
};

export default HeaderCenter;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
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
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 13,
  },
});
