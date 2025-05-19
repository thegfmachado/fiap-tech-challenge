# tech-challenge  
FIAP Front-end Engineering Tech Challenge

Este repositório contém a entrega do Tech Challenge de Front-end Engineering da FIAP. O projeto é dividido em dois pacotes principais:

- **@fiap-tech-challenge/design-system**: biblioteca de componentes reutilizáveis construída com Vite, Tailwind e Storybook.
- **bytebank-web**: aplicação de controle financeiro que consome os componentes do design system. Permite cadastrar transações de crédito (+) e débito (-), calculando o balanço total com base nas transações.

---

## 🚀 Como rodar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Execute o projeto com TurboRepo

```bash
npm run dev
```

Esse comando inicia o TurboRepo e executa duas tasks em paralelo:

- `@fiap-tech-challenge/design-system`
- `bytebank-web`

O terminal exibirá um painel semelhante a este:

```
• Packages: 
  - @fiap-tech-challenge/design-system (http://localhost:60140)
  - bytebank-web (http://localhost:3000)
```

As portas podem variar, então fique atento às URLs exibidas no terminal após a inicialização. Acesse os endereços informados para abrir cada aplicação no navegador.

💡 **Dica:** Você pode navegar no painel do terminal usando as setas ↑ ↓ para visualizar os logs de cada task individualmente.

### 3. Rode o servidor de dados (JSON Server)

Abra **um novo terminal** e execute:

```bash
npm run server
```

Esse comando inicia o `json-server`, que fornece uma API REST local com os dados simulados usados pela aplicação.

O servidor geralmente estará disponível em:

```
http://localhost:3005
```

Mantenha esse terminal aberto durante o uso da aplicação `bytebank-web`.

---

## ✅ Pré-requisitos

- Node.js (versão recomendada: 20+)
- npm (versão recomendada: 10+)

---

## 📚 Observações finais

- O design system pode ser visualizado diretamente via Storybook, dependendo da porta mostrada ao iniciar com `npm run dev`.
- O sistema `bytebank-web` depende da API mockada para funcionar corretamente.
- Este projeto simula um monorepo utilizando [Turborepo](https://turbo.build/), facilitando o desenvolvimento paralelo de múltiplos pacotes.

---

Em caso de dúvidas, entre em contato com o grupo ou consulte os logs do terminal para mais detalhes.
