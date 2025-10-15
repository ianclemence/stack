import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { clamp, MIN_BREAK_MINUTES, MAX_BREAK_MINUTES } from './utils';

type Props = {
  visible: boolean;
  defaultMinutes?: number; // default 5
  onCancel: () => void;
  onConfirm: (minutes: number) => void;
};

export default function BreakSuggestionModal({ visible, defaultMinutes = 5, onCancel, onConfirm }: Props) {
  const [minutes, setMinutes] = useState(defaultMinutes);
  useEffect(() => {
    if (visible) setMinutes(defaultMinutes);
  }, [visible, defaultMinutes]);

  const dec = () => {
    setMinutes((m) => clamp(m - 1, MIN_BREAK_MINUTES, MAX_BREAK_MINUTES));
    Haptics.selectionAsync();
  };
  const inc = () => {
    setMinutes((m) => clamp(m + 1, MIN_BREAK_MINUTES, MAX_BREAK_MINUTES));
    Haptics.selectionAsync();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/40 items-center justify-center px-4">
        <View className="w-full max-w-md bg-white rounded-2xl p-4 gap-4">
          <Text className="text-xl font-semibold">Take a Break?</Text>
          <Text className="text-gray-600">Break for {minutes} minutes</Text>

          <View className="flex-row items-center gap-6 justify-center">
            <TouchableOpacity onPress={dec} accessibilityRole="button" accessibilityLabel="Decrease break minutes">
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                <Feather name="minus" size={20} color="#111" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={inc} accessibilityRole="button" accessibilityLabel="Increase break minutes">
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                <Feather name="plus" size={20} color="#111" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel break">
              <View className="px-4 py-2 rounded-full bg-gray-200 flex-row items-center gap-2">
                <Ionicons name="close" size={16} color="#111" />
                <Text className="text-gray-900">Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onConfirm(minutes);
              }}
              accessibilityRole="button"
              accessibilityLabel="Confirm break"
            >
              <View className="px-4 py-2 rounded-full bg-gray-900 flex-row items-center gap-2">
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text className="text-white">Confirm</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}