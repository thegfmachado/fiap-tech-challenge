# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais: URL e API Key

## 2. Configurar Banco de Dados

Execute o script SQL no painel do Supabase:

```sql
-- Criar tabela de transações
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Configurar Variáveis de Ambiente

### Para Desenvolvimento Local

Edite o arquivo `apps/bytebank-web/.env.local`:

```bash
# Supabase
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
```

### Para Docker/Produção

Edite o arquivo `.env` (na raiz do projeto):

```bash
# Supabase
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
```

## 4. Executar

```bash
npm run dev
```

---

**Dica**: Use Transaction Pooler (porta 6543) para melhor performance.
