import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import AppColors from '../../Constants/AppColors';
import CountryContext from '../../Context/CountryContext';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

const MarketNewstwo = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketNews = async () => {
      try {
        const response = await axios.post(
          'https://coral.lunarsenterprises.com/wealthinvestment/user/news/api',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.result) {
          setNewsData(response.data.data);
        } else {
          setError('Failed to retrieve data.');
        }
      } catch (error) {
        setError('Error fetching news.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketNews();
  }, []);

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening link:', err),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AppImages.Investimg} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={AppImages.Leftarrow}
            style={[
              styles.backIcon,
              i18n.language === 'ar' ? {transform: [{scaleX: -1}]} : {},
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('Market News / Insight')}</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View style={{marginHorizontal: 30, marginVertical: 20}}>
          <Text style={styles.newsTitle}>Headlines</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={{marginTop: 20}}
          />
        ) : newsData?.length > 0 ? (
          newsData.map((newsItem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.newsContainer}
              onPress={() => openLink(newsItem.link)}>
              <Text style={styles.newsHeadline}>{newsItem.headline}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{textAlign: 'center', padding: 20}}>
            No news available
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 220,
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.black,
  },
  newsContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  newsHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.NavyBlue,
  },
});

export default MarketNewstwo;
