import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const LockingPeriod = () => {
  const navigation = useNavigation();
  const [principal, setPrincipal] = useState('');
  const [time, setTime] = useState('');
  const [selectedProject, setSelectedProject] = useState('any');
  const [selectedWF, setSelectedWF] = useState('Monthly'); // Added Withdrawal Frequency state
  const [projectOptions, setProjectOptions] = useState([]);
  const [maturity, setMaturity] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [message, setMessage] = useState(null);
  const [waveData, setWaveData] = useState([]); // For wave graph data
  const [errorMessage, setErrorMessage] = useState('');
  const [profitSharingModel, setProfitSharingModel] = useState(null);
  const [withdrawalFrequency, setWithdrawalFrequency] = useState(null);

  // Fetch project options
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/project/list',
          {},
        );
        if (response.data.result) {
          const projects = response?.data?.data?.map(project => ({
            label: project.ci_industry,
            value: project.ci_industry,
          }));

          // Add "Any" option only if it doesn't already exist
          const hasAnyOption = projects.some(
            project => project.label.toLowerCase() === 'any',
          );
          const updatedProjects = hasAnyOption
            ? projects
            : [{label: 'Any', value: 'any'}, ...projects];

          setProjectOptions(updatedProjects);
        }
      } catch (error) {
        console.error(error);
        // Handle error fetching projects
      }
    };

    fetchProjects();
  }, []);

  // Calculate Maturity Amount and Graph
  const calculateMaturity = async () => {
    if (!principal || !time) {
      Toast.show('Please fill in all the fields.', Toast.LONG);
      return;
    }

    const investmentAmount = parseFloat(principal);

    // Validation based on the selected project
    if (selectedProject === 'any') {
      if (investmentAmount < 52000) {
        setErrorMessage(
          'For the "Any" project, the investment amount should be greater than 52,000 AED.',
        );
        return;
      }
    } else{
      if (investmentAmount < 100000) {
        setErrorMessage(
          'For this project, the investment amount should be greater than 1,00,000 AED.',
        );
        return;
      }
    }

    setErrorMessage(''); // Clear the error message if validation passes

    const user_id = await AsyncStorage.getItem('user_id');

    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/calculator',
        {
          amount: principal,
          year: time,
          wf: selectedWF,
          project: selectedProject,
          platform: 'mobile',
        },
        {
          headers: {
            Accept: 'application/json',
            user_id: user_id,
          },
        },
      );

      console.log(response.data, 'Responsee');

      console.log(
        selectedProject,
        selectedWF,
        principal,
        time,
        'selectedProjectselectedProject',
      );

      if (response.data.result) {
        const maturityAmount = response.data.return_amount;
        const maturityPercentage = response.data.percentage;
        setMaturity(maturityAmount);
        setPercentage(maturityPercentage);
        setMessage(response.data.message);

        // Generate wave graph data based on the percentage
        const waveGrowth = Array.from({length: parseInt(time)}, (_, index) => {
          return (
            parseFloat(principal) *
            Math.pow(1 + parseFloat(maturityPercentage) / 100, index + 1)
          );
        });
        setWaveData(waveGrowth);

        Toast.show('Investment calculated successfully!', Toast.LONG);
      } else {
        Toast.show('Calculation failed.', Toast.LONG);
      }
    } catch (error) {
      console.error(error);
      Toast.show('Failed to calculate investment.', Toast.LONG);
    }
  };

  // Lock the Investment
  const lockInvestment = async () => {
    if (!principal || !time || !maturity) {
      Toast.show('Please calculate first.', Toast.LONG);
      return;
    }

    const user_id = await AsyncStorage.getItem('user_id');
    try {
      const response = await axios.post(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/lock/period',
        {
          amount: principal,
          year: time,
          project: selectedProject,
        },
        {
          headers: {
            Accept: 'application/json',
            user_id: user_id, 
          },
        },
      );

      if (response.data.result) {
        setMessage('Investment locked successfully!');
        Toast.show('Investment locked successfully!', Toast.LONG);
      } else {
        Toast.show('Locking period failed.', Toast.LONG);
      }
    } catch (error) {
      console.error(error);
      Toast.show('Failed to lock investment.', Toast.LONG);
    }
  };
  return (
    <LinearGradient
      colors={['#78c1e9', '#b8dff5']}
      style={styles.gradientBackground}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Investment Combination</Text>

            {/* Investment Form */}
            <Text style={styles.label}>Investment Amount (AED)</Text>
            <TextInput
              style={styles.input}
              placeholder="Investment Amount"
              keyboardType="numeric"
              placeholderTextColor="#888"
              value={principal}
              onChangeText={setPrincipal}
            />
            {errorMessage ? (
              <Text style={{color: 'red', marginTop: 5}}>{errorMessage}</Text>
            ) : null}

            <Text style={styles.label}>Duration (in years)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Duration (in years)"
              keyboardType="numeric"
              placeholderTextColor="#888"
              value={time}
              onChangeText={setTime}
            />

            {/* Project Dropdown */}
            <Text style={styles.label}>Select Project</Text>
            <Dropdown
              style={styles.dropdown}
              data={projectOptions}
              labelField="label"
              valueField="value"
              placeholder="Select a project"
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{color: '#000', fontSize: 14}}
              value={selectedProject}
              onChange={item => setSelectedProject(item.value)}
            />

            {/* Profit Model Dropdown */}
            <Text style={styles.label}>Select Profit Model</Text>
            <Dropdown
              style={styles.dropdown}
              data={[
                {label: 'Fixed', value: 'fixed'},
                {label: 'Flexible', value: 'flexible'},
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Profit Model"
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{color: '#000', fontSize: 14}}
              value={profitSharingModel}
              onChange={item => {
                setProfitSharingModel(item.value);
                if (item.value === 'flexible') {
                  setWithdrawalFrequency(null); // Reset withdrawal frequency if Flexible is selected
                }
              }}
            />

            {/* Show Withdrawal Frequency Dropdown if "Fixed" is selected */}
            {profitSharingModel === 'fixed' && (
              <>
                <Text style={styles.label}>Select Withdrawal Frequency</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={[
                    {label: 'Monthly', value: 'monthly'},
                    {label: 'Quarterly', value: 'quarterly'},
                    {label: 'Yearly', value: 'yearly'},
                    {label: 'Half-Yearly', value: 'half-yearly'},
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Frequency"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={{color: '#000', fontSize: 14}}
                  value={withdrawalFrequency}
                  onChange={item => setWithdrawalFrequency(item.value)}
                />
              </>
            )}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.calculateButton]}
                onPress={calculateMaturity}>
                <Text style={styles.buttonText}>View Growth</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={() => {
                  setPrincipal('');
                  setTime('');
                  setMaturity(null);
                  setMessage(null);
                  setPercentage(null);
                  setWaveData([]);
                }}>
                <Text style={[styles.buttonText, styles.resetButtonText]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display Results */}
            {maturity && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  Maturity Amount: ₹ {maturity}
                </Text>
                <Text style={styles.resultSubTitle}>
                  Percentage: {percentage}
                </Text>
                <Text style={styles.resultMessage}>{message}</Text>
              </View>
            )}
            <View style={{marginBottom: 20}}></View>

            {/* Wave Graph */}
            <View style={styles.graphContainer}>
              {waveData?.length > 0 && (
                <LineChart
                  data={{
                    labels: waveData
                      ?.map((_, index) =>
                        (index + 1) % 5 === 0 ? `Year ${index + 1}` : null,
                      )
                      .filter(label => label),
                    datasets: [
                      {
                        data: waveData,
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width - 60}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#FFF',
                    backgroundGradientFrom: '#FFF',
                    backgroundGradientTo: '#FFF',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(163, 178, 111, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelFontSize: 10, // Reduce the font size for labels
                    labelRotation: 45, // Rotate labels to avoid overlap
                    propsForDots: {r: '4', strokeWidth: '2', stroke: '#b8dff5'},
                  }}
                  bezier
                  style={{borderRadius: 10}}
                />
              )}
            </View>
            <TouchableOpacity
            style={styles.investbutton}
            onPress={lockInvestment}>
            <Text style={styles.buttonText}>Lock</Text>
          </TouchableOpacity>
          </View>
          

          {/* Note */}
          <Text style={styles.noteText}>
            Lock Period will be valid only for 3 months
          </Text>
          <View style={{marginBottom: 15}}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LockingPeriod;

const styles = StyleSheet.create({
  gradientBackground: {flex: 1},
  scrollView: {flexGrow: 1, justifyContent: 'center'},
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#78c1e9',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:"black"
  },
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  label: {fontSize: 16, marginVertical: 10, color:"#000"},
  investbutton: {
    alignSelf: 'center',
    paddingHorizontal: 45,
    padding: 10,
    backgroundColor: '#78c1e9',
    borderRadius: 10,
  },

  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    width: screenWidth / 2.5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButton: {backgroundColor: '#78c1e9'},
  resetButton: {backgroundColor: '#b8dff5'},
  buttonText: {color: '#fff', fontSize: 16},
  resetButtonText: {color: '#000'},
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f1e3',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultTitle: {fontSize: 18, fontWeight: 'bold'},
  resultSubTitle: {fontSize: 16, color: '#555'},
  resultMessage: {fontSize: 14, color: '#333', textAlign: 'center'},
  noteText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  placeholderStyle: {
    color: '#000', // Light blue for placeholder
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#333', // Darker color for selected text
    fontSize: 16,
  },
});
