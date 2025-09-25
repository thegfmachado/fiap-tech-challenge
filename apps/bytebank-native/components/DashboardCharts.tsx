import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineDashboardChart } from "./LineDashboardChart";
import { BarDashboardChart } from "./BarDashboardChart";


type DashboardChartsProps = {
  lineData: { x: number | string; y: number }[];
  barData: { x: string; amount: number; expenses: number }[];
};

type TabOption = "overview" | "details";

interface TabButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const TabButton = ({ label, isSelected, onPress }: TabButtonProps) => (
  <TouchableOpacity onPress={onPress} className="mr-4">
    <Text
      className="text-center p-2 font-semibold"
      style={{ color: isSelected ? "#664373" : "#6B7280" }}
    >
      {label}
    </Text>
    {isSelected && (
      <View style={{ height: 2, backgroundColor: "#664373", marginTop: 4 }} />
    )}
  </TouchableOpacity>
);

export default function DashboardCharts({ lineData, barData }: DashboardChartsProps) {
  const [selectedTab, setSelectedTab] = useState<TabOption>("overview");

  const tabs = [
    { id: "overview" as TabOption, label: "Visão Geral" },
    { id: "details" as TabOption, label: "Detalhes" },
  ];

  return (
    <View className="flex-1 w-full">
      {/* Tabs */}
      <View className="flex-row justify-start border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isSelected={selectedTab === tab.id}
            onPress={() => setSelectedTab(tab.id)}
          />
        ))}
      </View>

      {/* Content */}
      <View className="flex-1 items-center">
        {selectedTab === "overview" && (
          <LineDashboardChart
            data={lineData.map((item) => ({ x: String(item.x), y: item.y }))}
          />
        )}
        {selectedTab === "details" && (
          <BarDashboardChart
            data={barData}
          />
        )}
      </View>
    </View>
  );
}
