import { IAmountAndExpensesByRange } from "@fiap-tech-challenge/models";
import React from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { CartesianChart, BarGroup } from "victory-native";

type BarDashboardChartProps = {
  data: { period: string; amount: number; expenses: number }[];
};

const screenWidth = Dimensions.get("window").width;

export function BarDashboardChart({ data }: BarDashboardChartProps) {
  const chartWidth = Math.max(screenWidth, data.length * 50);

  return (
    <View className="w-full overflow-hidden rounded-xl border bg-white border-gray-300">
      <View className="p-4">
        <Text className="font-bold text-lg mb-2">Histórico de economias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: chartWidth, height: 300 }}>
            <CartesianChart
              data={data}
              xKey="period"
              yKeys={["amount", "expenses"]}

            >
              {({ points, chartBounds }) => (
                <BarGroup
                  chartBounds={chartBounds}
                  betweenGroupPadding={0.1}
                  withinGroupPadding={0.1}
                  barWidth={25}
                >
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
