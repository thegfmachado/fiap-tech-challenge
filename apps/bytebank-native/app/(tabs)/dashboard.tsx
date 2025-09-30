import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator, Animated } from "react-native";
import { Card, CardType } from "@/components/Card";
import DashboardCharts from "@/components/DashboardCharts";
import { useDashboard } from "@/contexts/dashboard-context";
import { useFocusEffect } from "@react-navigation/native";
import { FilterType } from "@fiap-tech-challenge/models";

export default function Dashboard() {
  const { dashboard, refresh } = useDashboard();

  const filter = FilterType.year;

  useEffect(() => {
    refresh(filter);
  }, [filter]);

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
    <ScrollView className="px-4 pt-6 bg-gray-50">
      <Animated.View style={getAnimStyle(animations[0])}>
        <Text className="text-2xl font-bold mb-4">Dashboards</Text>
      </Animated.View>

      <Animated.View style={getAnimStyle(animations[1])}>
        <Card
          title="Receita total"
          value={dashboard.income.total}
          percentage={parseFloat(dashboard.income.increasePercentage)}
          type={CardType.amount}
          filterType={filter}
        />
      </Animated.View>

      <View className="flex-row gap-4 mt-4">
        <Animated.View style={[{ flex: 1 }, getAnimStyle(animations[2])]}>
          <Card
            title="Entradas"
            value={dashboard.amount.total}
            percentage={parseFloat(dashboard.amount.increasePercentage)}
            type={CardType.income}
            filterType={filter}
          />
        </Animated.View>

        <Animated.View style={[{ flex: 1 }, getAnimStyle(animations[3])]}>
          <Card
            title="Saídas"
            value={dashboard.expenses.total}
            percentage={parseFloat(dashboard.expenses.increasePercentage)}
            type={CardType.expenses}
            filterType={filter}
          />
        </Animated.View>
      </View>

      <Animated.View style={[{ marginTop: 20 }, getAnimStyle(animations[4])]}>
        <DashboardCharts lineData={dashboard.incomeByRange} barData={dashboard.amountAndExpensesByRange} />
      </Animated.View>
    </ScrollView>
  );
}
