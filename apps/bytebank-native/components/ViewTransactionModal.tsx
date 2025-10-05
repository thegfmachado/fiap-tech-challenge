import React from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ITransaction } from '@fiap-tech-challenge/database/types';
import { TransactionForm } from './TransactionForm';
import { Colors } from '@/constants/Colors';

export interface ViewTransactionModalProps {
  visible: boolean;
  transaction: ITransaction;
  onClose: () => void;
  onEdit?: (transaction: ITransaction) => void;
}

export function ViewTransactionModal({
  visible,
  transaction,
  onClose,
  onEdit,
}: ViewTransactionModalProps) {
  const handleEdit = () => {
    onEdit?.(transaction);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.grayMedium} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Detalhes da transação
          </Text>
          {onEdit && (
            <TouchableOpacity
              onPress={handleEdit}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="pencil" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
          {!onEdit && <View className="w-8" />}
        </View>

        <View className="flex-1">
          <TransactionForm
            disabled={false}
            readOnly={true}
            onSubmit={() => {}}
            transaction={transaction}
            onAttachmentChange={() => {}}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
