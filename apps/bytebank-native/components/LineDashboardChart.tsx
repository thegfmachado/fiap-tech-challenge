import { IIncomeByRange } from "@fiap-tech-challenge/models";
import React from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

type LineDashboardChartProps = {
  data: IIncomeByRange[];
};

const screenWidth = Dimensions.get("window").width;

export function LineDashboardChart({ data }: LineDashboardChartProps) {

  const chartWidth = Math.max(screenWidth, data.length * 50);

  return (
    <View
      className="w-full overflow-hidden rounded-xl border bg-white border-gray-300"
    >
      <View className="p-4">
        <Text className="font-bold text-lg mb-2">Histórico de economias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: data.map((item) => item.period),
              datasets: [{ data: data.map((item) => item.income) }],
            }}
            width={chartWidth}
            height={300}
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
    </View>
  );
}
