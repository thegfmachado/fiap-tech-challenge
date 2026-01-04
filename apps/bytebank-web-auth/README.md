# 🔐 ByteBank Web Auth

Micro frontend de autenticação construído com **Next.js 15**. Responsável por login, cadastro e recuperação de senha.

## 📋 Visão Geral

App independente que gerencia toda a autenticação:
- Login com email/senha
- Cadastro de novos usuários
- Esqueci minha senha
- Redefinição de senha

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/bytebank-web-auth

# Ou inicie todos os apps
npm run dev
```

Acesse: [http://localhost:3001](http://localhost:3001)

> **Nota:** Em produção, este app é acessado via proxy do `bytebank-web` nas rotas `/auth/*`.

## 📁 Estrutura

```
bytebank-web-auth/
├── app/
│   ├── api/auth/           # API Routes de autenticação
│   │   ├── route.ts        # Login + Get user
│   │   ├── signup/         # Cadastro
│   │   ├── signout/        # Logout
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── login/              # Página de login
│   ├── signup/             # Página de cadastro
│   ├── forgot-password/    # Esqueci minha senha
│   └── reset-password/     # Redefinir senha
├── components/             # Componentes de formulário
└── lib/                    # Utilitários
```

## 🔗 Como Funciona o Micro Frontend

O `bytebank-web` faz proxy das requisições para este app:

```
Usuário acessa → localhost:3000/auth/login
                        ↓
               bytebank-web (rewrite)
                        ↓
               localhost:3001/login
```

### Asset Prefix

Para servir assets corretamente via proxy:

```javascript
// next.config.mjs
assetPrefix: '/bytebank-web-auth-static'
```

## 📡 API Routes

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth` | Login |
| GET | `/api/auth` | Obter usuário atual |
| POST | `/api/auth/signup` | Cadastro |
| POST | `/api/auth/signout` | Logout |
| POST | `/api/auth/forgot-password` | Enviar email de reset |
| POST | `/api/auth/reset-password` | Redefinir senha |

## 🔐 Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## 📦 Dependências Internas

- `@fiap-tech-challenge/design-system` - Componentes UI
- `@fiap-tech-challenge/database` - Cliente Supabase
- `@fiap-tech-challenge/validation-schemas` - Validação de forms

## 🎯 Por que um App Separado?

1. **Deploy independente**: Atualizar auth sem afetar o app principal
2. **Isolamento**: Código de autenticação não mistura com regras de negócio
3. **Segurança**: Superfície de ataque reduzida
4. **Escalabilidade**: Pode ter infraestrutura dedicada
