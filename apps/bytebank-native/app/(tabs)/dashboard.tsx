import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Card, CardType } from "@/components/Card";
import DashboardCharts from "@/components/DashboardCharts";
import { useDashboard } from "@/contexts/dashboard-context";

export default function Dashboard() {
  const { dashboard } = useDashboard();

  if (!dashboard) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6">
      <Text className="text-2xl font-bold mb-2">Dashboard</Text>

      <Card
        title="Receita total"
        value={dashboard.income.total}
        percentage={parseFloat(dashboard.income.increasePercentage)}
        type={CardType.amount}
      />
      <Card
        title="Despesas totais"
        value={dashboard.expenses.total}
        percentage={parseFloat(dashboard.expenses.increasePercentage)}
        type={CardType.expenses}
      />
      <Card
        title="Economias"
        value={dashboard.amount.total}
        percentage={parseFloat(dashboard.amount.increasePercentage)}
        type={CardType.income}
      />

      <View className="flex-1 bg-white p-4 rounded-xl mt-2">
        <DashboardCharts
          lineData={dashboard.incomeByRange.map((dashboardValue) => ({ x: dashboardValue.period, y: dashboardValue.income }))}
          barData={dashboard.amountAndExpensesByRange.map((d) => ({
            x: d.period,
            amount: d.amount,
            expenses: d.expenses,
          }))}
        />
      </View>
    </ScrollView>
  );
}
