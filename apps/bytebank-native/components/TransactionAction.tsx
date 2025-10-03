import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const handlePress = () => {
    onClick();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={title ?? defaultTitleMap[type]}
      style={{
        padding: 8,
        opacity: disabled ? 0.5 : 1,
        backgroundColor: 'transparent',
        minWidth: 40,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        elevation: 20
      }}
    >
      <Ionicons 
        name={iconMap[type]} 
        size={20} 
        color="#6b7280" 
      />
    </TouchableOpacity>
  );
}
