// Dashboard.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Card, CardType } from "@/components/Card";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold flex-1 mb-4">Dashboard</Text>
      <Card
        title="Receita total"
        value={12.300}
        percentage={8}
        type={CardType.amount}
      />
      <Card
        title="Despesas totais"
        value={5.400}
        percentage={-3}
        type={CardType.expenses}
      />
      <Card
        title="Economias"
        value={6.900}
        percentage={12}
        type={CardType.income}
      />

      <View className="flex-row justify-start border-b border-gray-200 mb-4 pt-6">
        <Text className="text-purple-600 font-semibold mr-6 pb-1 border-b-2 border-purple-600" style={{ color: "#664373" }}>
          Visão Geral
        </Text>
        <Text className="text-gray-500">Detalhes</Text>
      </View>

      <View className="bg-white rounded-2xl shadow p-4 border">
        <Text className="text-gray-600 font-medium mb-2">
          Histórico de Economias
        </Text>
        <LineChart
          data={{
            labels: ["Jan", "Fev", "Mar", "Abr"],
            datasets: [
              {
                data: [200, 400, 1200, 1000],
                color: () => `rgba(128, 90, 213, 1)`,
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(128, 90, 213, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#805AD5",
            },
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
}
