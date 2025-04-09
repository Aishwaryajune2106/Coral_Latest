import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import axios from 'axios';

const Faq = ({navigation}) => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const user_id = await AsyncStorage.getItem(AppStrings.USER_ID);
      try {
        const userId = user_id; // Replace with actual user_id
        const response = await axios.get(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/faq',
          {
            headers: {user_id: userId},
          },
        );
        if (response.data.result) {
          setFaqs(response.data.data);
        } else {
          setError('Failed to fetch FAQs');
        }
      } catch (err) {
        setError('An error occurred while fetching FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <Text style={styles.subtitle}>
        Everything you need to know about the product and billing.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7A5AF8" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        faqs?.map((faq, index) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleFAQ(index)}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Image
                source={openIndex === index ? AppImages.Minus : AppImages.Plus}
                style={styles.icon}
              />
            </TouchableOpacity>
            {openIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))
      )}

      <View style={styles.contactBox}>
        <View style={styles.avatarContainer}>
          <Image source={AppImages.Girl1} style={styles.avatar} />
          <Image source={AppImages.Girl2} style={styles.avatar1} />
          <Image source={AppImages.Girl3} style={styles.avatar} />
        </View>
        <Text style={styles.contactTitle}>Still have questions?</Text>
        <Text style={styles.contactSubtitle}>
          Can’t find the answer you’re looking for? Please chat with our
          friendly team.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ContactusScreen')}>
          <Text style={styles.buttonText}>Get in touch</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    width: '70%',
  },
  faqAnswer: {
    color: '#666',
    paddingTop: 5,
    width: '70%',
  },
  icon: {
    width: 20,
    height: 20,
  },
  contactBox: {
    marginTop: 30,
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 20,
    borderColor: '#fff',
  },
  avatar1: {
    width: 90, // Larger size
    height: 90, // Larger size
    borderRadius: 25,
  },

  contactTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#7A5AF8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Faq;
