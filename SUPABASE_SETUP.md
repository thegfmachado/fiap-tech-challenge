# Configuração do Supabase

## 🚀 Setup Rápido (Desenvolvimento Local)

O projeto já vem pré-configurado para desenvolvimento local. Execute apenas:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar Supabase local
npm run db:local:start

# 3. Iniciar aplicações (em outro terminal)
npm run dev
```

✅ **Pronto!** As aplicações estarão rodando com banco local configurado.

## 📋 URLs e Credenciais Locais

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **API** | http://127.0.0.1:54321 | Já configurado nos `.env.local` |
| **Studio** | http://127.0.0.1:54323 | Interface web do banco |
| **DB Direct** | postgresql://postgres:postgres@127.0.0.1:54322/postgres | Conexão direta |

## 🏗️ Configuração Detalhada

### 1. Desenvolvimento Local (Recomendado)

O Supabase local roda em Docker e já vem com:
- ✅ Banco PostgreSQL configurado
- ✅ Tabela `transactions` criada com dados de exemplo
- ✅ Arquivos `.env.local` pré-configurados
- ✅ Studio web interface disponível

```bash
# Iniciar Supabase local
npm run db:local:start

# Verificar status
cd packages/database && npx supabase status

# Parar Supabase local
cd packages/database && npx supabase stop
```

### 2. Ambiente Online (Produção)

Para usar o Supabase na nuvem:

1. **Criar projeto:** Acesse [supabase.com](https://supabase.com)
2. **Configurar banco:** Execute o script `packages/database/setup.sql` no SQL Editor
3. **Atualizar variáveis:** Edite os arquivos `.env.local` com suas credenciais:

```bash
# apps/bytebank-web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]

# apps/bytebank-web-auth/.env.local  
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]
```

### 3. Esquema do Banco de Dados

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

**Dados de exemplo inclusos:**
- 2 transações de crédito (depósito, transferência recebida)
- 3 transações de débito (PIX, compra, pagamento)

## 🔧 Comandos Úteis

```bash
# Gerenciar Supabase local
npm run db:local:start     # Iniciar
cd packages/database && npx supabase stop      # Parar
cd packages/database && npx supabase status    # Status
cd packages/database && npx supabase db reset  # Reset completo

# Gerar tipos TypeScript do banco
cd packages/database && npm run db:generate:types

# Desenvolvimento
npm run dev                # Todas as apps
npm run build              # Build produção
```

## 🐛 Troubleshooting

**Supabase não inicia:**
```bash
# Verificar Docker
docker ps

# Limpar e reiniciar
cd packages/database && npx supabase stop
cd packages/database && npx supabase start
```

**Erro de conexão:**
- Verifique se o Docker está rodando
- Confirme se as portas 54321-54324 estão livres
- Acesse http://127.0.0.1:54323 para testar o Studio

**Aplicação não encontra banco:**
- Verifique os arquivos `.env.local`
- Reinicie a aplicação após alterar variáveis de ambiente
- Confirme se o Supabase está rodando: `npx supabase status`
