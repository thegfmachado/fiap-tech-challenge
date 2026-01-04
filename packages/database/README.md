# 🗄️ Database

Package de integração com **Supabase** (PostgreSQL + Auth + Storage).

## 📋 Visão Geral

Fornece cliente Supabase configurado e queries tipadas:
- Cliente para browser (client-side)
- Cliente para servidor (server-side com cookies)
- Queries de transações
- Tipos gerados do banco

## 📦 Exports

```typescript
import { 
  createClient,        // Cliente browser
  createServerClient,  // Cliente server (Next.js)
  queries,             // Queries tipadas
} from '@fiap-tech-challenge/database';
```

## 🚀 Setup do Supabase Local

### 1. Pré-requisitos

- **Docker** instalado e rodando
- **Supabase CLI** (instalado automaticamente via npm)

### 2. Iniciar

```bash
# Na raiz do monorepo
npm run db:local:start
```

Na primeira execução, será exibido:
- **API URL**: `http://127.0.0.1:54321`
- **Anon Key**: chave pública para usar nos apps
- **Studio URL**: `http://127.0.0.1:54323`

### 3. URLs e Credenciais Locais

| Serviço | URL | Observação |
|---------|-----|------------|
| **API** | `http://127.0.0.1:54321` | Configurar nos `.env.local` |
| **Studio** | `http://127.0.0.1:54323` | Interface web do banco |
| **DB Direct** | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Conexão direta |

### 4. Configurar Variáveis de Ambiente

Copie as chaves para os arquivos `.env.local` dos apps:

```bash
# apps/bytebank-web/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
AUTH_DOMAIN=http://localhost:3001

# apps/bytebank-web-auth/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# apps/bytebank-native/.env.local
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

> **💡 Nota:** Use `npm run db:local:status` para verificar as credenciais atuais.

### 5. Parar

```bash
npm run db:local:stop
```


## 📊 Schema do Banco

### Tabela: `transactions`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | TEXT | PK |
| `user_id` | UUID | FK para auth.users |
| `type` | VARCHAR(10) | `credit` ou `debit` |
| `value` | DECIMAL(10,2) | Valor da transação (> 0) |
| `description` | TEXT | Descrição |
| `date` | TIMESTAMPTZ | Data da transação |
| `attachment_url` | TEXT | URL do comprovante |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

### SQL de Criação

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL DEFAULT '',
  value DECIMAL(10,2) NOT NULL CHECK (value > 0),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

Cada usuário só vê suas próprias transações:

```sql
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);
```

## 📁 Estrutura

```
database/
├── src/
│   ├── client.ts         # Cliente browser
│   ├── server.ts         # Cliente server
│   ├── queries/          # Queries tipadas
│   └── types/            # Tipos gerados
├── setup.sql             # Schema inicial
└── supabase/             # Config Supabase CLI
```

## 🔧 Comandos

```bash
# Gerenciar Supabase local
npm run db:local:start     # Iniciar
npm run db:local:stop      # Parar
npm run db:local:status    # Ver status e credenciais
npm run db:local:reset     # Reset completo (⚠️ apaga dados!)

# Gerar tipos TypeScript do banco
npm run db:generate:types
```

## 🐛 Troubleshooting

<details>
<summary><b>Docker não está rodando</b></summary>

```bash
# Verificar Docker
docker info

# Se não estiver rodando, inicie o Docker Desktop
```

</details>

<details>
<summary><b>Supabase não inicia</b></summary>

```bash
# Verificar containers
docker ps

# Limpar e reiniciar
npm run db:local:stop
npm run db:local:start
```

</details>

<details>
<summary><b>Porta já em uso</b></summary>

```bash
# Verificar o que está na porta 54321
lsof -i :54321

# Confirme se as portas 54321-54324 estão livres
# Ou altere no supabase/config.toml
```

</details>

<details>
<summary><b>Erro de conexão no app</b></summary>

1. Verifique se o Supabase está rodando: `npm run db:local:status`
2. **Verifique se os arquivos `.env.local` existem** nos apps
3. Use `http://127.0.0.1:54321` ao invés de `localhost`
4. Reinicie a aplicação após criar/alterar variáveis de ambiente

</details>

<details>
<summary><b>Testar conexão manualmente</b></summary>

Acesse o Studio em `http://127.0.0.1:54323` para verificar se o banco está funcionando.

</details>

<details>
<summary><b>Resetar banco de dados</b></summary>

```bash
# ⚠️ Isso apaga todos os dados!
npm run db:local:reset
# ou
npx supabase db reset
```

</details>
