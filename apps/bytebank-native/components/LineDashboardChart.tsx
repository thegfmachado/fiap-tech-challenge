import { Colors } from "@/constants/Colors";
import { IIncomeByRange } from "@fiap-tech-challenge/models";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, ScrollView, View, Text, useColorScheme } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { CartesianChart, Line } from "victory-native";

type LineDashboardChartProps = {
  data: IIncomeByRange[];
};

const screenWidth = Dimensions.get("window").width;

export function LineDashboardChart({ data }: LineDashboardChartProps) {

  const chartWidth = Math.max(screenWidth, data.length * 50);
  const font = useFont(require('../assets/fonts/Geist-Regular.ttf'), 12);
  const colorScheme = useColorScheme();

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
            <CartesianChart data={chartData} xKey="period" yKeys={["income"]} axisOptions={{
              font,
              formatYLabel: (value) => `R$ ${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
            }}>
              {({ points }) => (
                <Line
                  points={points.income}
                  color={Colors[colorScheme ?? "light"].text}
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
