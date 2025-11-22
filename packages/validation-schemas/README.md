# @fiap-tech-challenge/validation-schemas

Shared Zod validation schemas and helper functions for FIAP tech challenge applications.

## Usage

### Common Validations

Reusable field validations for common form inputs:

```ts
import { commonValidations } from '@fiap-tech-challenge/validation-schemas';

// Email validation
const emailField = commonValidations.email;

// Password validation (min 6 characters)
const passwordField = commonValidations.password;

// Required string with custom message
const nameField = commonValidations.requiredString('Nome é obrigatório');

// Positive number validation
const amountField = commonValidations.positiveNumber;
```

### Auth Schemas

Pre-built schemas for authentication forms. Signup and reset password schemas already include password confirmation validation:

```ts
import { 
  loginSchema, 
  signupSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '@fiap-tech-challenge/validation-schemas';

// Base login schema (can be extended)
const form = useForm({
  resolver: zodResolver(loginSchema.extend({
    rememberMe: z.boolean().optional(),
  })),
});

// Signup schema
const form = useForm({
  resolver: zodResolver(signupSchema),
});

// Reset password schema 
const form = useForm({
  resolver: zodResolver(resetPasswordSchema),
});
```

### Transaction Schema

Schema for transaction forms using the TransactionType enum:

```ts
import { transactionSchema } from '@fiap-tech-challenge/validation-schemas';

const form = useForm({
  resolver: zodResolver(transactionSchema),
});
```

### Helper Functions

#### `withPasswordConfirmation`

Adds password matching validation to schemas with `password` and `confirmPassword` fields. Note: `signupSchema` and `resetPasswordSchema` already include this validation. This helper is useful if you need to create custom schemas with password confirmation:

```ts
import { withPasswordConfirmation } from '@fiap-tech-challenge/validation-schemas';

// Example: Custom schema with password confirmation
const customPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});
const validatedSchema = withPasswordConfirmation(customPasswordSchema);
```

## Extending Schemas

Base schemas are designed to be extended for app-specific needs:

```ts
// Extend login schema with additional fields
const loginWithRememberMe = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});

// Extend transaction schema
const transactionWithNotes = transactionSchema.extend({
  notes: z.string().optional(),
});
```
