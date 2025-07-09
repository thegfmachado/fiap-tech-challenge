"use client";

import { HTTPService } from "@bytebank/client/services/http-service";

import { Header } from "@bytebank/components/template/header";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Main } from "@bytebank/components/template/main";
import { Layout } from "@bytebank/components/template/layout";
import { DashboardCard } from "@bytebank/components/template/dashboard/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bytebank/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bytebank/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@fiap-tech-challenge/design-system/components";
import { DashboardService } from "@bytebank/client/services/dashboard-service";
import { useEffect, useState } from "react";
import { IDashboardData } from "@bytebank/shared/models/dashboard-data.interface";

const httpService = new HTTPService();
const dashboardService = new DashboardService(httpService);

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<IDashboardData>({ amount: 0, expenses: 0, income: 0, incomeByMonth: [], amountAndExpensesByMonth: [] });
  const [period, setPeriod] = useState("year");
  console.log('period', period)

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await dashboardService.get({ period });
      console.log('data', data)
      setDashboard(data);
    };

    void fetchTransactions();
  }, [period]);

  return (
    <Layout>
      <Header />
      <Sidebar />

      <Main>
        <div
          className="flex flex-col items-center w-full p-8 gap-4">
          <div className="w-full flex flex-col">

            <div className="flex flex-col">
              <div className="flex flex-row w-full mb-[20px] items-center gap-4 justify-between">
                <h1 className="text-2xl font-bold flex-1 m-0">Dashboard</h1>

                <div className="flex items-center justify-end">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mês atual</SelectItem>
                      <SelectItem value="week">Semana atual</SelectItem>
                      <SelectItem value="year">Ano atual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-2 mb-[20px]">
                <DashboardCard
                  title="Receita total"
                  value={dashboard.income}
                  iconSrc="/images/dollar-square.svg"
                  valueColor="#3B9F4A"
                  percentage="+8,2%"
                />
                <DashboardCard
                  title="Despesas totais"
                  value={dashboard.expenses}
                  iconSrc="/images/trend-down.svg"
                  valueColor="#9F523B"
                  percentage="+12,5%"
                />
                <DashboardCard
                  title="Economias"
                  value={dashboard.amount}
                  iconSrc="/images/coin-black.svg"
                  valueColor="#3B9F4A"
                  percentage="+10%"
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
                        <AreaChart data={dashboard.incomeByMonth}>
                          <CartesianGrid vertical={false} horizontal={true} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [value, "Economia"]} />
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
                        <BarChart data={dashboard.amountAndExpensesByMonth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value, name) => {
                            if (name === "amount") return [value, "Receita"];
                            if (name === "expenses") return [value, "Despesas"];
                            return [value, name];
                          }} />
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