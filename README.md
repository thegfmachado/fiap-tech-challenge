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
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-decisões-técnicas">Decisões Técnicas</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-comandos">Comandos</a>
</p>

## 📖 Sobre o Projeto

Aplicação de controle financeiro desenvolvida como entrega do **Tech Challenge de Front-end Engineering da FIAP**. O **ByteBank** permite gerenciar transações financeiras (crédito/débito), visualizar dashboards com gráficos e fazer upload de comprovantes.

### ✅ Funcionalidades

- Cadastro de transações de crédito (+) e débito (-)
- Upload e visualização de anexos/comprovantes
- Dashboard com gráficos de desempenho financeiro
- Autenticação completa (login, cadastro, recuperação de senha)
- Aplicação mobile com paridade de funcionalidades

## 🚀 Início Rápido

### 📋 Pré-requisitos

- **Node.js** 20+ e **npm**
- **Docker** (para Supabase local)

### ⚡ Instalação

```bash
# Clone e instale
git clone https://github.com/thegfmachado/fiap-tech-challenge.git
cd fiap-tech-challenge
npm install

# Configure o Supabase local
npm run db:local:start

# Inicie todas as aplicações
npm run dev
```

> 📚 Para configuração detalhada do Supabase, consulte o [README do package database](packages/database/README.md).

### 🌐 URLs

| Serviço | URL | Descrição |
|---------|-----|-----------|
| App Principal | [localhost:3000](http://localhost:3000) | Interface principal |
| App Auth | [localhost:3001](http://localhost:3001) | Autenticação (micro frontend) |
| App Mobile | [localhost:8081](http://localhost:8081) | Versão mobile (Expo Web) |
| Storybook | [localhost:9009](http://localhost:9009) | Design System |
| Supabase Studio | [localhost:54323](http://127.0.0.1:54323) | Banco de dados |

## 🏗️ Arquitetura

Monorepo gerenciado com **TurboRepo**, organizado em apps e packages compartilhados:

```
fiap-tech-challenge/
├── apps/
│   ├── bytebank-web/           # App principal (Next.js) 
│   ├── bytebank-web-auth/      # Micro frontend auth (Next.js) 
│   └── bytebank-native/        # App mobile (React Native/Expo) 
└── packages/
    ├── database/               # Cliente e queries Supabase 
    ├── design-system/          # Componentes UI + Storybook 
    ├── models/                 # Tipos e interfaces TypeScript 
    ├── services/               # Serviços HTTP e storage 
    ├── utils/                  # Funções utilitárias 
    ├── validation-schemas/     # Schemas Zod 
    ├── eslint-config/          # Configuração ESLint
    └── typescript-config/      # Configuração TypeScript
```

> 📖 Consulte a seção [Documentação](#-documentação) para links diretos para cada README.

<details>
<summary><b>📊 Diagrama de Arquitetura</b></summary>

```
┌────────────────────────────────────────────────────────────┐
│                            USUÁRIO                         │
└─────────────────────────────┬──────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  bytebank-web   │  │bytebank-web-auth│  │ bytebank-native │
│   (Next.js)     │◄─│   (Next.js)     │  │  (Expo/RN)      │
│   Port: 3000    │  │   Port: 3001    │  │   Port: 8081    │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │           PACKAGES COMPARTILHADOS      │
         │  database │ design-system │ models     │
         │  services │ utils │ validation-schemas │
         └────────────────────┬───────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │              SUPABASE                  │
         │   PostgreSQL + Auth + Storage          │
         └────────────────────────────────────────┘
```

</details>

<details>
<summary><b>🔄 Fluxo de Micro Frontend (Auth)</b></summary>

O app de autenticação funciona como um **micro frontend** integrado via rewrites do Next.js:

```
┌──────────────────┐    ┌───────────────────┐    ┌──────────────┐
│    Usuário       │    │   bytebank-web    │    │  web-auth    │
└────────┬─────────┘    └─────────┬─────────┘    └──────┬───────┘
         │                        │                     │
         │  GET /auth/login       │                     │
         │───────────────────────>│                     │
         │                        │                     │
         │                        │  Proxy (rewrite)    │
         │                        │────────────────────>│
         │                        │                     │
         │  Página de login       │                     │
         │<───────────────────────│<────────────────────│
         │                        │                     │
         │  POST credenciais      │                     │
         │───────────────────────────────────────────────>
         │                        │                     │
         │  Set cookies + redirect /home                │
         │<───────────────────────────────────────────────
```

**Rotas proxy:** `/auth/*` e `/api/auth/*` → `bytebank-web-auth`

</details>

## 🎯 Decisões Técnicas

### Por que TurboRepo?

Ferramenta moderna de monorepo com **cache inteligente**, desenvolvida pela Vercel (mesma do Next.js), garantindo boa integração e builds rápidos.

### Por que Micro Frontend para Auth?

Separamos a autenticação para **deploy independente** e **isolamento de responsabilidade**. O código de auth não se mistura com regras de negócio e pode escalar separadamente.

### Por que Context API ao invés de Redux/Zustand?

O projeto **não possui estado global complexo**. A maioria dos dados vem do Supabase e o único estado compartilhado é o usuário logado. Context API atende bem, com menos boilerplate.

### Por que Supabase?

Oferece **PostgreSQL + Auth + Storage** em uma solução. O **Row Level Security (RLS)** garante que cada usuário só acessa seus próprios dados, sem lógica extra no frontend.

### Por que React Hook Form + Zod?

**RHF** usa refs e evita re-renders. **Zod** infere tipos automaticamente e permite **compartilhar schemas** de validação entre web e mobile.

### Por que Expo para o Mobile?

**Setup simplificado** sem precisar configurar Xcode/Android Studio. O **Expo Go** permite testar rapidamente em dispositivos físicos e reutiliza os packages do monorepo.

## 🔧 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend Web** | Next.js 15, React 19, TypeScript 5.8, TailwindCSS |
| **Frontend Mobile** | React Native 0.79, Expo SDK 53, NativeWind |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Build** | TurboRepo 2.5, Vite, Turbopack |
| **UI** | Radix UI, Storybook 8.6, Recharts, Victory Native |

## 📋 Comandos

### Desenvolvimento

```bash
npm run dev              # Iniciar todas as apps
npm run build            # Build de produção
npm run lint             # Verificar código
npm run check-types      # Verificar tipos TypeScript
```

### Banco de Dados

```bash
npm run db:local:start   # Iniciar Supabase local
npm run db:local:stop    # Parar Supabase local
npm run db:local:status  # Ver status e credenciais
```

### Docker

```bash
npm run docker:up        # Subir containers de produção
npm run docker:down      # Parar containers
```

### Workspace Específico

```bash
npm run dev --workspace apps/bytebank-web
npm run dev --workspace apps/bytebank-native
npm run dev --workspace packages/design-system
```

## 📚 Documentação

### Apps

| Módulo | Descrição | README |
|--------|-----------|--------|
| **bytebank-web** | App principal (Next.js) | [📖 Ver docs](apps/bytebank-web/README.md) |
| **bytebank-web-auth** | Micro frontend de autenticação | [📖 Ver docs](apps/bytebank-web-auth/README.md) |
| **bytebank-native** | App mobile (Expo/React Native) | [📖 Ver docs](apps/bytebank-native/README.md) |

### Packages

| Package | Descrição | README |
|---------|-----------|--------|
| **database** | Cliente Supabase, queries e setup | [📖 Ver docs](packages/database/README.md) |
| **design-system** | Componentes UI + Storybook | [📖 Ver docs](packages/design-system/README.md) |
| **models** | Tipos e interfaces TypeScript | [📖 Ver docs](packages/models/README.md) |
| **services** | Serviços HTTP e storage | [📖 Ver docs](packages/services/README.md) |
| **utils** | Funções utilitárias | [📖 Ver docs](packages/utils/README.md) |
| **validation-schemas** | Schemas Zod | [📖 Ver docs](packages/validation-schemas/README.md) |

## 🐛 Troubleshooting

<details>
<summary><b>Porta já está em uso</b></summary>

```bash
# Linux/macOS
lsof -i :3000 && kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

</details>

<details>
<summary><b>Problemas com dependências</b></summary>

```bash
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><b>Problemas com Supabase</b></summary>

Consulte o [README do package database](packages/database/README.md#troubleshooting).

</details>
