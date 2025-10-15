import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  ColorOption,
  EMOJI_CATEGORIES,
  EmojiCategoryKey,
  filterEmojis,
  colorBgClass,
  colorRingClass,
  clamp,
  MIN_TASK_MINUTES,
  MAX_TASK_MINUTES,
  TASK_INCREMENT,
} from './utils';

type Props = {
  visible: boolean;
  initialEmoji: string;
  initialColor: ColorOption;
  initialMinutes: number;
  onCancel: () => void;
  onConfirm: (payload: { emoji: string; color: ColorOption; minutes: number }) => void;
};

export default function EditTaskModal({
  visible,
  initialEmoji,
  initialColor,
  initialMinutes,
  onCancel,
  onConfirm,
}: Props) {
  const [query, setQuery] = useState('');
  const [emoji, setEmoji] = useState(initialEmoji);
  const [color, setColor] = useState<ColorOption>(initialColor);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [category, setCategory] = useState<EmojiCategoryKey>('Objects');

  useEffect(() => {
    if (visible) {
      setQuery('');
      setEmoji(initialEmoji);
      setColor(initialColor);
      setMinutes(initialMinutes);
      setCategory('Objects');
    }
  }, [visible, initialEmoji, initialColor, initialMinutes]);

  const emojis = useMemo(() => filterEmojis(query, category), [query, category]);

  const dec = () => {
    const next = clamp(minutes - TASK_INCREMENT, MIN_TASK_MINUTES, MAX_TASK_MINUTES);
    setMinutes(next);
    Haptics.selectionAsync();
  };
  const inc = () => {
    const next = clamp(minutes + TASK_INCREMENT, MIN_TASK_MINUTES, MAX_TASK_MINUTES);
    setMinutes(next);
    Haptics.selectionAsync();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/40 items-center justify-center px-4">
        <View className="w-full max-w-xl bg-white rounded-2xl p-4 gap-4">
          {/* Emoji picker header */}
          <View className="flex-row items-center gap-2">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${colorBgClass[color]}`}>
              <Text className="text-2xl">{emoji}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center bg-gray-100 rounded-full px-3">
                <Ionicons name="search" size={18} color="#555" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search emoji"
                  className="flex-1 py-2 px-2 text-sm"
                  accessibilityLabel="Search emoji"
                />
              </View>
            </View>
          </View>

          {/* Emoji categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {EMOJI_CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.key}
                onPress={() => {
                  setCategory(c.key);
                  Haptics.selectionAsync();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Category ${c.label}`}
              >
                <View className={`px-3 py-2 rounded-full ${category === c.key ? 'bg-gray-900' : 'bg-gray-200'}`}>
                  <Text className={`${category === c.key ? 'text-white' : 'text-gray-800'} text-sm`}>{c.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Emoji grid */}
          <View className="flex-row flex-wrap gap-3">
            {emojis.map((e) => (
              <TouchableOpacity
                key={`${category}-${e}`}
                onPress={() => {
                  setEmoji(e);
                  Haptics.selectionAsync();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select emoji ${e}`}
              >
                <View className={`w-12 h-12 rounded-xl items-center justify-center ${emoji === e ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <Text className={`${emoji === e ? 'text-white' : 'text-black'} text-2xl`}>{e}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color palette */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
            {(['red','orange','green','blue','purple','pink'] as ColorOption[]).map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setColor(c);
                  Haptics.selectionAsync();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Accent color ${c}`}
              >
                <View className={`w-8 h-8 rounded-full ${colorBgClass[c]} ${color === c ? `ring-2 ${colorRingClass[c]}` : ''}`} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Duration selector */}
          <View className="items-center gap-4">
            <Text className="text-5xl font-bold">{minutes}:00</Text>
            <View className="flex-row items-center gap-6">
              <TouchableOpacity onPress={dec} accessibilityRole="button" accessibilityLabel="Decrease minutes">
                <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                  <Feather name="minus" size={20} color="#111" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={inc} accessibilityRole="button" accessibilityLabel="Increase minutes">
                <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                  <Feather name="plus" size={20} color="#111" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel edit">
              <View className="px-4 py-2 rounded-full bg-gray-200 flex-row items-center gap-2">
                <Ionicons name="close" size={16} color="#111" />
                <Text className="text-gray-900">Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onConfirm({ emoji, color, minutes });
              }}
              accessibilityRole="button"
              accessibilityLabel="Confirm edit"
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