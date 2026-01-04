# 🌐 ByteBank Web

Aplicação principal de controle financeiro construída com **Next.js 15** e **React 19**.

## 📋 Visão Geral

Este é o app principal do ByteBank, responsável por:
- Dashboard com gráficos de desempenho financeiro
- Gestão de transações (CRUD)
- Visualização de saldo e extratos
- Upload de comprovantes

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/bytebank-web

# Ou inicie todos os apps
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura

```
bytebank-web/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Grupo de rotas de auth (proxy)
│   ├── api/               # API Routes
│   ├── dashboard/         # Página de gráficos
│   ├── home/              # Página inicial (logado)
│   └── transaction/       # Página de transações
├── components/            # Componentes específicos do app
├── contexts/              # React Contexts (auth)
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configurações
└── styles/                # CSS global
```

## 🔗 Integração com Auth (Micro Frontend)

O app integra com `bytebank-web-auth` via rewrites do Next.js:

```javascript
// next.config.mjs
async rewrites() {
  return [
    { source: '/auth/:path*', destination: `${AUTH_DOMAIN}/:path*` },
    { source: '/api/auth/:path*', destination: `${AUTH_DOMAIN}/api/auth/:path*` },
  ]
}
```

O middleware intercepta requisições e redireciona usuários não autenticados:

```
/home → (não logado) → /auth/login
/auth/login → (logado) → /home
```

## 🔐 Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
AUTH_DOMAIN=http://localhost:3001
```

## 📦 Dependências Internas

- `@fiap-tech-challenge/design-system` - Componentes UI
- `@fiap-tech-challenge/database` - Queries Supabase
- `@fiap-tech-challenge/models` - Tipos TypeScript
- `@fiap-tech-challenge/services` - Serviços HTTP/Storage
- `@fiap-tech-challenge/validation-schemas` - Schemas Zod
- `@fiap-tech-challenge/utils` - Funções utilitárias

## 🎨 Páginas Principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing page (público) |
| `/home` | Dashboard com saldo |
| `/dashboard` | Gráficos de performance |
| `/transaction` | Lista e gestão de transações |
| `/auth/*` | Proxy para app de auth |
