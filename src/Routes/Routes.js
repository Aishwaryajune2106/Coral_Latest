import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Login/Login';
import Bottom from '../Screens/BottomTab/Bottom';
import {useAuthorization} from './AuthProvider';
import CreateAccount from '../Screens/Login/CreateAccount';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import ChangePassword from '../Screens/Login/ChangePassword';

import Header from '../Components/Header';
import InvestmentPlan from '../Screens/InvestmentPlan/InvestmentPlan';

import BankList from '../Screens/BankList';
import NewBank from '../Screens/NewBank';
import TransactionList from '../Screens/TransactionList';
import Documents from '../Screens/Documents';
import Termination from '../Screens/Termination';
import LockingPeriod from '../Screens/LockingPeriod';
import TransferContract from '../Screens/TransferContract';
import Investstep1 from '../Screens/Investstep1';

import Terminationlist from '../Screens/Terminationlist';
import Maintenance from '../Screens/Maintenance';
import ContractList from '../Screens/ContractList';

import PaymentScreen from '../Screens/PaymentScreen';
import LockList from '../Screens/LockList';
import LaunchScreen from '../Screens/Login/LaunchScreen';
import SplashScreen from '../Screens/Login/SplashScreen';
import VerifyEmail from '../Screens/Login/VerifyEmail';
import SetPassword from '../Screens/Login/SetPassword';
import CreatePin from '../Screens/Login/CreatePin';
import ConfirmPin from '../Screens/Login/ConfirmPin';
import SetPinSuccess from '../Screens/Login/SetPinSuccess';
import RegisterSuccess from '../Screens/Login/RegisterSuccess';
import RegisterFail from '../Screens/Login/RegisterFail';

import ForgotPin from '../Screens/Login/ForgotPin';
import VerifyPinEmail from '../Screens/Login/VerifyPinEmail';
import KycOne from '../Screens/Login/KycOne';
import Kyctwo from '../Screens/Login/Kyctwo';
import RegisterVerifyemail from '../Screens/Login/RegisterVerifyemail';
import Kycthree from '../Screens/Login/Kycthree';
import Photocard from '../Screens/Login/Photocard';
import Bankkycone from '../Screens/Login/BankKycone';
import WFA from '../Screens/Login/WFA';

import Yourphoto from '../Screens/Login/Yourphoto';
import Kyccheck from '../Screens/Login/Kyccheck';
import SetPin from '../Screens/Login/SetPin';
import ForgotPinNum from '../Screens/Login/ForgotPinNum';
import CashIn from '../Screens/InvestmentPlan/CashIn';
import InvestmentReturns from '../Screens/InvestmentPlan/InvestmentReturns';
import Investmentstep3 from '../Screens/InvestmentPlan/Investmentstep3';
import Investmentstep4 from '../Screens/InvestmentPlan/Investmentstep4';
import PaymentDetail from '../Screens/InvestmentPlan/PaymentDetail';
import InvestPlanIndividual from '../Screens/InvestmentPlan/InvestPlanIndividual';
import InvestReturnIndividual from '../Screens/InvestmentPlan/InvestReturnIndividual';
import Investstep3Individual from '../Screens/InvestmentPlan/Investstep3Individual';
import Investstep4Individual from '../Screens/InvestmentPlan/Investstep4Individual';
import Withdraw from '../Screens/Withdraw/Withdraw';
import Statusviewer from '../Screens/Home/Statusviewer';
import WithdrawAmount from '../Screens/Withdraw/WithdrawAmount';
import WFA_Pin from '../Screens/Withdraw/WFA_Pin';
import Withdrawverify from '../Screens/Withdraw/Withdrawverify';
import WithdrawOtp from '../Screens/Withdraw/WithdrawOtp';
import WithdrawPinSet from '../Screens/Withdraw/WithdrawPinSet';
import WithdrawPassChange from '../Screens/Withdraw/WithdrawPassChange';
import NestEgg from '../Screens/Nest_Egg/NestEgg';
import Nest_Egg_Amount from '../Screens/Nest_Egg/Nest_Egg_Amount';
import Nest_EggWFA from '../Screens/Nest_Egg/Nest_EggWFA';
import Nest_EggLast from '../Screens/Nest_Egg/Nest_EggLast';
import Future from '../Screens/FutureOption/Future';
import FutureStep1 from '../Screens/FutureOption/FutureStep1';
import FutureStep2 from '../Screens/FutureOption/FutureStep2';

import FutureStep1Ind from '../Screens/FutureOption/FutureStep1Ind';
import FutureStep2Ind from '../Screens/FutureOption/FutureStep2Ind';
import FutureStep3Ind from '../Screens/FutureOption/FutureStep3Ind';
import FutureOptionLast from '../Screens/FutureOption/FutureOptionLast';
import Profit from '../Screens/Profit/Profit';
import Wallet from '../Screens/Wallet/Wallet';
import Notification from '../Screens/Notification/Notification';
import MarketNewsone from '../Screens/MarketNews/MarketNewsone';
import MarketNewstwo from '../Screens/MarketNews/MarketNewstwo';
import AddBank from '../Screens/Bank/AddBank';
import HeaderCenter from '../Components/HeaderCenter';
import AddNominee from '../Screens/Nominee/AddNominee';
import SaveNominee from '../Screens/Nominee/SaveNominee';
import Cwi from '../Screens/CWI_Invest/Cwi';
import Cwi_Security from '../Screens/CWI_Invest/Cwi_Security';
import Cwi_Bank from '../Screens/CWI_Invest/Cwi_Bank';
import Cwi_Upload from '../Screens/CWI_Invest/Cwi_Upload';
import Profile from '../Screens/Profile/Profile';
import EditProfile from '../Screens/Profile/EditProfile';
import LanguageList from '../Screens/Language/LanguageList';
import Privacy from '../Screens/Privacypolicy/Privacy';
import Bank from '../Screens/Bank/Bank';
import EditBank from '../Screens/Bank/EditBank';
import Kycview from '../Screens/Kyc/Kycview';
import Contracts from '../Screens/Contracts/Contracts';
import YourLogs from '../Screens/YourLogs/YourLogs';
import Referral from '../Screens/Referral/Referral';
import Contactus from '../Screens/Contact/Contact';
import Profileinfo from '../Screens/Profile/Profileinfo';
import Faq from '../Screens/Faq/Faq';
import Cwi_Amount from '../Screens/CWI_Invest/Cwi_Amount';
import {useTranslation} from 'react-i18next';
import Futureoption3 from '../Screens/FutureOption/Futureoption3';
import Futureoption4 from '../Screens/FutureOption/Futureoption4';
import NomineeList from '../Screens/Contracts/NomineeList';
import Cwigraph from '../Screens/CWI_Invest/Cwigraph';
import PinGenerate from '../Screens/PinGenerate/PinGenerate';
import PinConfirm from '../Screens/PinGenerate/PinConfirm';

const Stack = createNativeStackNavigator();

function AuthStack() {
  const {t, i18n} = useTranslation();
  console.log('Authstack');
  return (
    <Stack.Navigator headerMode={'none'} initialRouteName="SplashScreen">
      <Stack.Screen
        name="LaunchScreen"
        component={LaunchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotScreen"
        component={ForgotPassword}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SetPassword"
        component={SetPassword}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CreatePinScreen"
        component={CreatePin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConfirmPinScreen"
        component={ConfirmPin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SetPinScreen"
        component={SetPin}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SetPinSuccessScreen"
        component={SetPinSuccess}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="RegisterSuccessScreen"
        component={RegisterSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterFailScreen"
        component={RegisterFail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterVerifyemailScreen"
        component={RegisterVerifyemail}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ForgotPinScreen"
        component={ForgotPin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPinNumScreen"
        component={ForgotPinNum}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="VerifyPinEmailScreen"
        component={VerifyPinEmail}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="KycOneScreen"
        component={KycOne}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="KycTwoScreen"
        component={Kyctwo}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="KycthreeScreen"
        component={Kycthree}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PhotocardScreen"
        component={Photocard}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="BankkyconeScreen"
        component={Bankkycone}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WfaScreen"
        component={WFA}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="YourphotoScreen"
        component={Yourphoto}
        options={({navigation}) => ({
          header: () => <Header pageName={t('KYC')} navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="KyccheckScreen"
        component={Kyccheck}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CashInScreen"
        component={CashIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InvestReturnScreen"
        component={InvestmentReturns}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Investmentstep3Screen"
        component={Investmentstep3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Investmentstep4Screen"
        component={Investmentstep4}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentDetailScreen"
        component={PaymentDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InvestPlanIndividualScreen"
        component={InvestPlanIndividual}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Investplan"
        component={InvestmentPlan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InvestReturnIndividualScreen"
        component={InvestReturnIndividual}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Investstep3IndividualScreen"
        component={Investstep3Individual}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Investstep4IndividualScreen"
        component={Investstep4Individual}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Statusviewerscreen"
        component={Statusviewer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Cash Out')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Withdrawamount"
        component={WithdrawAmount}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Cash Out')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="WFA_PinScreen"
        component={WFA_Pin}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Cash Out')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="WithdrawverifyScreen"
        component={Withdrawverify}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WithdrawOtpScreen"
        component={WithdrawOtp}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WithdrawPinSetScreen"
        component={WithdrawPinSet}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WithdrawPassChangeScreen"
        component={WithdrawPassChange}
        options={({navigation}) => ({
          header: () => <Header pageName="" navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="NestEggScreen"
        component={NestEgg}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Nest Egg')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="NestEggAmountScreen"
        component={Nest_Egg_Amount}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Nest Egg')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Nest_EggWFAScreen"
        component={Nest_EggWFA}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Nest Egg')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Nest_EggLastScreen"
        component={Nest_EggLast}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Nest Egg')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="FutureScreen"
        component={Future}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Future Option')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="FutureStep1Screen"
        component={FutureStep1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureStep2Screen"
        component={FutureStep2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureStep1IndScreen"
        component={FutureStep1Ind}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureStep2IndScreen"
        component={FutureStep2Ind}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureStep3IndScreen"
        component={FutureStep3Ind}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureOptionLastScreen"
        component={FutureOptionLast}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Future Option')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="FutureOption3"
        component={Futureoption3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FutureOption4"
        component={Futureoption4}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfitScreen"
        component={Profit}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Profit')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Wallet')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Notify"
        component={Notification}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('Notification')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="MarketNewsoneScreen"
        component={MarketNewsone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MarketNewstwoScreen"
        component={MarketNewstwo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddBankScreen"
        component={AddBank}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Add Bank')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="EditBankScreen"
        component={EditBank}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Edit Bank')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="AddNomineeScreen"
        component={AddNominee}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Add Nominee')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="SaveNomineeScreen"
        component={SaveNominee}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter
              pageName={t('Save Nominee')}
              navigation={navigation}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CwiSecurityScreen"
        component={Cwi_Security}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CwiScreen"
        component={Cwi}
        options={({navigation}) => ({
          header: () => (
            <Header pageName={t('CWI Investment')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="CwiAmountScreen"
        component={Cwi_Amount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CwiGraphScreen"
        component={Cwigraph}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CwiBankScreen"
        component={Cwi_Bank}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CwiUploadScreen"
        component={Cwi_Upload}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileinfoScreen"
        component={Profileinfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FaqScreen"
        component={Faq}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfile}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter
              pageName={t('Edit profile')}
              navigation={navigation}
            />
          ),
        })}
      />
      <Stack.Screen
        name="LanguageListScreen"
        component={LanguageList}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Language')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="PinGenerateScreen"
        component={PinGenerate}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PinConfirmScreen"
        component={PinConfirm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyScreen"
        component={Privacy}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter
              pageName={t('Privacy Policy')}
              navigation={navigation}
            />
          ),
        })}
      />
      <Stack.Screen
        name="BankScreen"
        component={Bank}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Bank')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="KycviewScreen"
        component={Kycview}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('KYC')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ContractsScreen"
        component={Contracts}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName={t('Contracts')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="NomineeListScreen"
        component={NomineeList}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter pageName="Nominee" navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="YourLogsScreen"
        component={YourLogs}
        options={({navigation}) => ({
          header: () => (
            <HeaderCenter
              pageName={t('Your Activities')}
              navigation={navigation}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ReferralScreen"
        component={Referral}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContactusScreen"
        component={Contactus}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DashBoardStack"
        component={DashboardStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export function DashboardStack() {
  console.log('dashboard');

  return (
    <Stack.Navigator headerMode={'none'} initialRouteName="DrawerScreen">
      <Stack.Screen
        name="DrawerScreen"
        component={Bottom}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Banklist"
        component={BankList}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Bank Details')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Newbank"
        component={NewBank}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('New Bank')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionList}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Transaction List')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Locklist"
        component={LockList}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Future Option List')} navigation={navigation} />
          ),
        })}
      />

      <Stack.Screen
        name="Terminationlist"
        component={Terminationlist}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Termination List')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Payment Details')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Maintenance"
        component={Maintenance}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Maintenance')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Document"
        component={Documents}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Documents')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Termination"
        component={Termination}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Termination')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Locking"
        component={LockingPeriod}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Locking Period')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Contractlist"
        component={ContractList}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Contract List')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferContract}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Transfer Contract')} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Investstep"
        component={Investstep1}
        options={({navigation}) => ({
          header: () => (
            <Header title={t('Investment Plan')} navigation={navigation} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
export default function Routes() {
  // const {status, authToken} = useAuthorization();
  const authToken = null;
  const status = 'signout';
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authToken !== null && status !== 'signOut' ? (
          <Stack.Screen
            name="DashBoardStack"
            component={DashboardStack}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            header={null}
            options={{headerShown: false}}
          />
          // <Stack.Screen
          //   name="DashBoardStack"
          //   component={DashboardStack}
          //   options={{headerShown: false}}
          // />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
