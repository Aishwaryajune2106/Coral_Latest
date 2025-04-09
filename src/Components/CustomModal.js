import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import AppColors from '../Constants/AppColors';
import {useTranslation} from 'react-i18next';

const CustomModal = ({visible, message, onClose, title, onConfirm}) => {
  const {t, i18n} = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <TouchableWithoutFeedback onPress={onConfirm}>
                <View style={styles.confirmButton}>
                  <Text style={styles.buttonText}>{t('OK')}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: AppColors.Black,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: AppColors.Grey,
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: AppColors.Yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: AppColors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CustomModal;
