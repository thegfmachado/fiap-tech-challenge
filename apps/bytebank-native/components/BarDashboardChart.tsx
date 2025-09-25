import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

type BarDashboardChartProps = {
  data: { x: string; amount: number; expenses: number }[];
};

const screenWidth = Dimensions.get("window").width;

export function BarDashboardChart({ data }: BarDashboardChartProps) {
  // largura dinâmica (50px por ponto)
  const chartWidth = Math.max(screenWidth, data.length * 50);

  return (
    <View
      style={{
        width: "100%",  // ocupa largura do card/tab
        height: 240,
        overflow: "hidden", // limita ao container
        borderRadius: 16,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{
            labels: data.map((item) => item.x),
            datasets: [
              { data: data.map((item) => item.amount) },
              { data: data.map((item) => item.expenses) },
            ],
          }}
          width={chartWidth} // gráfico pode ser maior
          height={220}
          fromZero
          yAxisLabel="R$ "
          yAxisSuffix=""   // 👈 obrigatório (mesmo que vazio)
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(102, 67, 115, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              stroke: "#e3e3e3",
              strokeDasharray: "",
            },
          }}
          style={{}}
        />
      </ScrollView>
    </View>
  );
}
