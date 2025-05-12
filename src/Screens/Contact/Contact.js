import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppImages from '../../Constants/AppImages';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from '../../Constants/AppStrings';
import {ScrollView} from 'react-native';

const SOCKET_SERVER_URL = 'https://coral.lunarsenterprises.com';

const Contactus = ({navigation}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null);
  const [counter, setCounter] = useState(0);

  const suggestedQuestions = [
    'Transfer contract ?',
    'Withdraw money ?',
    'Invest money ?',
    'Terminate contract ?',
    'CWI Invest ?',
    'Future Option ?',
    'Others',
  ];

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem(AppStrings.USER_ID);
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const newSocket = io(SOCKET_SERVER_URL, {transports: ['websocket']});
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', userId);
    });

    newSocket.on(userId, data => {
      if (data.message) {
        setMessages(prevMessages => [
          ...prevMessages,
          {id: Date.now().toString(), text: data.message, sender: 'admin'},
        ]);
      }
    });

    return () => newSocket.disconnect();
  }, [userId]);

  const sendMessage = async message => {
    if (!message || !userId) return;

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/message/sendMessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
          body: JSON.stringify({
            ticket_id: ticked_id, // Replace this with the actual ticket ID
            message: message,
          }),
        },
      );

      const data = await response.json();

      if (data.result) {
        setMessages(prevMessages => [
          ...prevMessages,
          {id: Date.now().toString(), text: message, sender: 'user'},
        ]);
        setInputText('');
      } else {
        console.log(data.message);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message');
    }
  };

  const [ticked_id, setTicked_id] = useState('');
  const sendTicket = async category => {
    if (!userId) return;
    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/ticket/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
          body: JSON.stringify({category}),
        },
      );

      const data = await response.json();
      setTicked_id(data.ticket_id);
      console.log(data.ticket_id, 'dataaaaaa');

      if (data.result) {
        setMessages(prevMessages => [
          ...prevMessages,
          {id: Date.now().toString(), text: category, sender: 'user'},
        ]);
        setInputText(category);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('An error occurred while creating the ticket');
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [ticked_id, userId, counter]); // Fetch messages whenever ticket_id changes
  const fetchMessages = async () => {
    if (!ticked_id || !userId) return;

    try {
      const response = await fetch(
        'https://coral.lunarsenterprises.com/wealthinvestment/user/message/listMessages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user_id: userId,
          },
          body: JSON.stringify({ticket_id: ticked_id}),
        },
      );

      const data = await response.json();

      if (data.result) {
        const formattedMessages = data.data.map(msg => ({
          id: msg.id.toString(),
          text: msg.message,
          sender: msg.sendBy,
          name: msg.sendBy === 'admin' ? msg.ad_name : msg.u_name,
        }));
        setCounter(counter + 1);
        setMessages(formattedMessages);
      } else {
        console.log(
          'Failed to retrieve messages inside fetchmessage:',
          data.message,
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image source={AppImages.Chatback} style={styles.iconImage} />
          </TouchableOpacity>

          {/* Quick Reply Buttons */}
          <FlatList
            data={suggestedQuestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => sendTicket(item)}>
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.suggestionsContainer}
          />

          {/* Chat Messages */}
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.messageWrapper,
                  item.sender === 'user'
                    ? styles.userWrapper
                    : styles.botWrapper,
                  index === messages?.length - 1 ? {marginBottom: 100} : null,
                ]}>
                {/* Sender Name */}
                {item.name && (
                  <Text style={styles.senderName}>{item.name}</Text>
                )}
                {/* Message */}
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === 'user'
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{flexGrow: 1}}
          />
        </View>
      </ScrollView>

      {/* Message Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type message"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={() => sendMessage(inputText)}>
          <Image source={AppImages.Chatsend} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backButton: {position: 'absolute', top: 20, left: 16, zIndex: 10},
  iconImage: {width: 24, height: 24, marginRight: 10},
  suggestionsContainer: {marginTop: 60},
  suggestionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionText: {fontSize: 16, fontWeight: '500', color: 'black'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {flex: 1, fontSize: 16, color: 'black'},
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1e7dd', // light green
  },
  botMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f8d7da', // light red/pink
  },
  messageText: {fontSize: 16, color: 'black'},
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  messageWrapper: {
    marginBottom: 10,
    maxWidth: '70%',
  },
  userWrapper: {
    alignSelf: 'flex-start',
  },
  botWrapper: {
    alignSelf: 'flex-end',
  },
});

export default Contactus;
