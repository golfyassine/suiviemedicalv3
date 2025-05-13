import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert, Linking, Modal, Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';

export default function MedecinScreen() {
  const [message, setMessage] = useState('');
  const [treatments, setTreatments] = useState([
    {
      id: '1',
      name: 'Metformine',
      dosage: '500mg',
      frequency: '2 fois par jour',
      startDate: '2024-01-01',
      status: 'active',
      nextDose: '2024-03-20 20:00',
      notes: 'À prendre pendant les repas',
    },
    {
      id: '2',
      name: 'Insuline',
      dosage: '10 unités',
      frequency: 'Avant chaque repas',
      startDate: '2024-01-01',
      status: 'active',
      nextDose: '2024-03-20 12:00',
      notes: 'À ajuster selon la glycémie',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString(),
    status: 'active',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('startDate');

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
      action: () => Alert.alert('Prise de rendez-vous', 'Fonctionnalité à venir'),
    },
  ];

  const handleTreatmentAction = (treatment, action) => {
    const confirm = (title, message, onConfirm) => {
      Alert.alert(title, message, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'OK', onPress: onConfirm }
      ]);
    };

    if (action === 'edit') {
      setEditingTreatment(treatment);
      setNewTreatment(treatment);
      setShowAddModal(true);
    } else if (action === 'delete') {
      confirm('Supprimer', 'Supprimer ce traitement ?', () =>
        setTreatments(treatments.filter(t => t.id !== treatment.id)));
    } else if (action === 'pause') {
      confirm('Pause', 'Mettre ce traitement en pause ?', () =>
        setTreatments(treatments.map(t => t.id === treatment.id ? { ...t, status: 'paused' } : t)));
    } else if (action === 'complete') {
      confirm('Terminer', 'Marquer comme terminé ?', () =>
        setTreatments(treatments.map(t => t.id === treatment.id ? { ...t, status: 'completed' } : t)));
    }
  };

  const handleSaveTreatment = () => {
    if (!newTreatment.name || !newTreatment.dosage || !newTreatment.frequency) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingTreatment) {
      setTreatments(treatments.map(t =>
        t.id === editingTreatment.id ? { ...t, ...newTreatment } : t));
    } else {
      setTreatments([...treatments, { ...newTreatment, id: Date.now().toString() }]);
    }

    setShowAddModal(false);
    setEditingTreatment(null);
    setNewTreatment({
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString(),
      status: 'active',
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewTreatment({ ...newTreatment, [dateField]: selectedDate.toISOString() });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00C851';
      case 'paused': return '#ffbb33';
      case 'completed': return '#ff4444';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'paused': return 'En pause';
      case 'completed': return 'Terminé';
      default: return '';
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Contact Médecin</Text>
      {contactOptions.map((opt) => (
        <TouchableOpacity key={opt.id} onPress={opt.action} style={{ flexDirection: 'row', marginVertical: 5 }}>
          <Ionicons name={opt.icon} size={20} color="#2196f3" />
          <Text style={{ marginLeft: 10 }}>{opt.title}</Text>
        </TouchableOpacity>
      ))}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Mes traitements</Text>
        {treatments.map(t => (
          <View key={t.id} style={{ marginVertical: 10, padding: 10, backgroundColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold' }}>{t.name}</Text>
            <Text>Dosage : {t.dosage}</Text>
            <Text>Fréquence : {t.frequency}</Text>
            <Text style={{ color: getStatusColor(t.status) }}>{getStatusText(t.status)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
