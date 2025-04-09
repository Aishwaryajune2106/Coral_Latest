import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import AppColors from '../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const CustomAlert = ({visible, onClose, title, message}) => {
  const {t, i18n} = useTranslation();

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{title}</Text>
              <Text style={styles.alertMessage}>{message}</Text>
              <TouchableOpacity onPress={onClose} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>{t('OK')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: AppColors.Blue,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomAlert;
