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
  <a href="#-serviços">Serviços</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-executar-o-projeto">Executando</a>
</p>

## 📖 Sobre o Projeto

Este repositório contém a entrega do Tech Challenge de Front-end Engineering da FIAP. O projeto é uma aplicação de controle financeiro chamada **ByteBank**, construída como um monorepo usando TurboRepo.

### 🏗️ Arquitetura

O projeto está organizado em pacotes independentes:

**Apps:**

- **bytebank-web**: Aplicação principal de controle financeiro (React/Next.js)
- **bytebank-web-auth**: Sistema de autenticação e cadastro

**Packages:**

- **@fiap-tech-challenge/design-system**: Biblioteca de componentes reutilizáveis (Storybook)
- **@fiap-tech-challenge/database**: Utilities e queries do Supabase
- **@fiap-tech-challenge/models**: Tipos e modelos TypeScript
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
  - **Deployment independente**: Auth pode ser atualizada sem afetar a app principal
  - **Tecnologias específicas**: Pode usar stack otimizada para autenticação
  - **Escalabilidade**: Pode ser hospedada em infraestrutura dedicada para alta disponibilidade

#### **Integração entre Micro Front-ends**

- **Estado compartilhado**: Sessão do usuário gerenciada pelo Supabase
- **Roteamento**: Redirecionamentos automáticos entre apps baseados no estado de autenticação
- **Design System**: Componentes UI compartilhados via `@fiap-tech-challenge/design-system`
- **Tipos**: Modelos de dados compartilhados via `@fiap-tech-challenge/models`

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

## 📋 Serviços

O projeto inclui os seguintes serviços em desenvolvimento local:

- **App Principal**: [http://localhost:3000](http://localhost:3000) - Interface principal do ByteBank
- **App Nativo**: [http://localhost:3000](http://localhost:8081) - Interface mobile nativa do ByteBank
- **App Autenticação**: [http://localhost:3001](http://localhost:3001) - Sistema de autenticação
- **Storybook**: [http://localhost:9009](http://localhost:9009) - Documentação do Design System
- **Supabase Studio**: [http://127.0.0.1:54323](http://127.0.0.1:54323) - Interface web do banco de dados
- **Supabase API**: [http://127.0.0.1:54321](http://127.0.0.1:54321) - API do banco de dados

## ✅ Funcionalidades

- [x] Cadastro de transações de crédito (+) e débito (-)
- [x] Upload de anexos/comprovantes para transações
- [x] Download e visualização de anexos
- [x] Cálculo automático do balanço
- [x] Gráficos de desempenho financeiro
- [x] Arquitetura micro front-end para autenticação
- [x] Design responsivo e acessível
- [x] Documentação interativa do Design System com Storybook

## 🔧 Tecnologias

### Frontend

- **Next.js 15** - Framework React com Server Components
- **React 19 / React Native** - Biblioteca de interface
- **TypeScript 5.8** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário

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

## 🚀 Como executar o projeto

### 📋 Pré-requisitos

- **Node.js** 20+ e **npm**
- **Docker** (para Supabase local)
- **Git** configurado com SSH (para clonagem)

### 1. Clone e instale dependências

```bash
# Clone o repositório
git clone https://github.com/thegfmachado/fiap-tech-challenge.git
cd fiap-tech-challenge

# Instalar dependências
npm install
```

### 2. Configure o banco de dados local (Supabase)

O projeto usa Supabase como banco de dados. Para desenvolvimento local:

```bash
# Iniciar Supabase local (primeira vez pode demorar devido ao download das imagens Docker)
npm run db:local:start
```

**Aguarde até ver a mensagem:**

```text
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
      Studio URL: http://127.0.0.1:54323
```

> **💡 Importante:** As credenciais locais do Supabase são fixas e pré-definidas. Para verificar as credenciais atuais, use: `cd packages/database && npx supabase status`

### 3. Modo de Desenvolvimento

Em um **novo terminal**, inicie as aplicações:

```bash
npm run dev
```

Este comando inicia o TurboRepo e executa todas as aplicações:

- **ByteBank Web**: http://localhost:3000 (aplicação principal)
- **ByteBank Auth**: http://localhost:3001 (autenticação)
- **ByteBank Native**: http://localhost:8081 (mobile nativo)
- **Design System**: Componentes compartilhados
- **Storybook**: Documentação dos componentes (porta dinâmica, veja logs)

#### Executando o app React Native (bytebank-native)

Para abrir o aplicativo móvel no seu dispositivo físico:

1. **Baixe o aplicativo Expo Go** na App Store (iOS) ou Google Play (Android).
2. **Abra o Expo Go** no seu dispositivo.
3. **Escaneie o QR code** exibido no terminal do processo `bytebank-native`.

### 4. URLs importantes

| Serviço               | URL                    | Descrição                           |
| --------------------- | ---------------------- | ----------------------------------- |
| **App Principal**     | http://localhost:3000  | Interface principal do ByteBank     |
| **App Auth**          | http://localhost:3001  | Sistema de autenticação             |
| **App Mobile Nativo** | http://localhost:8081  | Interface mobile nativa do ByteBank |
| **Storybook**         | Porta dinâmica\*       | Documentação do Design System       |
| **Supabase Studio**   | http://127.0.0.1:54323 | Interface web do banco de dados     |
| **Supabase API**      | http://127.0.0.1:54321 | API do banco de dados               |

### 5. Comandos úteis

```bash
# Gerenciar banco de dados
npm run db:local:start     # Iniciar Supabase local
npm run db:generate:types  # Gerar tipos TypeScript do banco

# Desenvolvimento
npm run dev                # Iniciar todas as aplicações
npm run build              # Build de produção
npm run lint               # Verificar código
npm run format             # Formatar código

# Storybook
npm run storybook          # Iniciar apenas o Storybook (via workspace)

# Observação: O Storybook usa porta dinâmica
# Para encontrar a URL correta, verifique os logs do comando 'npm run dev'
# ou procure por "Local: http://localhost:XXXXX/" nos logs
```

> **💡 Nota:** Para parar o Supabase local, use: `cd packages/database && npx supabase stop`

### 6. Dados de teste

O banco local já vem com dados de exemplo:

- 5 transações de teste (créditos e débitos)
- Esquema completo da tabela `transactions`
- Você pode visualizar e gerenciar os dados via **Supabase Studio** em http://127.0.0.1:54323

### 7. Parar os serviços

```bash
# Parar aplicações (Ctrl+C no terminal onde rodou npm run dev)

# Parar Supabase local
cd packages/database && npx supabase stop
```

### 8. Docker (Alternativo)

Para executar com Docker em produção:

```bash
npm run docker:up        # Iniciar containers
npm run docker:down      # Parar containers
npm run docker:logs      # Ver logs
npm run docker:build     # Rebuild containers
```

## 🔧 Troubleshooting

### Problemas comuns

**1. Porta já está em uso**

```bash
# Verificar processos nas portas
lsof -i :3000  # ou :3001, :54321, etc
# Matar processo específico
kill -9 <PID>
```

**2. Supabase não inicia**

```bash
# Verificar se Docker está rodando
docker ps

# Parar e reiniciar Supabase
cd packages/database && npx supabase stop
cd packages/database && npx supabase start
```

**3. Erro de dependências**

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**4. Aplicação não conecta ao banco**

- Verifique se o Supabase está rodando: http://127.0.0.1:54323
- Execute `cd packages/database && npx supabase status` para ver as credenciais
- Confirme se os arquivos `.env.local` estão configurados com as credenciais corretas
- Reinicie a aplicação após alterar variáveis de ambiente

### Estrutura de pastas

```
fiap-tech-challenge/
├── apps/
│   ├── bytebank-web/           # App principal
│   └── bytebank-web-auth/      # App de autenticação
├── packages/
│   ├── database/               # Utilities do Supabase
│   ├── design-system/          # Componentes UI
│   ├── models/                 # Tipos TypeScript
│   ├── services/               # Serviços compartilhados
│   ├── eslint-config/          # Config ESLint
│   └── typescript-config/      # Config TypeScript
├── docker-compose.yml          # Docker para produção
├── turbo.json                  # Config TurboRepo
└── package.json               # Dependencies raiz
```
