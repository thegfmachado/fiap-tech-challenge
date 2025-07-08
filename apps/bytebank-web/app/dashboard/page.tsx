"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { HTTPService } from "@bytebank/client/services/http-service";
import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction } from "@bytebank/shared/models/transaction.interface";

import { Header } from "@bytebank/components/template/header";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Main } from "@bytebank/components/template/main";
import { Layout } from "@bytebank/components/template/layout";
import { DashboardCard } from "@bytebank/components/template/dashboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bytebank/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@bytebank/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bytebank/components/ui/select";

const httpService = new HTTPService();

export default function Dashboard() {

  const data = [
    { name: "Jan", receita: 950, despesas: 1200 },
    { name: "Fev", receita: 1900, despesas: 1350 },
    { name: "Mar", receita: 1500, despesas: 950 },
    { name: "Abr", receita: 1650, despesas: 1850 },
    { name: "Mai", receita: 800, despesas: 600 },
    { name: "Jun", receita: 1650, despesas: 1200 },
    { name: "Jul", receita: 1300, despesas: 850 },
    { name: "Ago", receita: 1200, despesas: 800 },
    { name: "Set", receita: 1200, despesas: 820 },
    { name: "Out", receita: 1200, despesas: 810 },
    { name: "Nov", receita: 1200, despesas: 820 },
    { name: "Dez", receita: 1200, despesas: 800 },
  ]

  const historicoEconomiasData = [
    { name: 'Jan', economia: 300 },
    { name: 'Fev', economia: 1400 },
    { name: 'Mar', economia: 900 },
    { name: 'Abr', economia: 1300 },
    { name: 'Mai', economia: 850 },
    { name: 'Jun', economia: 1700 },
    { name: 'Jul', economia: 1100 },
    { name: 'Ago', economia: 1300 },
    { name: 'Set', economia: 1600 },
    { name: 'Out', economia: 1450 },
    { name: 'Nov', economia: 1350 },
    { name: 'Dez', economia: 1450 },
  ]

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
                  <Select defaultValue="mes">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mes">Mês atual</SelectItem>
                      <SelectItem value="semana">Semana atual</SelectItem>
                      <SelectItem value="ano">Ano atual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-2 mb-[20px]">
                <DashboardCard
                  title="Receita total"
                  value="15,000"
                  iconSrc="/images/dollar-square.svg"
                  valueColor="#3B9F4A"
                  percentage="+8,2%"
                />
                <DashboardCard
                  title="Despesas totais"
                  value="3,500"
                  iconSrc="/images/trend-down.svg"
                  valueColor="#9F523B"
                  percentage="+12,5%"
                />
                <DashboardCard
                  title="Economias"
                  value="8,000"
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
                        <AreaChart data={historicoEconomiasData}>
                          <CartesianGrid vertical={false} horizontal={true} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="economia" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
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
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="receita" fill="#22c55e" />
                          <Bar dataKey="despesas" fill="#92400e" />
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