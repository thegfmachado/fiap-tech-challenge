import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '@/constants/Colors';

interface FileUploadProps {
  onFileSelect: (file: { name: string; uri: string; type: string; size: number } | null) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export function FileUpload({
  onFileSelect,
  disabled = false,
  isUploading = false,
}: FileUploadProps) {

  const validateFile = (file: DocumentPicker.DocumentPickerAsset): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size && file.size > maxSize) {
      return { isValid: false, error: "Arquivo muito grande. Tamanho máximo: 10MB" };
    }
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.mimeType && !allowedTypes.includes(file.mimeType)) {
      return { isValid: false, error: "Tipo de arquivo não suportado" };
    }

    return { isValid: true };
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/*',
          'application/pdf',
          'text/plain',
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const validation = validateFile(file);
        if (!validation.isValid) {
          Alert.alert('Erro', validation.error || 'Arquivo inválido');
          return;
        }

        onFileSelect({
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePickDocument}
        disabled={disabled || isUploading}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 items-center ${
          disabled || isUploading ? 'opacity-50' : ''
        }`}
      >
        {isUploading ? (
          <>
            <View className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mb-2" />
            <Text className="text-gray-600 text-center">Enviando...</Text>
          </>
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={32} color={Colors.light.primary} />
            <Text className="text-primary font-semibold mt-2">
              Adicionar Arquivo
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 mt-2 text-center">
        Formatos aceitos: JPG, PNG, PDF, TXT, CSV, XLS. Máximo: 10MB
      </Text>
    </View>
  );
}
