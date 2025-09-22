<div align="center">
<img src="apps/bytebank-web/public/images/logo.svg" alt="ByteBank Logo" width="250">
</div>

<p align="center">
  <img alt="Tech Challenge" src="https://img.shields.io/badge/Tech Challenge-553860?style=flat&logo=Linkedin&logoColor=white" />
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/thegfmachado/fiap-tech-challenge?color=553860"/>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/thegfmachado/fiap-tech-challenge?color=553860"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Database-Supabase-3FCF8E?style=flat&logo=supabase"/>
  <a href="https://www.figma.com/design/txyjPxUFkKNYhXL3xchgid/postech?node-id=0-1&t=d4oPH6wI1e1JRe7A-1"><img alt="Figma" src="https://img.shields.io/badge/Figma-553860?style=flat&logo=figma&logoColor=white"/></a>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-início-rápido">Início Rápido</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a> •
  <a href="#-comandos">Comandos</a>
</p>

## 📖 Sobre o Projeto

Este repositório contém a entrega do Tech Challenge de Front-end Engineering da FIAP. O projeto é uma aplicação de controle financeiro chamada **ByteBank**, construída como um monorepo usando TurboRepo.

### 🏗️ Arquitetura

O projeto está organizado em pacotes independentes:

**Apps:**

- **bytebank-web**: Aplicação principal de controle financeiro (React/Next.js)
- **bytebank-web-auth**: Sistema de autenticação e cadastro (React/Next.js)
- **bytebank-native**: Aplicação mobile nativa (React Native/Expo)

**Packages:**

- **@fiap-tech-challenge/design-system**: Biblioteca de componentes reutilizáveis (documentada no Storybook)
- **@fiap-tech-challenge/database**: Utilidades e queries do Supabase
- **@fiap-tech-challenge/models**: Interfaces e modelos (TypeScript)
- **@fiap-tech-challenge/services**: Serviços compartilhados
- **@fiap-tech-challenge/eslint-config**: Configurações de ESLint
- **@fiap-tech-challenge/typescript-config**: Configurações de TypeScript

### 🏛️ Arquitetura Micro Front-end

O projeto implementa uma **arquitetura de micro front-end** onde a autenticação é isolada em uma aplicação independente:

#### **bytebank-web-auth** (Micro Front-end de Autenticação)

- **Responsabilidade**: Gerenciar login, cadastro, recuperação de senha e autenticação
- **Isolamento**: Aplicação Next.js independente com seu próprio build e deploy
- **Comunicação**: Integração via redirecionamentos e shared state através do Supabase
- **Benefícios**:
  - **Deployment independente**: Auth pode ser atualizada sem afetar a aplicação principal
  - **Tecnologias específicas**: Pode usar stack otimizada para autenticação
  - **Escalabilidade**: Pode ser hospedada em infraestrutura dedicada para alta disponibilidade

#### **Integração entre Micro Front-ends**

- **Estado compartilhado**: Sessão do usuário gerenciada pelo Supabase
- **Roteamento**: Redirecionamentos automáticos entre apps baseados no estado de autenticação
- **Design System**: Componentes UI compartilhados via `@fiap-tech-challenge/design-system`
- **Tipos**: Modelos de dados compartilhados via `@fiap-tech-challenge/models`

### 📱 Aplicação Mobile Nativa (bytebank-native)

O projeto também inclui uma **aplicação móvel nativa** desenvolvida com React Native e Expo:

- **Autenticação**: Integração direta com Supabase
- **Compartilhamento**: Reutiliza packages do monorepo (`@fiap-tech-challenge/database`, `models`, `services`)

#### **Integração com o Ecossistema**

- **Estado compartilhado**: Mesma conexão com o Supabase das aplicações web
- **Dados sincronizados**: Utiliza as mesmas queries e mutations
- **Design consistente**: Adaptação mobile do design system

### ⚛️ Gerenciamento de Estado

O projeto adota uma **abordagem simples e pragmática** para gerenciamento de estado, utilizando principalmente **React Context API** e hooks nativos:

#### **Estratégia de Estado**

- **Context API nativo**: Para estado que precisa ser compartilhado entre componentes
- **useState local**: Para estado de componentes isolados
- **React Hook Form**: Para gerenciamento de formulários complexos
- **Supabase**: Para persistência e sincronização de dados

#### **Justificativa da Abordagem**

**Por que Context API ao invés de Redux/Zustand?**

- ✅ **Simplicidade**: O projeto não possui estado complexo que justifique bibliotecas externas
- ✅ **Performance**: Context API atende bem para o volume de estado atual
- ✅ **Manutenibilidade**: Menos dependências e boilerplate

## 🚀 Início Rápido

### 📋 Pré-requisitos

- **Node.js** 20+ e **npm**
- **Docker** (para Supabase local)
- **Git** configurado com SSH

### ⚡ Comandos Essenciais

```bash
# 1. Clone e instale dependências
git clone https://github.com/thegfmachado/fiap-tech-challenge.git
cd fiap-tech-challenge
npm install

# 2. Configure o Supabase (primeira vez)
npm run db:local:start

# 3. Inicie todas as aplicações
npm run dev
```

📚 **Primeira vez?** Consulte o [Guia de Configuração do Supabase](SUPABASE_SETUP.md) para setup detalhado, credenciais e troubleshooting.

### 🌐 URLs dos Serviços

Após iniciar, as aplicações estarão disponíveis em:

- **App Principal**: [http://localhost:3000](http://localhost:3000) - Interface principal do ByteBank
- **App Autenticação**: [http://localhost:3001](http://localhost:3001) - Sistema de autenticação
- **App Native**: [http://localhost:8081](http://localhost:8081) - Interface mobile nativa (Expo)
- **Storybook**: [http://localhost:9009](http://localhost:9009) - Documentação do Design System
- **Supabase Studio**: [http://127.0.0.1:54323](http://127.0.0.1:54323) - Interface web do banco de dados

## ✅ Funcionalidades

### Web Apps (bytebank-web + bytebank-web-auth)

- [x] Cadastro de transações de crédito (+) e débito (-)
- [x] Upload de anexos/comprovantes para transações
- [x] Download e visualização de anexos
- [x] Cálculo automático do balanço
- [x] Gráficos de desempenho financeiro
- [x] Arquitetura micro front-end para autenticação
- [x] Design responsivo e acessível
- [x] Documentação interativa do Design System com Storybook

### Mobile App (bytebank-native)

- [x] Mesmas funcionalidades do aplicativo web
- [x] Aplicação nativa multiplataforma (iOS, Android)
- [x] Navegação com abas
- [x] Sincronização com a mesma base de dados do aplicativo web

## 🔧 Tecnologias

### Frontend

- **Next.js 15** - Framework React com Server Components (apps web)
- **React 19** - Biblioteca de interface
- **React Native 0.79** - Framework mobile multiplataforma
- **Expo SDK 53** - Ferramentas e serviços para React Native
- **TypeScript 5.8** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **NativeWind 4.1** - TailwindCSS para React Native

### Backend & Database

- **Supabase** - Backend as a Service (PostgreSQL)
- **PostgreSQL** - Banco de dados relacional

### Design System & Documentação

- **Storybook** - Documentação de componentes
- **Vite** - Build tool para o design system

### Ferramentas de Desenvolvimento

- **TurboRepo 2.5** - Monorepo toolkit
- **ESLint** - Linting de código
- **TypeScript** - Verificação de tipos
- **Expo** - Ecossistema de desenvolvimento mobile nativo
- **Docker** - Containerização (Supabase local)

### Deploy & CI/CD

- **Vercel** - Deploy das aplicações frontend
- **Docker Compose** - Orquestração de containers locais

## 💻 Desenvolvimento

### 1. Configure o banco de dados local (Supabase)

```bash
npm run db:local:start
```

> **📖 Configuração completa:** Para setup detalhado, credenciais e troubleshooting específico do Supabase, consulte [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### 2. Modo de Desenvolvimento

Em um **novo terminal**, inicie as aplicações:

```bash
npm run dev
```

> **💡 Nota:** Este comando inicia o TurboRepo e executa todas as aplicações. As URLs estão disponíveis na [seção Início Rápido](#-início-rápido).

#### Executando o app React Native (bytebank-native)

A aplicação mobile utiliza Expo e pode ser executada de várias formas:

#### Dispositivo Físico (Recomendado)

1. **Baixe o aplicativo Expo Go** na App Store (iOS) ou Google Play (Android)
2. **Abra o Expo Go** no seu dispositivo
3. **Escaneie o QR code** exibido no terminal do processo `bytebank-native`

#### Emuladores/Simuladores

```bash
# iOS Simulator (requer macOS e Xcode)
cd apps/bytebank-native
npm run ios

# Android Emulator (requer Android Studio)
cd apps/bytebank-native
npm run android
```

#### Navegador Web

A aplicação também roda no navegador através do Expo Web:

- Acesse: <http://localhost:8081>
- Pressione `w` no terminal do Expo para abrir no navegador

### 3. Parar os serviços

```bash
# Parar aplicações (Ctrl+C no terminal onde rodou npm run dev)

# Parar Supabase local
npm run db:local:stop
```

## 📋 Comandos

### Banco de dados

```bash
npm run db:local:start     # Iniciar Supabase local
npm run db:local:stop      # Parar Supabase local
npm run db:local:status    # Ver status e credenciais
npm run db:generate:types  # Gerar tipos TypeScript do banco
```

### Desenvolvimento

```bash
npm run dev                # Iniciar todas as aplicações
npm run build              # Build de produção
npm run lint               # Verificar código
npm run format             # Formatar código
```

### Workspaces específicos

```bash
# Iniciar apenas um serviço específico
npm run dev --workspace packages/design-system
npm run dev --workspace apps/bytebank-web
npm run dev --workspace apps/bytebank-native
```

### Docker (Alternativo)

```bash
npm run docker:up        # Iniciar containers
npm run docker:down      # Parar containers
npm run docker:logs      # Ver logs
npm run docker:build     # Rebuild containers
```

## 🔧 Troubleshooting

### Problemas comuns

#### 1. Porta já está em uso

**Unix/Linux/macOS:**

```bash
# Verificar processos nas portas
lsof -i :3000  # ou :3001, :54321, etc
# Matar processo específico
kill -9 <PID>
```

**Windows:**

```powershell
# Verificar processos nas portas
netstat -ano | findstr :3000
# Matar processo específico
taskkill /PID <PID> /F
```

#### 2. Problemas com Supabase

> **📖 Troubleshooting completo:** Para problemas específicos do Supabase, consulte [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

#### 3. Erro de dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Estrutura de pastas

```text
fiap-tech-challenge/
├── apps/
│   ├── bytebank-web/           # App principal (Next.js)
│   ├── bytebank-web-auth/      # App de autenticação (Next.js)
│   └── bytebank-native/        # App mobile nativo (React Native/Expo)
├── packages/
│   ├── database/               # Utilities do Supabase
│   ├── design-system/          # Componentes UI (Storybook)
│   ├── models/                 # Tipos TypeScript
│   ├── services/               # Serviços compartilhados
│   ├── eslint-config/          # Config ESLint
│   └── typescript-config/      # Config TypeScript
├── docker-compose.yml          # Docker para produção
├── turbo.json                  # Config TurboRepo
└── package.json               # Dependencies raiz
```
