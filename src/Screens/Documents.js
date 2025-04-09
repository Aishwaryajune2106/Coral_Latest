import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const Documents = () => {
  const documentData = [
    {
      id: '1',
      title: 'Company Registration',
      preview: 'https://example.com/registration.pdf',
      icon: 'https://via.placeholder.com/50', // Replace with actual icon
    },
    {
      id: '2',
      title: 'Tax Compliance Certificate',
      preview: 'https://example.com/tax.pdf',
      icon: 'https://via.placeholder.com/50', // Replace with actual icon
    },
    {
      id: '3',
      title: 'Annual Report 2023',
      preview: 'https://example.com/annual.pdf',
      icon: 'https://via.placeholder.com/50', // Replace with actual icon
    },
  ];

  const handlePreview = url => {
    // Code to handle preview (e.g., open in a WebView or external browser)
    console.log(`Opening document: ${url}`);
  };

  return (
    <LinearGradient
      colors={['#424649', '#21232b']}
      style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Company Documents</Text>

        <FlatList
          data={documentData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.card}>
             
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={() => handlePreview(item.preview)}>
                  <Text style={styles.previewText}>Preview</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

export default Documents;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,

    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'serif',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 8,
    backgroundColor: '#EDF2F7',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '500',
    color: '#888',
    marginBottom: 10,
  },
  previewButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
