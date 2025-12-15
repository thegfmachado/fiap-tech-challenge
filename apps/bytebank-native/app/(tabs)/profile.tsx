import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Alert, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
    }
  };

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText type="title">Olá, {user?.user_metadata?.name}</ThemedText>

      <ThemedText className="mt-4 px-12 text-center">
        Em breve, aqui você poderá gerenciar as informações da sua conta.
      </ThemedText>

      <TouchableOpacity onPress={handleSignOut} className="flex-row items-center gap-2 mt-12">
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={iconColor} />
        <ThemedText>Sair</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
