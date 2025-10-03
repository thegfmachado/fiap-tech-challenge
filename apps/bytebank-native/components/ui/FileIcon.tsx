import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface FileIconProps {
  fileName: string;
  size?: number;
  color?: string;
}

export function FileIcon({ fileName, size = 20, color = '#6b7280' }: FileIconProps) {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image-outline';
      case 'pdf':
        return 'document-text-outline';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'grid-outline';
      case 'txt':
        return 'document-outline';
      default:
        return 'document-outline';
    }
  };

  return (
    <Ionicons 
      name={getIconName()} 
      size={size} 
      color={color} 
    />
  );
}