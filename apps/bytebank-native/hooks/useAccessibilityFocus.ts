import React, { useRef, useEffect, useCallback, useState } from 'react';
import { findNodeHandle, AccessibilityInfo, Platform } from 'react-native';

/**
 * Opções para o hook de foco de acessibilidade
 */
interface UseAccessibilityFocusOptions {
  /** Se deve focar automaticamente quando o componente monta */
  autoFocus?: boolean;
  
  /** Delay em ms antes de focar (útil para modals) */
  focusDelay?: number;
  
  /** Se deve anunciar o foco para screen readers */
  announceForScreenReader?: boolean;
}

/**
 * Hook para gerenciar foco de acessibilidade
 * 
 * Fornece funções para gerenciar foco de acessibilidade de forma
 * consistente, incluindo suporte para screen readers.
 * 
 * @param {UseAccessibilityFocusOptions} options - Opções de configuração
 * @returns Objeto com ref e funções de foco
 * 
 * @example
 * ```tsx
 * const { ref, focus, blur } = useAccessibilityFocus({
 *   autoFocus: true,
 *   focusDelay: 300,
 *   announceForScreenReader: true
 * });
 * 
 * return (
 *   <View ref={ref} accessible>
 *     <Text>Conteúdo focável</Text>
 *   </View>
 * );
 * ```
 */
export function useAccessibilityFocus(options: UseAccessibilityFocusOptions = {}) {
  const {
    autoFocus = false,
    focusDelay = 100,
    announceForScreenReader = false
  } = options;
  
  const ref = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Foca o elemento de forma acessível
   */
  const focus = useCallback(() => {
    if (!ref.current) return;

    const reactTag = findNodeHandle(ref.current);
    if (reactTag) {
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
        
        // Anunciar para screen readers se solicitado
        if (announceForScreenReader && Platform.OS === 'ios') {
          AccessibilityInfo.announceForAccessibility('Conteúdo carregado');
        }
      }, focusDelay);
    }
  }, [focusDelay, announceForScreenReader]);

  /**
   * Remove o foco do elemento
   */
  const blur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Verifica se screen reader está ativo
   */
  const checkScreenReaderEnabled = useCallback(async () => {
    try {
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      return isScreenReaderEnabled;
    } catch (error) {
      console.warn('Erro ao verificar screen reader:', error);
      return false;
    }
  }, []);

  // Auto-foco quando componente monta
  useEffect(() => {
    if (autoFocus) {
      focus();
    }

    // Cleanup no unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoFocus, focus]);

  return {
    ref,
    focus,
    blur,
    checkScreenReaderEnabled,
  };
}

/**
 * Hook para anunciar mensagens para screen readers
 * 
 * @returns Função para anunciar mensagens
 * 
 * @example
 * ```tsx
 * const announce = useAccessibilityAnnouncement();
 * 
 * const handleSuccess = () => {
 *   announce('Transação salva com sucesso');
 * };
 * ```
 */
export function useAccessibilityAnnouncement() {
  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    } else if (Platform.OS === 'android') {
      // No Android, podemos usar AccessibilityInfo.announceForAccessibility também
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, []);
}

/**
 * Hook para detectar se um screen reader está ativo
 * 
 * @returns Estado booleano indicando se screen reader está ativo
 * 
 * @example
 * ```tsx
 * const isScreenReaderEnabled = useScreenReaderEnabled();
 * 
 * return (
 *   <View>
 *     {isScreenReaderEnabled && (
 *       <Text>Informações adicionais para acessibilidade</Text>
 *     )}
 *   </View>
 * );
 * ```
 */
export function useScreenReaderEnabled() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkScreenReader = async () => {
      try {
        const enabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (isMounted) {
          setIsEnabled(enabled);
        }
      } catch (error) {
        console.warn('Erro ao verificar screen reader:', error);
        if (isMounted) {
          setIsEnabled(false);
        }
      }
    };

    // Verificação inicial
    checkScreenReader();

    // Listener para mudanças no estado do screen reader
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        if (isMounted) {
          setIsEnabled(enabled);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return isEnabled;
}

export default useAccessibilityFocus;