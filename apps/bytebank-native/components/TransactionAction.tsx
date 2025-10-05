import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type TransactionActionType = "delete" | "edit" | "details";

type TransactionActionProps = {
  type: TransactionActionType;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}

const iconMap: Record<TransactionActionType, keyof typeof Ionicons.glyphMap> = {
  delete: 'trash-outline',
  edit: 'create-outline',
  details: 'list-outline',
};

const defaultTitleMap: Record<TransactionActionType, string> = {
  delete: "Excluir",
  edit: "Editar",
  details: "Detalhes",
};

export function TransactionAction(props: TransactionActionProps) {
  const { disabled, onClick, title, type } = props;

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      accessibilityLabel={title ?? defaultTitleMap[type]}
      className={`p-2 bg-transparent min-w-[40px] min-h-[40px] justify-center items-center z-20 ${disabled ? 'opacity-50' : ''}`}
      style={{ elevation: 20 }}
    >
      <Ionicons
        name={iconMap[type]}
        size={20}
        color={Colors.light.grayMedium}
      />
    </TouchableOpacity>
  );
}
