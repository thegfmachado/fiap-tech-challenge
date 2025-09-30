import { IIncomeByRange } from "@fiap-tech-challenge/models";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { CartesianChart, Line } from "victory-native";

type LineDashboardChartProps = {
  data: IIncomeByRange[];
};

const screenWidth = Dimensions.get("window").width;

export function LineDashboardChart({ data }: LineDashboardChartProps) {

  const chartWidth = Math.max(screenWidth, data.length * 50);
  const font = useFont(require('../assets/fonts/Geist-Regular.ttf'), 12);

  const chartData = data.map(item => ({
    period: item.period,
    income: item.income
  }));

  return (
    <View
      className="w-full overflow-hidden rounded-xl border bg-white border-gray-300"
    >
      <View className="p-4">
        <Text className="font-bold text-lg mb-2">Histórico de economias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="mb-2" style={{ width: chartWidth, height: 200 }} >
            <CartesianChart data={chartData} xKey="period" yKeys={["income"]} axisOptions={{ font }}>
              {({ points }) => (
                <Line
                  points={points.income}
                  color="#553860"
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 300 }}
                >
                </Line>
              )}
            </CartesianChart>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
