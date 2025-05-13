import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const plats = [
  {
    id: '1',
    nom: 'Salade quinoa et légumes',
    description: 'Riche en fibres et faible en sucre. Parfait pour le déjeuner.',
    moment: 'Déjeuner',
    calories: 320,
    glucides: 45,
    image: 'https://example.com/quinoa.jpg',
    favori: false,
  },
  {
    id: '2',
    nom: 'Filet de poulet grillé',
    description: 'Source de protéines maigres. À accompagner de légumes vapeur.',
    moment: 'Dîner',
    calories: 280,
    glucides: 0,
    image: 'https://example.com/poulet.jpg',
    favori: false,
  },
  {
    id: '3',
    nom: 'Yaourt nature et amandes',
    description: 'Collation saine à IG bas pour le matin ou l\'après-midi.',
    moment: 'Collation',
    calories: 180,
    glucides: 12,
    image: 'https://example.com/yaourt.jpg',
    favori: false,
  },
  {
    id: '4',
    nom: 'Smoothie avocat-épinard',
    description: 'Riche en bons lipides et vitamines, sans sucre ajouté.',
    moment: 'Petit déjeuner',
    calories: 250,
    glucides: 15,
    image: 'https://example.com/smoothie.jpg',
    favori: false,
  },
];

export default function PlatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [platsList, setPlatsList] = useState(plats);
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

  const toggleFavori = (id) => {
    setPlatsList(platsList.map(plat =>
      plat.id === id ? { ...plat, favori: !plat.favori } : plat
    ));
  };

  const filteredPlats = platsList.filter(plat => {
    const matchesSearch = plat.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMoment = !selectedMoment || plat.moment === selectedMoment;
    return matchesSearch && matchesMoment;
  });

  const moments = Array.from(new Set(plats.map(plat => plat.moment)));

  const renderPlat = ({ item }) => (
    <Animated.View style={[styles.card, isDark && styles.cardDark, { opacity: fadeAnim }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.nom, isDark && styles.textDark]}>{item.nom}</Text>
        <TouchableOpacity onPress={() => toggleFavori(item.id)}>
          <Ionicons
            name={item.favori ? 'heart' : 'heart-outline'}
            size={24}
            color={item.favori ? '#f4511e' : isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.momentContainer}>
        <Ionicons name="time-outline" size={16} color="#f4511e" />
        <Text style={[styles.moment, isDark && styles.textDark]}>{item.moment}</Text>
      </View>

      <Text style={[styles.description, isDark && styles.textDark]}>
        {item.description}
      </Text>

      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionItem}>
          <Ionicons name="flame-outline" size={16} color="#f4511e" />
          <Text style={[styles.nutritionText, isDark && styles.textDark]}>
            {item.calories} kcal
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Ionicons name="nutrition-outline" size={16} color="#f4511e" />
          <Text style={[styles.nutritionText, isDark && styles.textDark]}>
            {item.glucides}g glucides
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Suggestions de plats
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={isDark ? '#fff' : '#333'} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Rechercher un plat..."
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.momentFilter}
      >
        <TouchableOpacity
          style={[
            styles.momentButton,
            !selectedMoment && styles.momentButtonActive,
          ]}
          onPress={() => setSelectedMoment(null)}
        >
          <Text style={[
            styles.momentButtonText,
            !selectedMoment && styles.momentButtonTextActive,
          ]}>
            Tous
          </Text>
        </TouchableOpacity>
        {moments.map(moment => (
          <TouchableOpacity
            key={moment}
            style={[
              styles.momentButton,
              selectedMoment === moment && styles.momentButtonActive,
            ]}
            onPress={() => setSelectedMoment(moment)}
          >
            <Text style={[
              styles.momentButtonText,
              selectedMoment === moment && styles.momentButtonTextActive,
            ]}>
              {moment}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredPlats.length === 0 ? (
        <Text style={[styles.noData, isDark && styles.textDark]}>
          Aucun plat ne correspond à votre recherche
        </Text>
      ) : (
        <FlatList
          data={filteredPlats}
          keyExtractor={(item) => item.id}
          renderItem={renderPlat}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#1a237e',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
    color: '#1565c0',
  },
  searchInputDark: {
    color: '#e3f2fd',
  },
  momentFilter: {
    marginBottom: 15,
  },
  momentButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  momentButtonActive: {
    backgroundColor: '#2196f3',
    transform: [{ scale: 1.05 }],
  },
  momentButtonText: {
    color: '#1565c0',
    fontWeight: '500',
  },
  momentButtonTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  cardDark: {
    backgroundColor: '#283593',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    flex: 1,
  },
  momentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moment: {
    fontSize: 12,
    color: '#2196f3',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 10,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  textDark: {
    color: '#fff',
  },
});
