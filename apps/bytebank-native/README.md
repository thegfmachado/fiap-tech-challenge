# 📱 ByteBank Native

Aplicação mobile nativa construída com **React Native 0.79** e **Expo SDK 53**.

## 📋 Visão Geral

App mobile com paridade de funcionalidades do web:
- Autenticação (login/cadastro)
- Dashboard com gráficos
- Gestão de transações
- Upload de comprovantes

## 🚀 Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev --workspace apps/bytebank-native

# Ou inicie todos os apps
npm run dev
```

### Executar no Dispositivo

1. Instale o **Expo Go** (App Store / Google Play)
2. Escaneie o QR code do terminal

### Executar no Emulador

```bash
cd apps/bytebank-native

# iOS (requer macOS + Xcode)
npm run ios

# Android (requer Android Studio)
npm run android
```

### Executar no Navegador

Acesse: [http://localhost:8081](http://localhost:8081)

## 📁 Estrutura

```
bytebank-native/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx        # Layout raiz
│   ├── (auth)/            # Grupo de rotas de auth
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (tabs)/            # Grupo de rotas com tabs
│       ├── index.tsx      # Home
│       ├── dashboard.tsx
│       └── transaction.tsx
├── components/            # Componentes específicos
├── contexts/              # React Contexts
├── hooks/                 # Custom hooks
├── lib/                   # Supabase client
└── services/              # Serviços de API
```

## 🎨 Estilização

Usamos **NativeWind** (TailwindCSS para React Native):

```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-bold text-foreground">
    ByteBank
  </Text>
</View>
```

## 📊 Gráficos

Usamos **Victory Native** para gráficos no mobile (diferente do web que usa Recharts):

```tsx
import { VictoryChart, VictoryBar } from 'victory-native';
```

## 🔐 Autenticação

O auth usa Supabase diretamente com **AsyncStorage** para persistir sessão:

```typescript
// lib/supabase.ts
const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
```

## 🔐 Variáveis de Ambiente

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

> **Nota:** No mobile, use `EXPO_PUBLIC_` ao invés de `NEXT_PUBLIC_`.

## 📦 Dependências Internas

- `@fiap-tech-challenge/database` - Queries Supabase
- `@fiap-tech-challenge/models` - Tipos TypeScript
- `@fiap-tech-challenge/services` - Serviços HTTP
- `@fiap-tech-challenge/validation-schemas` - Schemas Zod
- `@fiap-tech-challenge/utils` - Funções utilitárias

## 🎯 Por que Expo?

1. **Setup simplificado**: Não precisa configurar Xcode/Android Studio inicialmente
2. **Expo Go**: Testar rapidamente em dispositivos físicos
3. **OTA Updates**: Atualizações sem passar pela App Store
4. **Compartilhamento de código**: Reutiliza packages do monorepo
