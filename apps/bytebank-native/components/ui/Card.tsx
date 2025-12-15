import { FilterType } from "@fiap-tech-challenge/models";
import React from "react";
import { View, Text, Image } from "react-native";

export enum CardType {
  income,
  amount,
  expenses
}

type DashboardCardProps = {
  title: string;
  value: number;
  percentage: number;
  type: CardType;
  filterType: FilterType;
};

export function Card({ title, value, percentage, type, filterType }: DashboardCardProps) {
  const colors = {
    [CardType.amount]: "text-primary-light",
    [CardType.expenses]: "text-debit-color",
    [CardType.income]: "text-credit-color"
  };

  const icons = {
    [CardType.amount]: require("../assets/images/dollar-square.png"),
    [CardType.expenses]: require("../assets/images/coin.png"),
    [CardType.income]: require("../assets/images/trend-down.png")
  };

  const timePeriodLabels = {
    [FilterType.YEAR]: "ano",
    [FilterType.MONTH]: "mês",
    [FilterType.WEEK]: "semana"
  };

  const color = colors[type];
  const icon = icons[type];
  const timeLabel = timePeriodLabels[filterType];

  return (
    <View className="border bg-white border-gray-300 rounded-xl p-4 mb-4 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="font-bold text-sm">{title}</Text>
          <Image
            source={icon}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <Text className={`text-2xl font-bold ${color}`}>
          R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text className="text-gray-500 text-sm">
          {percentage > 0 ? "+" : ""}
          {percentage}% vs {timeLabel} anterior
        </Text>
      </View>
    </View>
  );
}
