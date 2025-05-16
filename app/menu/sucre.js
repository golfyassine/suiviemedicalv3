import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { config } from '../conf/config';

export default function SucreScreen() {
  const [sucre, setSucre] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchEntries();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${config.baseurl}/sucre/liste`);
      const data = await response.json();

      // Convertir chaque date en objet Date si nécessaire
      const parsed = data.map(item => ({
        ...item,
        date: item.date && item.date._seconds
          ? new Date(item.date._seconds * 1000)
          : new Date(item.date),
      }));

      setEntries(parsed);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les données');
    }
  };

  const handleConfirm = async () => {
    if (!sucre) {
      Alert.alert('Erreur', 'Veuillez entrer un taux de glycémie.');
      return;
    }

    const valeurCorrigee = sucre.replace(',', '.');

    try {
      const response = await fetch(`${config.baseurl}/sucre/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valeurCorrigee, note }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', `Taux de glycémie enregistré : ${data.value} mg/dL`);
        setSucre('');
        setNote('');
        fetchEntries();
      } else {
        Alert.alert('Erreur', data.error || 'Erreur serveur');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder la donnée');
    }
  };

  const deleteEntry = (id) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous supprimer cette entrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${config.baseurl}/sucre/supprimer/${id}`, {
                method: 'DELETE'
              });
              if (response.ok) fetchEntries();
              else Alert.alert('Erreur', 'Impossible de supprimer');
            } catch {
              Alert.alert('Erreur', 'Erreur serveur');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (value) => {
    if (value < 70) return '#ff4444';     // hypoglycémie
    if (value > 180) return '#ffbb33';    // hyperglycémie
    return '#00C851';                     // normal
  };

  const renderEntry = ({ item }) => {
    console.log('Item date:', item.date);

    let dateAffichee = 'Date invalide';
    try {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        dateAffichee = d.toLocaleString();
      }
    } catch (e) {}

    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={[styles.entryValue, { color: getStatusColor(item.value) }]}>
            {item.value} mg/dL
          </Text>
          <TouchableOpacity onPress={() => deleteEntry(item.id)}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text>
          </TouchableOpacity>
        </View>
        <Text>{dateAffichee}</Text>
        {item.note ? <Text style={{ fontStyle: 'italic' }}>{item.note}</Text> : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Ajouter un taux de glycémie</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="Taux de sucre (mg/dL)"
                value={sucre}
                onChangeText={setSucre}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Note (optionnel)"
                value={note}
                onChangeText={setNote}
                multiline
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleConfirm}>
                <Text style={{ color: 'white' }}>Enregistrer</Text>
              </TouchableOpacity>
              <Text style={[styles.title, { marginTop: 20 }]}>Historique</Text>
            </>
          }
          data={entries}
          keyExtractor={item => item.id}
          renderItem={renderEntry}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  entryCard: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  entryValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
