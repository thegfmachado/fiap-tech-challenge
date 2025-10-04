import { useFont } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { CartesianChart, BarGroup } from "victory-native";

type BarDashboardChartProps = {
  data: { period: string; amount: number; expenses: number }[];
};

const screenWidth = Dimensions.get("window").width;

export function BarDashboardChart({ data }: BarDashboardChartProps) {
  const chartWidth = Math.max(screenWidth, data.length * 50);
  const font = useFont(require('../assets/fonts/Geist-Regular.ttf'), 12);

  return (
    <View className="w-full overflow-hidden rounded-xl border bg-white border-gray-300">
      <View className="p-4">
        <Text className="font-bold text-lg mb-2">Histórico de economias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="mb-2 h-[200px]" style={{ width: chartWidth }}>
            <CartesianChart
              data={data}
              xKey="period"
              yKeys={["amount", "expenses"]}
              axisOptions={{
                font,
                formatYLabel: (value) => `R$ ${Number(value).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              }}
            >
              {({ points, chartBounds }) => (
                <BarGroup
                  chartBounds={chartBounds}
                  betweenGroupPadding={0.3}
                  withinGroupPadding={0.1}>
                  <BarGroup.Bar points={points.amount} color="red" />
                  <BarGroup.Bar points={points.expenses} color="green" />
                </BarGroup>
              )}
            </CartesianChart>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
