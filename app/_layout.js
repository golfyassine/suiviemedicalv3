import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';

// Import des pages

import Accueil from './index';
import MedecinScreen from './menu/medecin';
import NutritionnisteScreen from './menu/nutritionniste';
import PlatsScreen from './menu/plats';
import Stats from './menu/stats';
import Sucre from './menu/sucre';
import TraitementScreen from './menu/traitement';
import LoginScreen from './login';
import Register from './register';

const Drawer = createDrawerNavigator();

// Animation pour les groupes de menu
const MenuGroup = ({ title, children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.menuGroup, { opacity: fadeAnim }]}>
      <Text style={styles.menuGroupTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
};

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    background: '#f0f8ff',
    card: '#ffffff',
    text: '#1565c0',
    border: '#90caf9',
    notification: '#2196f3',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2196f3',
    background: '#1a237e',
    card: '#283593',
    text: '#e3f2fd',
    border: '#3949ab',
    notification: '#2196f3',
  },
};

// Composant protégé avec navigation drawer
function ProtectedDrawer() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);

  if (!isLoggedIn) {
    return showRegister ? (
      <Register onBack={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="index"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196f3',
          elevation: 4,
          shadowOpacity: 0.3,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        drawerActiveTintColor: '#2196f3',
        drawerInactiveTintColor: '#1565c0',
        drawerStyle: {
          backgroundColor: '#f0f8ff',
          width: 280,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.7)',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Accueil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        component={Accueil}
      />

      <Drawer.Group screenOptions={{ headerShown: true }}>
        <Drawer.Screen
          name="menu/sucre"
          options={{
            title: 'Taux de glycémie',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="fitness-outline" size={size} color={color} />
            ),
          }}
          component={Sucre}
        />
        <Drawer.Screen
          name="menu/traitement"
          options={{
            title: 'Traitement',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="medical-outline" size={size} color={color} />
            ),
          }}
          component={TraitementScreen}
        />
        <Drawer.Screen
          name="menu/stats"
          options={{
            title: 'Statistiques',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
          component={Stats}
        />
      </Drawer.Group>

      <Drawer.Group screenOptions={{ headerShown: true }}>
        <Drawer.Screen
          name="menu/plats"
          options={{
            title: 'Suggestions de plats',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
          component={PlatsScreen}
        />
        <Drawer.Screen
          name="menu/nutritionniste"
          options={{
            title: 'Nutritionniste',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="nutrition-outline" size={size} color={color} />
            ),
          }}
          component={NutritionnisteScreen}
        />
      </Drawer.Group>

      <Drawer.Screen
        name="menu/medecin"
        options={{
          title: 'Médecin',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
        component={MedecinScreen}
      />

      {/* Écran déconnexion placé DANS le Drawer.Navigator */}
      <Drawer.Screen
        name="logout"
        options={{
          title: 'Déconnexion',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        component={() => {
          useEffect(() => {
            setIsLoggedIn(false);
            
          }, []);
          return null;
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ProtectedDrawer />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  menuGroup: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  menuGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
