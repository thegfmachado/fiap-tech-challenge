import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function FloatingActionButton({ 
  onPress, 
  label = 'Nova transação',
  icon = 'add'
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-2 rounded-md"
      style={{ backgroundColor: '#664373' }}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={16} color="white" />
      {label && (
        <Text className="text-white font-semibold ml-2 text-sm">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
