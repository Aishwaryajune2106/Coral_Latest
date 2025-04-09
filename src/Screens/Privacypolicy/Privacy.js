import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

const Privacy = () => {
  const {t} = useTranslation();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{t('Privacy Policy')}</Text>
      <Text style={styles.text}>{t('privacy1')}</Text>

      <Text style={styles.heading}>{t('Interpretation')}</Text>
      <Text style={styles.text}>{t('privacy2')}</Text>

      <Text style={styles.heading}>
        {t('Collecting and Using Your Personal Data')}
      </Text>
      <Text style={styles.text}>{t('privacy6')}</Text>
      <Text style={styles.heading}>{t('Tracking')}</Text>
      <Text style={styles.text}>{t('privacy3')}</Text>
      <Text style={styles.heading}>{t('Retention')}</Text>
      <Text style={styles.text}>{t('privacy4')}</Text>
      <Text style={styles.heading}>{t('Transfer Data')}</Text>
      <Text style={[styles.text, {marginBottom: 50}]}>{t('privacy5')}</Text>
    </ScrollView>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    lineHeight: 20,
  },
});
