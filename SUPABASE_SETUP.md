# Configuração do Supabase

## 1. Criar Projeto no Supabase

### Para desenvolvimento local

1. Execute o script `npm run db:local:start` para instanciar o Supabase localmente
2. Acesse o Supabase local em http://localhost:54323
3. Anote as credenciais: URL e API Key

### Para ambiente online

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais: URL e API Key

## 2. Configurar Banco de Dados

Execute o script de [setup](./packages/database/setup.sql) do banco de dados no seu projeto Supabase.

## 3. Configurar Variáveis de Ambiente

### Para Desenvolvimento Local

Crie ou edite o arquivo `apps/bytebank-web/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
```

### Para Docker/Produção

Crie ou edite o arquivo `.env` (na raiz do projeto):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
```

**Nota:** Substitua `[PROJECT-ID]` e `[ANON-KEY]` pelos valores reais do seu projeto Supabase.

## 4. Executar

### Desenvolvimento Local

```bash
npm run dev
```

### Docker/Produção

```bash
npm run docker:build
npm run docker:up
```
