import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from './context/AuthContext';

const primaryBlue = '#2196f3';
const lightBlue = '#90caf9';
const white = '#f0f8ff';
const textColor = '#1565c0';

// Remplace par l’URL de ton backend si besoin
const API_URL = 'http://192.168.1.11:3000/auth/login';

export default function Login({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      console.log("Login : false / ");
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      console.log(API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la connexion');
      console.log("data : ", data);
      Alert.alert('Connexion réussie', `Bienvenue, ${data.user?.name || email} !`);
      setIsLoggedIn(true); // ✅ update auth state
      
      console.log("Login : true / ");
      
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={lightBlue}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={lightBlue}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.link}>Pas encore inscrit ? Crée un compte.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: white },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: primaryBlue },
  input: { borderWidth: 1, borderColor: lightBlue, padding: 15, marginBottom: 20, borderRadius: 8, backgroundColor: white, color: textColor },
  button: { backgroundColor: primaryBlue, paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: white, fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, textAlign: 'center', color: primaryBlue },
});
