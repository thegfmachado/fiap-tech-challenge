# 📝 Models

Tipos e interfaces TypeScript compartilhados entre os apps.

## 📦 Exports

```typescript
import { 
  ITransaction,
  IDashboardData,
  // ... outros tipos
} from '@fiap-tech-challenge/models';
```

## 📋 Tipos Principais

### ITransaction

```typescript
interface ITransaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
}
```

### IDashboardData

```typescript
interface IDashboardData {
  amount: { total: number; increasePercentage: string };
  expenses: { total: number; increasePercentage: string };
  income: { total: number; increasePercentage: string };
  incomeByRange: Array<{ period: string; income: number }>;
  amountAndExpensesByRange: Array<{ period: string; amount: number; expenses: number }>;
}
```

## 🎯 Por que um Package Separado?

- **Compartilhamento**: Mesmos tipos no web e mobile
- **Single Source of Truth**: Mudança em um lugar, atualiza todos
- **Type Safety**: TypeScript garante consistência
