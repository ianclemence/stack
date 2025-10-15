import React from 'react';
import { View, Text } from 'react-native';
import { EmojiPopup } from 'react-native-emoji-popup';

interface EmojiSelectorProps {
  emoji: string;
  onEmojiChange: (emoji: string) => void;
  styleVariant?: 'compact' | 'default';
}

export default function EmojiSelector({ emoji, onEmojiChange, styleVariant = 'default' }: EmojiSelectorProps) {
  const isCompact = styleVariant === 'compact';
  return (
    <EmojiPopup onEmojiSelected={onEmojiChange} style={{ alignSelf: 'flex-start' }}>
      <View
        className={
          isCompact
            ? 'bg-neutral-50 rounded-xl p-2 items-center justify-center'
            : 'bg-neutral-50 rounded-lg p-3 flex-row items-center space-x-2'
        }
      >
        <Text className={isCompact ? 'text-xl' : 'text-2xl'}>{emoji}</Text>
        {!isCompact && (
          <Text className="text-neutral-600">Tap to change emoji</Text>
        )}
      </View>
    </EmojiPopup>
  );
}