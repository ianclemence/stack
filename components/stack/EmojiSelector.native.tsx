import React from 'react';
import { View, Text } from 'react-native';
import { EmojiPopup } from 'react-native-emoji-popup';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  styleVariant?: 'compact' | 'default';
  backgroundClass?: string;
}

export default function EmojiSelector({ emoji, onEmojiChange, styleVariant = 'default', backgroundClass }: EmojiSelectorProps) {
  const isCompact = styleVariant === 'compact';
  const base = isCompact
    ? 'rounded-xl p-3 items-center justify-center'
    : 'rounded-lg p-4 flex-row items-center space-x-2';
  const bg = backgroundClass ?? 'bg-neutral-50';

  return (
    <EmojiPopup onEmojiSelected={onEmojiChange} style={{ alignSelf: 'flex-start' }}>
      <View className={`${bg} ${base}`}>
        <Text className={isCompact ? 'text-2xl' : 'text-3xl'}>{emoji}</Text>
        {!isCompact && (
          <Text className="text-neutral-600 text-base">Tap to change emoji</Text>
        )}
      </View>
    </EmojiPopup>
  );
}