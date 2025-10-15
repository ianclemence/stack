import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  styleVariant?: 'compact' | 'default';
}

// Curated set of common emojis for web fallback
const commonEmojis = ['🐕', '🏃‍♂️', '📚', '💻', '🍎', '☕', '🎯', '🏋️‍♂️', '🧘‍♀️', '🎨', '🎵', '🌱'];

export default function EmojiSelector({ emoji, onEmojiChange, styleVariant = 'default' }: EmojiSelectorProps) {
  const isCompact = styleVariant === 'compact';
  return (
    <TouchableOpacity
      className={
        isCompact
          ? 'bg-neutral-50 rounded-xl p-2 items-center justify-center'
          : 'bg-neutral-50 rounded-lg p-3 flex-row items-center space-x-2'
      }
      onPress={() => {
        const currentIndex = commonEmojis.indexOf(emoji);
        const nextIndex = (currentIndex + 1) % commonEmojis.length;
        onEmojiChange(commonEmojis[nextIndex]);
      }}
    >
      <Text className={isCompact ? 'text-xl' : 'text-2xl'}>{emoji}</Text>
      {!isCompact && (
        <Text className="text-neutral-600">Tap to cycle emojis</Text>
      )}
    </TouchableOpacity>
  );
}