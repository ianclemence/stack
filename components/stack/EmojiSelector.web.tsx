import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  styleVariant?: 'compact' | 'default';
  backgroundClass?: string;
}

// Curated set of common emojis for web fallback
const commonEmojis = ['🐕', '🏃‍♂️', '📚', '💻', '🍎', '☕', '🎯', '🏋️‍♂️', '🧘‍♀️', '🎨', '🎵', '🌱'];

export default function EmojiSelector({ emoji, onEmojiChange, styleVariant = 'default', backgroundClass }: EmojiSelectorProps) {
  const isCompact = styleVariant === 'compact';
  return (
    <TouchableOpacity
      className={
        isCompact
          ? `${backgroundClass ?? 'bg-neutral-50'} rounded-xl p-3 md:p-4 items-center justify-center`
          : `${backgroundClass ?? 'bg-neutral-50'} rounded-lg p-4 md:p-5 flex-row items-center space-x-2`
      }
      onPress={() => {
        const currentIndex = commonEmojis.indexOf(emoji);
        const nextIndex = (currentIndex + 1) % commonEmojis.length;
        onEmojiChange(commonEmojis[nextIndex]);
      }}
    >
      <Text className={isCompact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}>{emoji}</Text>
      {!isCompact && (
        <Text className="text-neutral-600 text-base md:text-lg">Tap to cycle emojis</Text>
      )}
    </TouchableOpacity>
  );
}