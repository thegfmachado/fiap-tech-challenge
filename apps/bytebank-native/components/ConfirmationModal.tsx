import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes } from '@/constants/Colors';
import { useAsyncAction } from '@/hooks/useAsyncOperation';

/**
 * Propriedades do componente ConfirmationModal
 * 
 * @interface ConfirmationModalProps
 */
export interface ConfirmationModalProps {
  /** Controla se o modal está visível */
  visible: boolean;
  
  /** Título principal exibido no modal */
  title: string;
  
  /** Descrição adicional (padrão: "Esta ação não poderá ser desfeita.") */
  description?: string;
  
  /** Nome do item sendo confirmado para ação (opcional) */
  itemName?: string;
  
  /** Texto do botão de confirmação (padrão: "Confirmar") */
  confirmText?: string;
  
  /** Texto do botão de cancelar (padrão: "Cancelar") */
  cancelText?: string;
  
  /** Texto exibido durante loading (padrão: "Processando...") */
  loadingText?: string;
  
  /** Callback executado quando modal é fechado */
  onClose: () => void;
  
  /** Callback assíncrono executado na confirmação */
  onConfirm: () => Promise<void>;
  
  /** Cor personalizada do botão de confirmação (padrão: primária) */
  confirmButtonColor?: string;
  
  /** Se deve mostrar botões de confirmação e cancelamento (padrão: true) */
  showTwoButtons?: boolean;
}

/**
 * Modal de confirmação reutilizável com estados de loading
 * 
 * Componente que exibe um modal de confirmação com:
 * - Ícone de aviso
 * - Título e descrição customizáveis
 * - Botões de ação com estados de loading
 * - Tratamento automático de operações assíncronas
 * - Visual consistente com o design system
 * 
 * @param {ConfirmationModalProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente modal de confirmação
 * 
 * @example
 * ```tsx
 * <ConfirmationModal
 *   visible={showDeleteModal}
 *   title="Excluir Transação"
 *   description="Tem certeza que deseja excluir esta transação?"
 *   itemName="Pagamento do cartão"
 *   confirmText="Excluir"
 *   confirmButtonColor="#dc2626"
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={async () => await deleteTransaction(id)}
 * />
 * ```
 */
export function ConfirmationModal({
  visible,
  title,
  description = "Esta ação não poderá ser desfeita.",
  itemName,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loadingText = "Processando...",
  onClose,
  onConfirm,
  confirmButtonColor = "#664373",
  showTwoButtons = true,
}: ConfirmationModalProps) {
  const { isLoading, execute } = useAsyncAction();

  const handleConfirm = async () => {
    await execute(async () => {
      await onConfirm();
      onClose();
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View 
        className="flex-1 bg-black/50 items-center justify-center px-6"
        accessible={false}
      >
        <View 
          className="bg-white rounded-2xl p-8 w-full max-w-sm items-center"
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={`${title}. ${description}${itemName ? ` Item: ${itemName}` : ''}`}
        >
          <TouchableOpacity
            onPress={handleClose}
            disabled={isLoading}
            className={`absolute right-4 top-4 w-6 h-6 items-center justify-center opacity-70 ${isLoading ? 'opacity-50' : ''}`}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
            accessibilityHint="Toque para fechar o modal de confirmação"
          >
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
          
          <View 
            className="items-center justify-center w-20 h-20 mb-6"
            accessible={false}
          >
            <Ionicons 
              name="warning-outline" 
              size={Sizes.iconLarge} 
              color={Colors.light.primaryLight} 
            />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
            {title}
          </Text>

          <Text className="text-sm text-gray-900 text-center mb-2 text-gray-600">
            {description}
          </Text>
          
          {itemName && (
            <Text className="text-sm text-gray-900 font-medium text-center mb-6">
              &quot;{itemName}&quot;?
            </Text>
          )}
          
          {!itemName && (
            <View className="mb-8" />
          )}

          {showTwoButtons ? (
            <View className="flex-row w-full gap-3">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className={`flex-1 bg-gray-100 rounded-lg py-3 px-4 ${isLoading ? 'opacity-50' : ''}`}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={cancelText}
                accessibilityHint="Toque para cancelar a ação"
                accessibilityState={{ disabled: isLoading }}
              >
                <Text className="font-semibold text-center text-base text-gray-700">
                  {cancelText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={isLoading}
                className={`flex-1 rounded-lg py-3 px-4 items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
                style={{ backgroundColor: confirmButtonColor }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isLoading ? loadingText : confirmText}
                accessibilityHint={`Toque para ${confirmText.toLowerCase()}`}
                accessibilityState={{ disabled: isLoading, busy: isLoading }}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <Text className="text-white font-semibold text-center text-base">
                      {loadingText}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-semibold text-center text-base">
                    {confirmText}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className={`rounded-lg py-3 px-4 items-center justify-center px-8 ${isLoading ? 'opacity-50' : ''}`}
              style={{ backgroundColor: confirmButtonColor }}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-semibold text-center text-base">
                    {loadingText}
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-center text-base">
                  {confirmText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}