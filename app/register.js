import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';


const primaryBlue = '#2196f3';
const lightBlue = '#90caf9';
const white = '#f0f8ff';
const textColor = '#1565c0';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(0|\+33)[1-9]([-.\s]?[0-9]{2}){4}$/;
  return phoneRegex.test(phone);
};

export default function Register() {
    const [isLoggedIn] = React.useState(false);
    const { setIsLoggedIn } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    hasDiabetes: '',
    diabetesType: '',
    takesMedicine: '',
    medicineType: '',
  });

  const progress = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step - 1) / 3,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    const requiredFields = {
      1: ['name', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['bloodType', 'hasDiabetes'],
      3: ['takesMedicine'],
      4: [],
    };

    for (const field of requiredFields[step] || []) {
      if (!formData[field]) {
        Alert.alert('Erreur', `Le champ "${field}" est requis.`);
        return false;
      }
    }

    if (step === 1) {
      if (!isValidEmail(formData.email)) {
        Alert.alert('Erreur', "Format d'email invalide.");
        return false;
      }
      if (!isValidPhoneNumber(formData.phone)) {
        Alert.alert('Erreur', 'Numéro de téléphone invalide.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
        return false;
      }
    }

    if (step === 2 && formData.hasDiabetes === 'oui' && !formData.diabetesType) {
      Alert.alert('Erreur', 'Veuillez spécifier le type de diabète.');
      return false;
    }

    if (step === 3 && formData.takesMedicine === 'oui' && !formData.medicineType) {
      Alert.alert('Erreur', 'Veuillez spécifier le type de médicament.');
      return false;
    }

    return true;
  };

const handleNext = async () => {
  if (!validateStep()) return;

  if (step === 4) {
    try {
      // Inscription
      const signupResponse = await fetch('http://192.168.1.11:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const signupData = await signupResponse.json();
      if (!signupResponse.ok) throw new Error(signupData.message || "Erreur lors de l'inscription");

      // Connexion auto
      const loginResponse = await fetch('http://192.168.1.11:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message || "Erreur lors de la connexion automatique");

      const token = loginData.idToken;
      if (!token) throw new Error("Token non reçu après connexion");

      await AsyncStorage.setItem('userToken', token);
      
      Alert.alert('Succès', `Inscription et connexion réussies, bienvenue ${formData.email} !`);
setIsLoggedIn(true); // ✅ update auth state
      
      console.log("Login : true / ");      
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
    return;
  }
  setStep(step + 1);
};




  const handleBack = () => {
    Animated.timing(formOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (step > 1) {
        setStep(step - 1);
      }
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              placeholderTextColor={lightBlue}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry
              placeholderTextColor={lightBlue}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Groupe sanguin (ex: A+)"
              value={formData.bloodType}
              onChangeText={(text) => handleChange('bloodType', text)}
              placeholderTextColor={lightBlue}
            />
            <Text style={styles.label}>Avez-vous le diabète ?</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.optionButton, formData.hasDiabetes === 'oui' && styles.selected]}
                onPress={() => handleChange('hasDiabetes', 'oui')}
              >
                <Text style={styles.optionText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, formData.hasDiabetes === 'non' && styles.selected]}
                onPress={() => handleChange('hasDiabetes', 'non')}
              >
                <Text style={styles.optionText}>Non</Text>
              </TouchableOpacity>
            </View>
            {formData.hasDiabetes === 'oui' && (
              <TextInput
                style={styles.input}
                placeholder="Type de diabète"
                value={formData.diabetesType}
                onChangeText={(text) => handleChange('diabetesType', text)}
                placeholderTextColor={lightBlue}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.label}>Prenez-vous des médicaments ?</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.optionButton, formData.takesMedicine === 'oui' && styles.selected]}
                onPress={() => handleChange('takesMedicine', 'oui')}
              >
                <Text style={styles.optionText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, formData.takesMedicine === 'non' && styles.selected]}
                onPress={() => handleChange('takesMedicine', 'non')}
              >
                <Text style={styles.optionText}>Non</Text>
              </TouchableOpacity>
            </View>
            {formData.takesMedicine === 'oui' && (
              <View style={styles.optionGroup}>
                <TouchableOpacity
                  style={[styles.optionButton, formData.medicineType === 'comprimés' && styles.selected]}
                  onPress={() => handleChange('medicineType', 'comprimés')}
                >
                  <Text style={styles.optionText}>Comprimés</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, formData.medicineType === 'insuline' && styles.selected]}
                  onPress={() => handleChange('medicineType', 'insuline')}
                >
                  <Text style={styles.optionText}>Insuline</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.reviewTitle}>Vérifiez vos informations :</Text>
            {Object.entries(formData).map(([key, value]) => (
              <Text key={key} style={styles.reviewText}>
                {key}: {value || '-'}
              </Text>
            ))}
          </>
        );
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Inscription</Text>

      <Animated.View style={{ opacity: formOpacity }}>
        {renderStepContent()}
      </Animated.View>

      <View style={styles.navButtons}>
        {step > 1 && (
          <TouchableOpacity style={[styles.button, { backgroundColor: lightBlue }]} onPress={handleBack}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 4 ? 'Terminer' : 'Suivant'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 20,
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: lightBlue,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: primaryBlue,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: primaryBlue,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: textColor,
  },
  label: {
    fontSize: 16,
    color: textColor,
    marginTop: 10,
  },
  optionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: primaryBlue,
    borderRadius: 10,
    minWidth: '45%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: lightBlue,
  },
  optionText: {
    color: textColor,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: primaryBlue,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: white,
    fontWeight: 'bold',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    color: textColor,
    marginBottom: 5,
  },
});
