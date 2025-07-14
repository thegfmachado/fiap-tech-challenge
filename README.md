<div align="center">
<img src="apps/bytebank-web/public/images/logo.svg" alt="ByteBank Logo" width="250">
</div>

<p align="center">
      <img alt="Amanda Lima" src="https://img.shields.io/badge/Tech Challenge-553860?style=flat&logo=Linkedin&logoColor=white" />
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/thegfmachado/fiap-tech-challenge?color=553860"/>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/thegfmachado/fiap-tech-challenge?color=553860"/>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-serviços">Serviços</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-executar-o-projeto">Executando</a> 
</p>

## 📖 Sobre o Projeto 

Este repositório contém a entrega do Tech Challenge de Front-end Engineering da FIAP. O projeto é dividido em dois pacotes principais:

- **@fiap-tech-challenge/design-system**: biblioteca de componentes reutilizáveis construída com Vite, Tailwind e Storybook.
- **bytebank-web**: aplicação de controle financeiro que consome os componentes do design system. Permite cadastrar transações de crédito (+) e débito (-), calculando o balanço total com base nas transações.


## 📋 Serviços
O projeto inclui os seguintes serviços:

- **App Principal**: [http://localhost:3000](http://localhost:3000)
- **Storybook**: [http://localhost:6006](http://localhost:6006)

## ✅ Funcionalidades

- [x] Cadastro de transações de crédito (+) e débito (-)
- [x] Cálculo automático do balanço
- [x] Design responsivo e acessível
- [x] Documentação interativa do Design System com Storybook

## 🔧 Tecnologias

- **Frontend**: 
    Next.js 15, React 19, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Monorepo**: Turborepo
- **Design System**: Storybook

## 🚀 Como executar o projeto

### 1. Instale as dependências

```bash
# Instalar dependências
npm install

# Configurar Supabase para desenvolvimento
cp apps/bytebank-web/.env.example apps/bytebank-web/.env.local
# Edite apps/bytebank-web/.env.local com suas credenciais

# Configurar Supabase para Docker (se usar)
cp .env.example .env
# Edite .env com suas credenciais
```

### 2. Modo de Desenvolvimento
Para iniciar o projeto em modo de desenvolvimento, execute o seguinte comando na raiz do repositório:
```bash
npm run dev
```

Este comando inicia o TurboRepo e executa as tasks necessárias para o desenvolvimento:


- `@fiap-tech-challenge/design-system`
- `bytebank-web`

O terminal exibirá um painel semelhante a este:

```
• Packages: 
  - @fiap-tech-challenge/design-system (http://localhost:60140)
  - bytebank-web (http://localhost:3000)
```

As portas podem variar, então fique atento às URLs exibidas no terminal após a inicialização. Acesse os endereços informados para abrir cada aplicação no navegador.

> 💡 **Dica:** Você pode navegar no painel do terminal usando as setas ↑ ↓ para visualizar os logs de cada task individualmente.

### 3. Docker
Para executar o projeto em Docker, utilize os seguintes comandos:
```bash
npm run docker           # Iniciar containers
npm run docker:down      # Parar containers
npm run docker:logs      # Ver logs
npm run docker:build     # Rebuild containers
```
