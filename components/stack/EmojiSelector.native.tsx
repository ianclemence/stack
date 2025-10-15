import React from 'react';
import { View, Text } from 'react-native';
import { EmojiPopup } from 'react-native-emoji-popup';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
}

export default function EmojiSelector({ emoji, onEmojiChange }: EmojiSelectorProps) {
  return (
    <EmojiPopup onEmojiSelected={onEmojiChange} style={{ alignSelf: 'flex-start' }}>
      <View className="bg-neutral-50 rounded-lg p-3 flex-row items-center space-x-2">
        <Text className="text-2xl">{emoji}</Text>
        <Text className="text-neutral-600">Tap to change emoji</Text>
      </View>
    </EmojiPopup>
  );
}