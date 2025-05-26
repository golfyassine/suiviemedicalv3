import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default function Accueil() {
  const user = {
    name: "John Doe",
    age: 30,
    weight: 85,
    height: 1.78,
    currentSugarLevel: 1.2,
    monthlySugarLevels: [1.1, 1.2, 1.3, 1.1, 1.0, 0.9],
  };

  const averageSugar = user.monthlySugarLevels.reduce((a, b) => a + b, 0) / user.monthlySugarLevels.length;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bmi = user.weight / (user.height * user.height);
  const bmiStatus =
    bmi < 18.5 ? 'Insuffisance pondérale' :
    bmi < 25 ? 'Poids normal' :
    bmi < 30 ? 'Surpoids' : 'Obésité';
  const bmiColor =
    bmi < 18.5 ? '#2196f3' :
    bmi < 25 ? '#4caf50' :
    bmi < 30 ? '#ff9800' : '#f44336';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* En-tête avec photo et informations */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.profileContainer}>
          <Image source={require('@/assets/images/profile.png')} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isDark && styles.textDark]}>{user.name}</Text>
            <Text style={[styles.userAge, isDark && styles.textDark]}>Âge : {user.age} ans</Text>
          </View>
        </View>
        <View style={[styles.quickStats, isDark && styles.quickStatsDark]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{user.weight} kg</Text>
            <Text style={[styles.statLabel, isDark && styles.textDark]}>Poids</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{user.height} m</Text>
            <Text style={[styles.statLabel, isDark && styles.textDark]}>Taille</Text>
          </View>
        </View>
      </View>

      {/* Image du corps humain */}
      <View style={[styles.bodyContainer, isDark && styles.bodyContainerDark]}>
        <Image 
          source={require('@/assets/images/corphumain.png')} 
          style={styles.bodyImage} 
          resizeMode="contain" 
        />
      </View>

      {/* Grille d'informations */}
      <View style={styles.infoGrid}>
        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <View style={styles.infoIconContainer}>
            <Text style={[styles.infoIcon, isDark && styles.textDark]}>📊</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, isDark && styles.textDark]}>Taux de sucre actuel</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{user.currentSugarLevel} g/L</Text>
          </View>
        </View>
        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <View style={styles.infoIconContainer}>
            <Text style={[styles.infoIcon, isDark && styles.textDark]}>📈</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, isDark && styles.textDark]}>Moyenne mensuelle</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{averageSugar.toFixed(2)} g/L</Text>
          </View>
        </View>
      </View>

      {/* Carte IMC */}
      <View style={[styles.bmiCard, { borderColor: bmiColor }, isDark && styles.bmiCardDark]}>
        <View style={[styles.bmiIconContainer, { backgroundColor: bmiColor + '20' }]} >
          <Text style={styles.bmiIcon}>⚖️</Text>
        </View>
        <View style={styles.bmiContent}>
          <Text style={[styles.bmiTitle, isDark && styles.textDark]}>Indice de masse corporelle</Text>
          <Text style={[styles.bmiValue, isDark && styles.textDark]}>{bmi.toFixed(1)}</Text>
          <Text style={[styles.bmiStatus, isDark && styles.textDark]}>{bmiStatus}</Text>
        </View>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerDark: {
    backgroundColor: '#283593',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2196f3',
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 5,
  },
  userAge: {
    fontSize: 16,
    color: '#1976d2',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#f5f9ff',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-around',
  },
  quickStatsDark: {
    backgroundColor: '#1a237e',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#1976d2',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#90caf9',
    marginHorizontal: 10,
  },
  bodyContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bodyContainerDark: {
    backgroundColor: '#283593',
  },
  bodyImage: {
    width: '100%',
    height: 300,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardDark: {
    backgroundColor: '#283593',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  bmiCard: {
    margin: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiCardDark: {
    backgroundColor: '#283593',
  },
  bmiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bmiIcon: {
    fontSize: 30,
  },
  bmiContent: {
    flex: 1,
  },
  bmiTitle: {
    fontSize: 16,
    color: '#1565c0',
    marginBottom: 5,
  },
  bmiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 5,
  },
  bmiStatus: {
    fontSize: 16,
    color: '#1976d2',
  },
  textDark: {
    color: '#e3f2fd',
  },
});
 