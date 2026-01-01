# 🎨 Design System

Biblioteca de componentes UI reutilizáveis, documentada com **Storybook 8.6**.

## 📋 Visão Geral

Design System compartilhado entre os apps web do ByteBank:
- 21+ componentes baseados em **Radix UI**
- Estilização com **TailwindCSS** e **CVA**
- Ícones via **Lucide React**
- Documentação interativa no Storybook

## 🚀 Desenvolvimento

```bash
# Iniciar Storybook
npm run dev --workspace packages/design-system
```

Acesse: [http://localhost:9009](http://localhost:9009)

## 📦 Componentes

| Componente | Descrição |
|------------|-----------|
| `Button` | Botões com variantes (default, outline, ghost, etc.) |
| `Card` | Container com header, content e footer |
| `Dialog` | Modais e diálogos |
| `Form` | Wrapper para React Hook Form |
| `Input` | Campos de texto |
| `Select` | Dropdowns |
| `Tabs` | Navegação em abas |
| `Calendar` | Calendário |
| `DatePicker` | Seletor de data |
| `Table` | Tabelas de dados |
| `Toast` | Notificações |
| `Skeleton` | Loading placeholders |
| `Avatar` | Imagens de perfil |
| `Badge` | Tags e labels |
| `Dropdown` | Menus contextuais |
| `Popover` | Popovers |
| `Separator` | Divisores |
| `Label` | Labels de formulário |
| `Sidebar` | Navegação lateral |
| `Sonner` | Toast provider |
| `VisuallyHidden` | Acessibilidade |

## 🎯 Uso

```tsx
import { Button, Card, Input } from '@fiap-tech-challenge/design-system';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Digite algo" />
      <Button variant="default">Enviar</Button>
    </Card>
  );
}
```

## 🛠️ Stack

- **Radix UI**: Primitivos acessíveis
- **TailwindCSS**: Utilitários de estilo
- **CVA (Class Variance Authority)**: Variantes de componentes
- **Lucide React**: Ícones
- **Storybook**: Documentação

## 📁 Estrutura

```
design-system/
├── src/
│   ├── components/        # Componentes UI
│   │   ├── button/
│   │   │   ├── index.tsx
│   │   │   └── button.stories.tsx
│   │   ├── card/
│   │   └── ...
│   ├── lib/              # Utilitários (cn, etc.)
│   └── index.ts          # Exports
├── .storybook/           # Configuração Storybook
└── tailwind.config.js
```

## 🎨 Criando um Novo Componente

1. Crie a pasta em `src/components/novo-componente/`
2. Implemente o componente em `index.tsx`
3. Crie stories em `novo-componente.stories.tsx`
4. Exporte em `src/components/index.ts`

```tsx
// src/components/novo-componente/index.tsx
import { cn } from '../../lib/utils';

export interface NovoComponenteProps {
  children: React.ReactNode;
  className?: string;
}

export function NovoComponente({ children, className }: NovoComponenteProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

