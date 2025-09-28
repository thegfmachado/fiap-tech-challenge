import React, { useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator, Animated } from "react-native";
import { Card, CardType } from "@/components/Card";
import DashboardCharts from "@/components/DashboardCharts";
import { useDashboard } from "@/contexts/dashboard-context";
import { useFocusEffect } from "@react-navigation/native";

const bardata = [
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

const lineData = [
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
  { period: "15", income: 500 },
  { period: "16", income: 0 },
  { period: "17", income: 0 },
  { period: "18", income: 0 },
  { period: "19", income: 0 },
  { period: "20", income: 300 },
];

export default function Dashboard() {
  const { dashboard } = useDashboard();

  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useFocusEffect(
    React.useCallback(() => {
      if (dashboard) {
        animations.forEach(anim => anim.setValue(0));

        const sequence = animations.map((anim, i) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: i * 200,
            useNativeDriver: true,
          })
        );

        Animated.stagger(150, sequence).start();
      }
    }, [dashboard])
  );

  if (!dashboard) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  const getAnimStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
  });

  return (
    <ScrollView className="flex-1 px-4 pt-6 bg-gray-50">
      <Animated.View style={getAnimStyle(animations[0])}>
        <Text className="text-2xl font-bold mb-4">Dashboards</Text>
      </Animated.View>

      <Animated.View style={getAnimStyle(animations[1])}>
        <Card
          title="Receita total"
          value={dashboard.income.total}
          percentage={parseFloat(dashboard.income.increasePercentage)}
          type={CardType.amount}
        />
      </Animated.View>

      <View className="flex-row gap-4 mt-4">
        <Animated.View style={[{ flex: 1 }, getAnimStyle(animations[2])]}>
          <Card
            title="Entradas"
            value={dashboard.amount.total}
            percentage={parseFloat(dashboard.amount.increasePercentage)}
            type={CardType.income}
          />
        </Animated.View>

        <Animated.View style={[{ flex: 1 }, getAnimStyle(animations[3])]}>
          <Card
            title="Saídas"
            value={dashboard.expenses.total}
            percentage={parseFloat(dashboard.expenses.increasePercentage)}
            type={CardType.expenses}
          />
        </Animated.View>
      </View>

      <Animated.View style={[{ marginTop: 20 }, getAnimStyle(animations[4])]}>
        <DashboardCharts lineData={lineData} barData={bardata} />
      </Animated.View>
    </ScrollView>
  );
}
