import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid'; // ✅ Import compatible Hermes

export default function TraitementScreen() {
  const [traitements, setTraitements] = useState([]);
  const [typeDiabete, setTypeDiabete] = useState('Type 1');
  const [utiliseInsuline, setUtiliseInsuline] = useState(false);
  const [infosEnEdition, setInfosEnEdition] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleInfosEdition = () => setInfosEnEdition(!infosEnEdition);

  const ajouterTraitement = () => {
    setTraitements([
      ...traitements,
      {
        id: uuid.v4(), // ✅ ID compatible
        description: '',
        medicaments: [],
        enEdition: false,
      },
    ]);
  };

  const toggleEdition = (id) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, enEdition: !t.enEdition } : t
      )
    );
  };

  const modifierTraitement = (id, champ, valeur) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [champ]: valeur } : t
      )
    );
  };

  const ajouterMedicament = (traitementId) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: [
                ...t.medicaments,
                { id: uuid.v4(), nom: '', moment: [] }, // ✅ ID compatible
              ],
            }
          : t
      )
    );
  };

  const modifierMedicament = (
    traitementId,
    medicamentId,
    champ,
    valeur
  ) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: t.medicaments.map((m) =>
                m.id === medicamentId ? { ...m, [champ]: valeur } : m
              ),
            }
          : t
      )
    );
  };

  const supprimerMedicament = (traitementId, medicamentId) => {
    setTraitements((prev) =>
      prev.map((t) =>
        t.id === traitementId
          ? {
              ...t,
              medicaments: t.medicaments.filter((m) => m.id !== medicamentId),
            }
          : t
      )
    );
  };

  const supprimerTraitement = (id) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce traitement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () =>
            setTraitements((prev) => prev.filter((t) => t.id !== id)),
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Ionicons
          name="medical-outline"
          size={50}
          color={isDark ? "#bb86fc" : "#2196f3"}
          style={styles.headerIcon}
        />
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Mes traitements
        </Text>
      </View>

      {/* Bloc des informations générales */}
      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <View style={styles.headerRow}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>
            Informations médicales
          </Text>
          <TouchableOpacity onPress={toggleInfosEdition}>
            <Ionicons
              name={infosEnEdition ? "checkmark-circle" : "create"}
              size={20}
              color="#2196f3"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.textDark]}>Type de diabète :</Text>
          {infosEnEdition ? (
            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() =>
                setTypeDiabete(typeDiabete === 'Type 1' ? 'Type 2' : 'Type 1')
              }
            >
              <Text style={[styles.toggleBtnText, isDark && styles.textDark]}>{typeDiabete}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.readonlyInput, isDark && styles.textDark]}>{typeDiabete}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.textDark]}>Utilise insuline :</Text>
          {infosEnEdition ? (
            <Switch
              value={utiliseInsuline}
              onValueChange={setUtiliseInsuline}
              trackColor={{ false: '#90caf9', true: '#2196f3' }}
              thumbColor={utiliseInsuline ? '#fff' : '#f4f3f4'}
            />
          ) : (
            <Text style={[styles.readonlyInput, isDark && styles.textDark]}>
              {utiliseInsuline ? 'Oui' : 'Non'}
            </Text>
          )}
        </View>
      </View>

      {/* Liste des traitements */}
      {traitements.map((traitement) => (
        <View key={traitement.id} style={[styles.traitementCard, isDark && styles.traitementCardDark]}>
          <View style={styles.headerRow}>
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Traitement #{traitement.id.slice(0, 8)}{/* Affiche les 8 premiers caractères UUID */}
            </Text>
            <TouchableOpacity onPress={() => toggleEdition(traitement.id)}>
              <Ionicons
                name={traitement.enEdition ? "checkmark-circle" : "create"}
                size={20}
                color="#2196f3"
              />
            </TouchableOpacity>
          </View>

          {traitement.enEdition && (
            <TextInput
              placeholder="Description du traitement"
              style={[styles.input, isDark && styles.inputDark]}
              value={traitement.description}
              onChangeText={(text) =>
                modifierTraitement(traitement.id, 'description', text)
              }
              placeholderTextColor={isDark ? '#bbb' : '#888'}
            />
          )}

          {traitement.medicaments.map((medicament) => (
            <View key={medicament.id} style={styles.medicamentRow}>
              {traitement.enEdition ? (
                <TextInput
                  placeholder="Nom du médicament"
                  style={[styles.input, isDark && styles.inputDark]}
                  value={medicament.nom}
                  onChangeText={(text) =>
                    modifierMedicament(traitement.id, medicament.id, 'nom', text)
                  }
                  placeholderTextColor={isDark ? '#bbb' : '#888'}
                />
              ) : (
                <Text style={[styles.readonlyInput, isDark && styles.textDark]}>{medicament.nom}</Text>
              )}

              <View style={styles.momentContainer}>
                {['Matin', 'Midi', 'Soir'].map((moment, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.momentButton,
                      medicament.moment.includes(moment) && styles.momentButtonActive,
                      isDark && styles.momentButtonDark,
                    ]}
                    onPress={() => {
                      const isChecked = medicament.moment.includes(moment);
                      if (isChecked) {
                        modifierMedicament(
                          traitement.id,
                          medicament.id,
                          'moment',
                          medicament.moment.filter((m) => m !== moment)
                        );
                      } else {
                        modifierMedicament(
                          traitement.id,
                          medicament.id,
                          'moment',
                          [...medicament.moment, moment]
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.momentText,
                        medicament.moment.includes(moment) && styles.momentTextActive,
                        isDark && styles.textDark,
                      ]}
                    >
                      {moment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {traitement.enEdition && (
                <TouchableOpacity
                  style={styles.deleteMedicamentButton}
                  onPress={() => supprimerMedicament(traitement.id, medicament.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {traitement.enEdition && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => ajouterMedicament(traitement.id)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.addButtonText}>Ajouter un médicament</Text>
            </TouchableOpacity>
          )}

          {traitement.enEdition && (
            <TouchableOpacity
              style={styles.deleteTraitementButton}
              onPress={() => supprimerTraitement(traitement.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.deleteTraitementText}>Supprimer</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.addTraitementButton}
        onPress={ajouterTraitement}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.addTraitementText}>Ajouter un traitement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  titleDark: {
    color: '#bb86fc',
  },
  infoCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textDark: {
    color: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  readonlyInput: {
    fontSize: 14,
    color: '#555',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#2196f3',
    borderRadius: 6,
  },
  toggleBtnText: {
    color: '#fff',
    fontSize: 14,
  },
  traitementCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  traitementCardDark: {
    backgroundColor: '#1f1f1f',
    borderColor: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicamentRow: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderColor: '#444',
  },
  momentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  momentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    margin: 4,
    borderRadius: 6,
  },
  momentButtonActive: {
    backgroundColor: '#2196f3',
  },
  momentButtonDark: {
    backgroundColor: '#444',
  },
  momentText: {
    color: '#2196f3',
    fontSize: 12,
  },
  momentTextActive: {
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  addTraitementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addTraitementText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  deleteMedicamentButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  deleteTraitementButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteTraitementText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  buttonIcon: {
    marginRight: 5,
  },
});

