"use client";

import { HTTPService } from "@fiap-tech-challenge/services/http";

import { Header } from "@bytebank/components/template/header";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Main } from "@bytebank/components/template/main";
import { Layout } from "@bytebank/components/template/layout";
import { DashboardCard } from "@bytebank/components/template/dashboard/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bytebank/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bytebank/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@fiap-tech-challenge/design-system/components";
import { DashboardService } from "@bytebank/client/services/dashboard-service";
import { useEffect, useState } from "react";
import { IDashboardData } from "@fiap-tech-challenge/models";
import { formatCurrency } from "@bytebank/client/formatters";

const httpService = new HTTPService();
const dashboardService = new DashboardService(httpService);

const initialValues: IDashboardData = {
  amount: {
    total: 0,
    increasePercentage: '0%'
  },
  expenses: {
    total: 0,
    increasePercentage: '0%'
  },
  income: {
    total: 0,
    increasePercentage: '0%'
  },
  incomeByRange: [],
  amountAndExpensesByRange: []
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<IDashboardData>(initialValues);
  const [period, setPeriod] = useState("year");

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await dashboardService.get({ period });
      setDashboard(data);
    };

    void fetchTransactions();
  }, [period]);

  function barChartTooltipFormatter(value: number, name: string) {
    const labelMap: Record<string, string> = {
      amount: "Receita",
      expenses: "Despesas",
    };

    return [formatCurrency(Number(value), { signDisplay: "never" }), labelMap[name] || name];
  }

  return (
    <Layout>
      <Header />
      <Sidebar />

      <Main>
        <div
          className="flex flex-col items-center w-full p-8 gap-4">
          <div className="w-full flex flex-col">

            <div className="flex flex-col">
              <div className="flex flex-row w-full mb-5 items-center gap-4 justify-between">
                <h1 className="text-2xl font-bold flex-1 m-0">Dashboard</h1>

                <div className="flex items-center justify-end">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Semana atual</SelectItem>
                      <SelectItem value="month">Mês atual</SelectItem>
                      <SelectItem value="year">Ano atual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-2 mb-5">
                <DashboardCard
                  title="Receita total"
                  value={dashboard.income.total}
                  iconSrc="/images/dollar-square.svg"
                  valueColor="#3B9F4A"
                  percentage={dashboard.income.increasePercentage}
                  filter={period}
                />
                <DashboardCard
                  title="Despesas totais"
                  value={dashboard.expenses.total}
                  iconSrc="/images/trend-down.svg"
                  valueColor="#9F523B"
                  percentage={dashboard.expenses.increasePercentage}
                  filter={period}
                />
                <DashboardCard
                  title="Economias"
                  value={dashboard.amount.total}
                  iconSrc="/images/coin-black.svg"
                  valueColor="#3B9F4A"
                  percentage={dashboard.amount.increasePercentage}
                  filter={period}
                />
              </div>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm">
                  <TabsTrigger value="general">Visão Geral</TabsTrigger>
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Histórico de Economias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dashboard.incomeByRange}>
                          <CartesianGrid vertical={false} horizontal={true} />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(Number(value), { signDisplay: "never" }), "Economia"]} />
                          <Area type="linear" dataKey="income" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="details">
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Receita vs Despesas</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboard.amountAndExpensesByRange}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip formatter={barChartTooltipFormatter} />
                          <Bar dataKey="amount" fill="#22c55e" />
                          <Bar dataKey="expenses" fill="#92400e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

            </div>
          </div>
        </div>
      </Main>
    </Layout>
  );
}
