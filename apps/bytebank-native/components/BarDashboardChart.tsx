import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { CartesianChart, BarGroup } from "victory-native";

type BarDashboardChartProps = {
  data: { period: string; amount: number; expenses: number }[];
};

const screenWidth = Dimensions.get("window").width;

export function BarDashboardChart({ data }: BarDashboardChartProps) {
  // largura dinâmica (50px por ponto)
  const chartWidth = Math.max(screenWidth, data.length * 50);

  const teste: { period: string; amount: number; expenses: number }[] = [
    { period: "Jan", amount: 1200, expenses: 800 },
    { period: "Feb", amount: 1500, expenses: 950 },
    { period: "Mar", amount: 900, expenses: 600 },
    { period: "Apr", amount: 2000, expenses: 1200 },
    { period: "May", amount: 1700, expenses: 1100 },
    { period: "Jun", amount: 2200, expenses: 1400 },
    { period: "Jul", amount: 1300, expenses: 700 },
    { period: "Aug", amount: 1800, expenses: 1200 },
    { period: "Sep", amount: 2100, expenses: 1600 },
    { period: "Oct", amount: 1900, expenses: 1300 },
    { period: "Nov", amount: 2400, expenses: 1700 },
    { period: "Dec", amount: 2600, expenses: 1900 },
  ];

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
        {/* <BarChart
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
        /> */}
        return (
        <CartesianChart data={teste} xKey="period" yKeys={["amount", "expenses"]}>
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={0.3}
              withinGroupPadding={0.1}
            >
              <BarGroup.Bar points={points.amount} color="red" />
              <BarGroup.Bar points={points.expenses} color="blue" />
            </BarGroup>
          )}
        </CartesianChart>
        );
      </ScrollView>
    </View>
  );
}
