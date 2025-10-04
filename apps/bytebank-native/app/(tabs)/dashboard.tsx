import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card, CardType } from "@/components/Card";
import DashboardCharts from "@/components/DashboardCharts";
import { useDashboard } from "@/contexts/dashboard-context";
import { useFocusEffect } from "@react-navigation/native";
import { FilterType } from "@fiap-tech-challenge/models";

export default function Dashboard() {

  const PIXELS_BELOW_ORIGINAL_POSITION_INITIAL = 30;
  const PIXELS_BELOW_ORIGINAL_POSITION_FINAL = 0;
  const ANIMATION_PROGRESS_START = 0;
  const ANIMATION_PROGRESS_END = 1;

  const { dashboard, refresh } = useDashboard();

  const ANIMATION_COUNT = 5;
  const animations = React.useMemo(
    () => Array.from({ length: ANIMATION_COUNT }, () => new Animated.Value(0)),
    []
  );

  const [filter, setFilter] = useState<FilterType>(FilterType.YEAR);

  useEffect(() => {
    refresh(filter);
  }, [filter]);

  useFocusEffect(
    React.useCallback(() => {
      if (dashboard) {
        animations.forEach((anim) => anim.setValue(0));

        Animated.sequence(
          animations.map((anim) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            })
          )
        ).start();
      }
    }, [dashboard])
  );

  if (!dashboard) {
    return null;
  }

  const getAnimatedStyle = (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [ANIMATION_PROGRESS_START, ANIMATION_PROGRESS_END],
          outputRange: [PIXELS_BELOW_ORIGINAL_POSITION_INITIAL, PIXELS_BELOW_ORIGINAL_POSITION_FINAL],
        }),
      },
    ],
  });

  return (
    <ScrollView className="px-4 pt-6 bg-gray-50">
      <Animated.View
        className="flex-row items-center justify-between mb-4 mt-4 opacity-0"
        style={[getAnimatedStyle(animations[0]), { opacity: animations[0] }]}
      >
        <Text className="text-2xl font-bold">Dashboards</Text>

        <View className="w-[160px]">
          <Picker
            selectedValue={filter}
            onValueChange={(value) => setFilter(value)}
          >
            <Picker.Item label="Semana atual" value={FilterType.WEEK} />
            <Picker.Item label="Mês atual" value={FilterType.MONTH} />
            <Picker.Item label="Ano atual" value={FilterType.YEAR} />
          </Picker>
        </View>
      </Animated.View>

      <Animated.View
        className="opacity-0"
        style={[getAnimatedStyle(animations[1]), { opacity: animations[1] }]}
      >
        <Card
          title="Receita total"
          value={dashboard.income.total}
          percentage={parseFloat(dashboard.income.increasePercentage)}
          type={CardType.amount}
          filterType={filter}
        />
      </Animated.View>

      <View className="flex-row gap-4 mt-4">
        <Animated.View
          className="flex-1 opacity-0"
          style={[getAnimatedStyle(animations[2]), { opacity: animations[2] }]}
        >
          <Card
            title="Entradas"
            value={dashboard.amount.total}
            percentage={parseFloat(dashboard.amount.increasePercentage)}
            type={CardType.income}
            filterType={filter}
          />
        </Animated.View>

        <Animated.View
          className="flex-1 opacity-0"
          style={[getAnimatedStyle(animations[3]), { opacity: animations[3] }]}
        >
          <Card
            title="Saídas"
            value={dashboard.expenses.total}
            percentage={parseFloat(dashboard.expenses.increasePercentage)}
            type={CardType.expenses}
            filterType={filter}
          />
        </Animated.View>
      </View>

      <Animated.View
        className="mt-5 opacity-0"
        style={[getAnimatedStyle(animations[4]), { opacity: animations[4] }]}
      >
        <DashboardCharts
          lineData={dashboard.incomeByRange}
          barData={dashboard.amountAndExpensesByRange}
        />
      </Animated.View>
    </ScrollView>
  );
}
