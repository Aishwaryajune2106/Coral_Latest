import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppImages from '../Constants/AppImages';

const TransactionList = () => {
  const transactions = [
    {
      id: '1',
      type: 'Money Withdrawn',
      entity: 'Legend Maritime',
      amount: '-3,543.00',
      isPositive: false,
    },
    {
      id: '2',
      type: 'Money Invested',
      entity: 'Bright Future Corp',
      amount: '+55,500.55',
      isPositive: true,
    },
  ];
  return (
    <View style={styles.bottomSection}>
      <View style={styles.transactionSection}>
        <Text style={styles.transactionTitle}>Recent Transaction</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.transactionCard}>
            <Image
              source={
                item.isPositive
                  ? AppImages.MoneyflowGreen
                  : AppImages.MoneyflowRed
              }
              style={styles.transactionIcon}
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionEntity}>{item.entity}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {color: item.isPositive ? '#4CAF50' : '#F44336'},
              ]}>
              {item.amount}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.transactionList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  bottomSection: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Off-white background color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  transactionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#000000',
    fontWeight: 'bold',
  },

  transactionList: {
    marginTop: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    tintColor: '#000000',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#000000',
  },
  transactionEntity: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#555555',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
});
