import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function NutritionnisteScreen() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un message');
      return;
    }
    Alert.alert('Message envoyé', 'Nous vous répondrons dans les plus brefs délais');
    setMessage('');
  };

  const contactOptions = [
    {
      id: '1',
      title: 'Appeler',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:+33123456789'),
    },
    {
      id: '2',
      title: 'Envoyer un email',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:contact@example.com'),
    },
    {
      id: '3',
      title: 'Prendre rendez-vous',
      icon: 'calendar-outline',
      action: () => {
        Alert.alert('Prise de rendez-vous', 'Fonctionnalité à venir');
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Ionicons name="nutrition-outline" size={60} color="#f4511e" />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
          Contactez votre nutritionniste
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>
          Nos nutritionnistes sont disponibles pour vous accompagner dans votre suivi nutritionnel.
          N'hésitez pas à nous contacter pour toute question concernant votre alimentation.
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={option.action}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <Ionicons name={option.icon} size={24} color="#f4511e" />
            <Text style={{ marginLeft: 10 }}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Envoyer un message</Text>
        <TextInput
          placeholder="Votre message..."
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            height: 100,
            textAlignVertical: 'top'
          }}
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            backgroundColor: '#2196f3',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text>Horaires d'ouverture :</Text>
        <Text>Lundi - Vendredi : 9h - 17h</Text>
        <Text>Samedi : 9h - 12h</Text>
      </View>
    </ScrollView>
  );
}
