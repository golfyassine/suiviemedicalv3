import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SucreScreen() {
  const [sucre, setSucre] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleConfirm = () => {
    if (!sucre) {
      Alert.alert('Erreur', 'Veuillez entrer un taux de sucre.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      value: sucre,
      date: new Date(),
      note: note.trim() || undefined,
    };

    setEntries([newEntry, ...entries]);
    Alert.alert('Succès', `Taux de sucre enregistré : ${sucre} mg/dL`);
    setSucre('');
    setNote('');
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
          onPress: () => setEntries(entries.filter(entry => entry.id !== id)),
        },
      ]
    );
  };

  const getStatusColor = (value) => {
    const numValue = parseFloat(value);
    if (numValue < 70) return '#ff4444';
    if (numValue > 180) return '#ffbb33';
    return '#00C851';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Ajouter un taux de sucre
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              keyboardType="numeric"
              placeholder="Taux de sucre (mg/dL)"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={sucre}
              onChangeText={setSucre}
            />

            <TextInput
              style={[styles.input, styles.noteInput, isDark && styles.inputDark]}
              placeholder="Note (optionnel)"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={note}
              onChangeText={setNote}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#2196f3' }]}
              onPress={handleConfirm}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyContainer}>
            <Text style={[styles.historyTitle, isDark && styles.titleDark]}>
              Historique
            </Text>
            {entries.map((entry) => (
              <View
                key={entry.id}
                style={[styles.entryCard, isDark && styles.entryCardDark]}
              >
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryValue, { color: getStatusColor(entry.value) }]}>
                    {entry.value} mg/dL
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteEntry(entry.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.entryDate, isDark && styles.textDark]}>
                  {entry.date.toLocaleString()}
                </Text>
                {entry.note && (
                  <Text style={[styles.entryNote, isDark && styles.textDark]}>
                    {entry.note}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  containerDark: {
    backgroundColor: '#1a237e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1565c0',
  },
  titleDark: {
    color: '#90caf9',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1565c0',
  },
  inputDark: {
    borderColor: '#3949ab',
    backgroundColor: '#283593',
    color: '#e3f2fd',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1565c0',
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  entryCardDark: {
    backgroundColor: '#283593',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  entryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  entryDate: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  entryNote: {
    fontSize: 14,
    color: '#1976d2',
    fontStyle: 'italic',
  },
  textDark: {
    color: '#e3f2fd',
  },
  deleteButton: {
    padding: 5,
  },
});
