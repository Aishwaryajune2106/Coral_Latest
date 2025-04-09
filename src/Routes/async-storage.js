import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../Constants/AppStrings';

export async function getItem() {
  const value = await AsyncStorage.getItem(AppStrings.IS_LOGIN);
  return value ? value : null;
}

export async function setItem(value) {
  return AsyncStorage.setItem(AppStrings.DEVICE_TOKEN, value);
}
export async function removeItem() {
  return AsyncStorage.removeItem(AppStrings.DEVICE_TOKEN);
}
