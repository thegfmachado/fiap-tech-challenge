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
    <ScrollView className="flex-1 px-4 pt-6 bg-gray-50">
      {/* Título */}
      <Text className="text-2xl font-bold mb-4">Dashboards</Text>

      {/* Card principal */}
      <Card
        title="Receita total"
        value={dashboard.income.total}
        percentage={parseFloat(dashboard.income.increasePercentage)}
        type={CardType.amount}
      />

      {/* Linha com 2 cards */}
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Card
            title="Entradas"
            value={dashboard.amount.total}
            percentage={parseFloat(dashboard.amount.increasePercentage)}
            type={CardType.income}
          />
        </View>

        <View className="flex-1">
          <Card
            title="Saídas"
            value={dashboard.expenses.total}
            percentage={parseFloat(dashboard.expenses.increasePercentage)}
            type={CardType.expenses}
          />
        </View>
      </View>

      <DashboardCharts
        lineData={dashboard.incomeByRange.map((d) => ({
          x: d.period,
          y: d.income,
        }))}
        barData={dashboard.amountAndExpensesByRange.map((d) => ({
          x: d.period,
          amount: d.amount,
          expenses: d.expenses,
        }))}
      />
    </ScrollView>
  );
}
