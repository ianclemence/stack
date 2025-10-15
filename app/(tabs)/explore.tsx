import { View, Text, StyleSheet } from 'react-native';
import StackTimer from '@/components/stack/StackTimer';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Try different timer configurations</Text>
      </View>
      
      <StackTimer />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to use Stack Timer:</Text>
        <Text style={styles.infoText}>• Tap Edit to customize your task</Text>
        <Text style={styles.infoText}>• Choose colors and duration</Text>
        <Text style={styles.infoText}>• Start your focus session</Text>
        <Text style={styles.infoText}>• Take breaks when needed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
