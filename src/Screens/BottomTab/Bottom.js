import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Home/Home';

import InvestmentPlan from '../InvestmentPlan/InvestmentPlan';

import AppImages from '../../Constants/AppImages'; // Ensure AppImages points to your image sources
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import AppColors from '../../Constants/AppColors';
import MarketNewsone from '../MarketNews/MarketNewsone';
import Cwi from '../CWI_Invest/Cwi';
import {useTranslation} from 'react-i18next';

const Bottom = () => {
  const {t, i18n} = useTranslation();
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }

        setBackPressedOnce(true);
        Toast.show('Press back again to exit', Toast.SHORT);

        setTimeout(() => setBackPressedOnce(false), 2000);

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [backPressedOnce]),
  );

  const BottomTab = createBottomTabNavigator();

  const CustomTabBar = ({state, descriptors, navigation}) => (
    <View style={styles.customTabBarContainer}>
      {state?.routes?.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}>
            {options.tabBarIcon && options.tabBarIcon({focused: isFocused})}
            <Text
              style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? AppImages.violethome : AppImages.bluehome}
              style={styles.tabIcon}
            />
          ),
          tabBarLabel: t('Home'),
        }}
      />
      <BottomTab.Screen
        name="InvestmentPlan"
        component={InvestmentPlan}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? AppImages.Investment : AppImages.InvestmentOff}
              style={styles.tabIcon}
            />
          ),
          tabBarLabel: t('Asset & Growth'),
        }}
      />
      <BottomTab.Screen
        name="MarketNewsoneScreen"
        component={MarketNewsone}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? AppImages.Invest : AppImages.InvestOff}
              style={styles.tabIcon}
            />
          ),
          tabBarLabel: t('Market Insights'),
        }}
      />
      <BottomTab.Screen
        name="CWI_Investment"
        component={Cwi}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused ? AppImages.TopInvestment : AppImages.TopInvestmentOff
              }
              style={styles.tabIcon}
            />
          ),
          tabBarLabel: t('CWI Invest'),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default Bottom;

const styles = StyleSheet.create({
  customTabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: verticalScale(70),
    backgroundColor: AppColors.white,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(10),
  },
  tabIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: moderateScale(11),
    fontFamily: 'Arial',
    color: AppColors.perfectgrey,
    marginTop: verticalScale(3),
  },
  tabLabelFocused: {
    color: AppColors.DarkVioliet,
    fontWeight: 'bold',
  },
});
