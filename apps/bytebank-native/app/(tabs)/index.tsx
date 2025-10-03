import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#553860', dark: '#553860' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#8A6AA1"
          name="home"
          className="-bottom-[60px] -left-[35px]"
        />
      }>
      <ThemedView className="flex-row items-center gap-2">
        <ThemedText type="title">ByteBank</ThemedText>
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Bem-vindo ao seu controle financeiro</ThemedText>
        <ThemedText>
          Aqui você terá um resumo geral da sua conta em breve.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}


