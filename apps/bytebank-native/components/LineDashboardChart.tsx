import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

type LineDashboardChartProps = {
  data: { x: string; y: number }[];
};

const screenWidth = Dimensions.get("window").width;

export function LineDashboardChart({ data }: LineDashboardChartProps) {
  const incomeByRange = [
    { period: "01", income: 200 },
    { period: "02", income: 0 },
    { period: "03", income: 500 },
    { period: "04", income: 0 },
    { period: "05", income: 1100 },
    { period: "06", income: 0 },
    { period: "07", income: 0 },
    { period: "08", income: 300 },
    { period: "09", income: 0 },
    { period: "10", income: 2000 },
    { period: "11", income: 0 },
    { period: "12", income: 0 },
    { period: "13", income: 0 },
    { period: "14", income: 0 },
    { period: "15", income: -500 },
    { period: "16", income: 0 },
    { period: "17", income: 0 },
    { period: "18", income: 0 },
    { period: "19", income: 0 },
    { period: "20", income: -300 },
  ];

  // largura dinâmica (50px por ponto)
  const chartWidth = Math.max(screenWidth, incomeByRange.length * 50);

  return (
    <View
      style={{
        width: "100%", // ocupa largura do card/tab
        height: 240,
        overflow: "hidden", // impede gráfico de vazar
        borderRadius: 16,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: incomeByRange.map((item) => item.period),
            datasets: [{ data: incomeByRange.map((item) => item.income) }],
          }}
          width={chartWidth} // gráfico pode ser maior que a área visível
          height={220}
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
          withVerticalLines={false}
          withDots={false}
          bezier={false}
          style={{}}
        />
      </ScrollView>
    </View>
  );
}
