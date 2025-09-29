import React from "react";
import { Text, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppIntroSlider from "react-native-app-intro-slider";

import MonitoringSvg from "@/assets/images/intro/monitoring.svg";
import InsightsSvg from "@/assets/images/intro/insights.svg";
import SecuritySvg from "@/assets/images/intro/security.svg";

const slides = [
  {
    key: "1",
    title: "Monitoramento de despesas",
    text: "Monitore seus gastos de onde estiver em tempo real.",
    image: MonitoringSvg,
  },
  {
    key: "2",
    title: "Insights financeiros",
    text: "Receba insights valiosos sobre suas finanças.",
    image: InsightsSvg,
  },
  {
    key: "3",
    title: "Dados seguros",
    text: "Seus dados financeiros estão seguros conosco.",
    image: SecuritySvg,
  },
];


function SliderButton({ label }: { label: string }) {
  return (
    <View className="p-4 bg-[#664373] rounded items-center justify-center w-full">
      <Text className="text-white font-bold">{label}</Text>
    </View>
  );
}

export default function IntroSlider({ onDone }: { onDone: () => void }) {
  const renderItem = ({ item }: { item: typeof slides[number] }) => (
    <View className="flex-1 w-screen h-screen bg-[#AA8BB5] items-center justify-center p-5">
      <Text className="text-3xl font-bold text-white mb-10 text-center">{item.title}</Text>
      <item.image width={256} height={256} />
      <Text className="text-base text-white mt-2 text-center">{item.text}</Text>
    </View>
  );

  const nextButton = () => <SliderButton label="Próximo" />;
  const doneButton = () => <SliderButton label="Continuar" />;

  return (
    <SafeAreaView className="flex-1">
      <StatusBar translucent backgroundColor="transparent" animated />
      <AppIntroSlider
        keyExtractor={({ key }) => key}
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        bottomButton
        renderNextButton={nextButton}
        renderDoneButton={doneButton}
        dotStyle={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        activeDotStyle={{ backgroundColor: "#fff" }}
      />
    </SafeAreaView>
  );
}
