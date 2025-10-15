import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onDeleteConfirm: () => void; // triggered on long press
};

export default function DeleteConfirmationModal({ visible, onCancel, onDeleteConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/40 items-center justify-center px-4">
        <View className="w-full max-w-md bg-white rounded-2xl p-4 gap-4">
          <Text className="text-lg font-semibold">Delete task?</Text>
          <Text className="text-gray-700">This action cannot be undone, hold to confirm.</Text>

          <View className="flex-row justify-end gap-3 pt-2">
            <TouchableOpacity onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel delete">
              <View className="px-4 py-2 rounded-full bg-gray-200">
                <Text className="text-gray-900">Cancel</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onLongPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                onDeleteConfirm();
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete task (hold to confirm)"
            >
              <View className="px-4 py-2 rounded-full bg-red-500 flex-row items-center gap-2">
                <Feather name="trash-2" size={16} color="#fff" />
                <Text className="text-white">Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}