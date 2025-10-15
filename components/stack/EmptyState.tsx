import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  onAddTask: () => void;
};

export default function EmptyState({ onAddTask }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <Text className="text-6xl mb-4">⏰⏳</Text>
      <Text className="text-center text-gray-700 mb-6">
        You have no task. Create one now and start tracking your time to get productive!
      </Text>
      <TouchableOpacity onPress={onAddTask} accessibilityRole="button" accessibilityLabel="Add Task">
        <View className="bg-black rounded-full px-6 py-3">
          <Text className="text-white font-medium">Add Task</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}