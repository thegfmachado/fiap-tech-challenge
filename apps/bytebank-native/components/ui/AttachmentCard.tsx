import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FileIcon } from './FileIcon';

interface AttachmentCardProps {
  fileName: string;
  fileStatus: string;
  onDownload?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isDownloading?: boolean;
  disabled?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;
}

export function AttachmentCard({
  fileName,
  fileStatus,
  onDownload,
  onDelete,
  isDeleting = false,
  isDownloading = false,
  disabled = false,
  showDownload = true,
  showDelete = true,
}: AttachmentCardProps) {
  return (
    <View className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <FileIcon fileName={fileName} size={24} />
          <View className="ml-3 flex-1">
            <Text className="font-medium text-gray-900 text-sm" numberOfLines={1}>
              {fileName}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {fileStatus}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center ml-3">
          {showDownload && onDownload && (
            <TouchableOpacity
              onPress={onDownload}
              disabled={isDeleting || isDownloading}
              className={`p-2 rounded-md mr-2 ${
                isDeleting || isDownloading ? 'opacity-50' : ''
              }`}
            >
              {isDownloading ? (
                <View className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Ionicons name="download-outline" size={20} color={Colors.light.primary} />
              )}
            </TouchableOpacity>
          )}

          {showDelete && onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              disabled={disabled || isDeleting}
              className={`p-2 rounded-md ${
                disabled || isDeleting ? 'opacity-50' : ''
              }`}
            >
              {isDeleting ? (
                <View className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <Ionicons name="trash-outline" size={20} color={Colors.light.danger} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
