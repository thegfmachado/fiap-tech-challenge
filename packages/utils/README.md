# 🛠️ Utils

Funções utilitárias compartilhadas.

## 📦 Exports

```typescript
import { 
  formatCurrency,
  formatDate,
  // ... outras funções
} from '@fiap-tech-challenge/utils';
```

## 📋 Funções

### formatCurrency

Formata valores monetários em Real brasileiro:

```typescript
formatCurrency(1234.56); // "R$ 1.234,56"
formatCurrency(-500);    // "-R$ 500,00"
```

### formatDate

Formata datas no padrão brasileiro:

```typescript
formatDate('2024-01-15'); // "15/01/2024"
formatDate(new Date());   // "29/12/2024"
```

## 🎯 Por que um Package Separado?

- **DRY**: Não repetir formatação em cada app
- **Consistência**: Mesmo formato em todos os lugares
- **Testabilidade**: Funções puras, fáceis de testar
