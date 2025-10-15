import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
}

// Curated set of common emojis for web fallback
const commonEmojis = ['🐕', '🏃‍♂️', '📚', '💻', '🍎', '☕', '🎯', '🏋️‍♂️', '🧘‍♀️', '🎨', '🎵', '🌱'];

export default function EmojiSelector({ emoji, onEmojiChange }: EmojiSelectorProps) {
  return (
    <TouchableOpacity
      className="bg-neutral-50 rounded-lg p-3 flex-row items-center space-x-2"
      onPress={() => {
        const currentIndex = commonEmojis.indexOf(emoji);
        const nextIndex = (currentIndex + 1) % commonEmojis.length;
        onEmojiChange(commonEmojis[nextIndex]);
      }}
    >
      <Text className="text-2xl">{emoji}</Text>
      <Text className="text-neutral-600">Tap to cycle emojis</Text>
    </TouchableOpacity>
  );
}