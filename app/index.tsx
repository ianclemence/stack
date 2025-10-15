import { View, Text, StyleSheet } from 'react-native';
import StackTimer from '@/components/stack/StackTimer';

export default function RootScreen() {
  return (
    <View style={styles.container}>
      <StackTimer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});