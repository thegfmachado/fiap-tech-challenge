# Configuração do Supabase

## 🚀 Setup Rápido (Desenvolvimento Local)

Para configurar o projeto em desenvolvimento local:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar Supabase local
npm run db:local:start

# 3. Criar arquivos .env.local (necessário na primeira vez)

# 4. Iniciar aplicações (em outro terminal)
npm run dev
```

## 📋 URLs e Credenciais Locais

| Serviço | URL | Observação |
|---------|-----|------------|
| **API** | <http://127.0.0.1:54321> | Configurar nos `.env.local` |
| **Studio** | <http://127.0.0.1:54323> | Interface web do banco |
| **DB Direct** | postgresql://postgres:postgres@127.0.0.1:54322/postgres | Conexão direta |

## 🔧 Configuração de Variáveis

### 1. Criar arquivos .env.local

As aplicações precisam dos arquivos `.env.local` configurados de acordo com o seu `.env.example`. Exemplo:

#### .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

> **💡 Nota:** Estes são os valores padrão do Supabase local. Use `npm run db:local:status` para verificar as credenciais atuais.

## 🏗️ Configuração Detalhada

### 2. Desenvolvimento Local (Recomendado)

O Supabase local roda em Docker e oferece:

- ✅ Banco PostgreSQL configurado automaticamente
- ✅ Tabela `transactions` criada com dados de exemplo
- ✅ Studio web interface disponível

```bash
# Iniciar Supabase local
npm run db:local:start

# Verificar status
npm run db:local:status

# Parar Supabase local
npm run db:local:stop
```

### 3. Ambiente Online (Produção)

Para usar o Supabase na nuvem:

1. **Criar projeto:** Acesse [supabase.com](https://supabase.com)
2. **Configurar banco:** Execute o script `packages/database/setup.sql` no SQL Editor
3. **Criar/atualizar variáveis:** Crie ou edite os arquivos `.env.local` com suas credenciais:

#### apps/bytebank-web & apps/bytebank-web-auth

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]
```

#### apps/bytebank-native/.env.local

```bash
EXPO_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]
```

### 4. Esquema do Banco de Dados

A tabela `transactions` é criada automaticamente com:

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

## 🔧 Comandos Úteis

```bash
# Gerenciar Supabase local
npm run db:local:start     # Iniciar
npm run db:local:stop      # Parar
npm run db:local:status    # Status
npm run db:local:reset     # Reset completo

# Gerar tipos TypeScript do banco
npm run db:generate:types
```

## 🐛 Troubleshooting

**Supabase não inicia:**

```bash
# Verificar Docker
docker ps

# Limpar e reiniciar
npm run db:local:stop
npm run db:local:start
```

**Erro de conexão:**

- Verifique se o Docker está rodando
- Confirme se as portas 54321-54324 estão livres
- Acesse <http://127.0.0.1:54323> para testar o Studio

**Aplicação não encontra banco:**

- **Verifique se os arquivos `.env.local` existem** (veja [Configuração de Variáveis](#-configuração-de-variáveis))
- Confirme se as credenciais estão corretas nos arquivos `.env.local`
- Reinicie a aplicação após criar/alterar variáveis de ambiente
- Confirme se o Supabase está rodando: `npm run db:local:status`
