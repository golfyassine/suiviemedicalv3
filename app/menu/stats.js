import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Données de test (à remplacer par des données réelles)
const generateData = () => {
  const days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  return {
    labels: days,
    datasets: [
      {
        data: days.map(() => Math.floor(Math.random() * (180 - 70) + 70)),
        color: () => '#f4511e',
        strokeWidth: 2,
      },
    ],
  };
};

const generateWeeklyData = () => {
  const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
  return {
    labels: weeks,
    datasets: [
      {
        data: weeks.map(() => Math.floor(Math.random() * (180 - 70) + 70)),
      },
    ],
  };
};

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState('day');
  const [loading, setLoading] = useState(true);
  const [lineData, setLineData] = useState(generateData());
  const [barData, setBarData] = useState(generateWeeklyData());
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Simuler le chargement des données
    setLoading(true);
    setTimeout(() => {
      setLineData(generateData());
      setBarData(generateWeeklyData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1e1e1e' : '#ffffff',
    backgroundGradientTo: isDark ? '#2d2d2d' : '#f5f5f5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(244, 81, 30, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#f4511e',
    },
  };

  const calculateStats = () => {
    const values = lineData.datasets[0].data;
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { avg, min, max };
  };

  const stats = calculateStats();

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Statistiques du taux de sucre
      </Text>

      <View style={styles.timeRangeContainer}>
        {['day', 'week', 'month'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range && styles.timeRangeTextActive,
              ]}
            >
              {range === 'day' ? 'Jour' : range === 'week' ? 'Semaine' : 'Mois'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f4511e" style={styles.loader} />
      ) : (
        <>
          <View style={[styles.statsContainer, isDark && styles.statsContainerDark]}>
            <View style={styles.statItem}>
              <Ionicons name="analytics-outline" size={24} color="#f4511e" />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {stats.avg.toFixed(0)}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textDark]}>
                Moyenne
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="arrow-down-outline" size={24} color="#00C851" />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {stats.min}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textDark]}>
                Minimum
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up-outline" size={24} color="#ff4444" />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {stats.max}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.textDark]}>
                Maximum
              </Text>
            </View>
          </View>

          <View style={[styles.chartContainer, isDark && styles.chartContainerDark]}>
            <Text style={[styles.chartTitle, isDark && styles.titleDark]}>
              Évolution journalière
            </Text>
            <LineChart
              data={lineData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.graph}
            />
          </View>

          <View style={[styles.chartContainer, isDark && styles.chartContainerDark]}>
            <Text style={[styles.chartTitle, isDark && styles.titleDark]}>
              Moyenne hebdomadaire
            </Text>
            <BarChart
              data={barData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.graph}
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
        </>
      )}
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
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  titleDark: {
    color: '#90caf9',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timeRangeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  timeRangeButtonActive: {
    backgroundColor: '#2196f3',
  },
  timeRangeText: {
    color: '#1565c0',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  statsContainerDark: {
    backgroundColor: '#283593',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#1565c0',
  },
  statLabel: {
    fontSize: 14,
    color: '#1976d2',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  chartContainerDark: {
    backgroundColor: '#283593',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1565c0',
  },
  graph: {
    borderRadius: 12,
    alignSelf: 'center',
  },
  loader: {
    marginTop: 50,
  },
  textDark: {
    color: '#e3f2fd',
  },
});
