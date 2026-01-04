# 🔌 Services

Serviços HTTP e storage compartilhados.

## 📦 Exports

```typescript
import { 
  httpService,      // Cliente HTTP
  storageService,   // Upload/download de arquivos
  attachmentService // Gerenciamento de anexos
} from '@fiap-tech-challenge/services';
```

## 📋 HTTP Service

Cliente HTTP com interceptors e tratamento de erros:

```typescript
// GET
const data = await httpService.get('/api/transactions');

// POST
const result = await httpService.post('/api/transactions', { 
  type: 'credit',
  amount: 100,
  description: 'Salário'
});

// PUT
await httpService.put(`/api/transactions/${id}`, data);

// DELETE
await httpService.delete(`/api/transactions/${id}`);
```

## 📋 Storage Service

Upload e download de arquivos no Supabase Storage:

```typescript
// Upload
const { path, publicUrl } = await storageService.upload(file, 'attachments');

// Download
const blob = await storageService.download(path);

// Delete
await storageService.delete(path);
```

## 🎯 Por que um Package Separado?

- **Reutilização**: Mesmo código no web e mobile
- **Abstração**: Encapsula lógica de HTTP/storage
- **Centralização**: Tratamento de erros em um lugar
