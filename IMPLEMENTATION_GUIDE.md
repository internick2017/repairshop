# 🚀 Implementation Guide & Best Practices - Francisco Computer Repair Shop

## 📋 Implementation Overview

Comprehensive implementation guide for developing, deploying, and maintaining the Computer Repair Shop management system. This guide covers development workflows, coding standards, testing strategies, and deployment procedures.

### 🎯 Implementation Goals
- **Rapid Development**: Efficient development workflows and tooling
- **Code Quality**: Consistent standards and automated quality checks
- **Performance**: Optimized for speed and scalability
- **Maintainability**: Clear structure and comprehensive documentation
- **Reliability**: Robust testing and error handling

---

## 🏗️ Development Environment Setup

### **Prerequisites Installation**
```bash
# Install Node.js (v18 or higher)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install Yarn globally
npm install -g yarn

# Install development tools
npm install -g @vercel/cli
npm install -g drizzle-kit
npm install -g tsx
```

### **Project Setup**
```bash
# Clone repository
git clone <repository-url>
cd repairshop

# Install dependencies
yarn install

# Environment configuration
cp .env.example .env.local

# Database setup
yarn db:generate
yarn db:migrate
yarn db:seed

# Start development server
yarn dev
```

### **Environment Configuration**
```env
# .env.local template
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/repairshop"

# Authentication (Kinde)
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="https://yourdomain.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"

# Monitoring (Sentry)
SENTRY_DSN="your_sentry_dsn"
SENTRY_ORG="your_org"
SENTRY_PROJECT="your_project"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_REALTIME="true"

# Security
ENCRYPTION_KEY="your_32_character_encryption_key"
SESSION_SECRET="your_session_secret_key"
```

---

## 💻 Development Workflow

### **Git Workflow Standards**
```mermaid
gitGraph
    commit id: "Initial"
    branch feature/new-feature
    checkout feature/new-feature
    commit id: "Feature work"
    commit id: "Tests added"
    commit id: "Documentation"
    checkout main
    merge feature/new-feature
    commit id: "Release prep"
    branch release/v1.1.0
    checkout release/v1.1.0
    commit id: "Version bump"
    commit id: "Final testing"
    checkout main
    merge release/v1.1.0
    commit id: "v1.1.0 Release"
```

#### **Branch Naming Conventions**
```bash
# Feature development
feature/user-management
feature/ticket-search
feature/email-notifications

# Bug fixes
fix/customer-form-validation
fix/pagination-error
fix/memory-leak

# Hotfixes
hotfix/security-patch
hotfix/critical-bug

# Releases
release/v1.1.0
release/v2.0.0-beta

# Documentation
docs/api-documentation
docs/user-guide
```

#### **Commit Message Standards**
```bash
# Format: <type>(<scope>): <subject>
# 
# <body>
#
# <footer>

# Examples:
feat(customer): add customer search functionality

- Implement full-text search across customer fields
- Add search filters for active/inactive customers
- Include pagination support for search results

Closes #123

fix(ticket): resolve ticket assignment bug

- Fix issue where tickets were not properly assigned
- Add validation for technician availability
- Update tests for assignment logic

Fixes #456

docs(api): update API documentation

- Add examples for all endpoints
- Document error responses
- Include rate limiting information
```

### **Code Review Process**
```markdown
## Pull Request Checklist

### Code Quality
- [ ] Code follows project style guidelines
- [ ] No console.log statements in production code
- [ ] All TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

### Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases considered

### Documentation
- [ ] Code is self-documenting with clear variable names
- [ ] Complex logic has explanatory comments
- [ ] API changes documented
- [ ] README updated if necessary

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Authentication/authorization checks in place
- [ ] SQL injection prevention measures

### Performance
- [ ] Database queries optimized
- [ ] Unnecessary re-renders avoided
- [ ] Bundle size impact considered
- [ ] Caching strategies implemented where appropriate
```

---

## 🧪 Testing Strategy

### **Testing Pyramid**
```mermaid
graph TB
    subgraph "Testing Pyramid"
        A[E2E Tests<br/>10%<br/>Integration & User Flows]
        B[Integration Tests<br/>20%<br/>API & Database]
        C[Unit Tests<br/>70%<br/>Components & Functions]
    end
    
    A --> B
    B --> C
    
    subgraph "Testing Tools"
        D[Playwright<br/>End-to-End Testing]
        E[Vitest<br/>Unit Testing]
        F[Testing Library<br/>React Testing]
    end
    
    A --> D
    B --> E
    C --> F
```

### **Unit Testing Setup**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### **Component Testing Example**
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

### **API Testing Strategy**
```typescript
// src/lib/__tests__/api.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createCustomer, updateCustomer } from '../actions/customer-actions';
import { db } from '../db';
import { customers } from '../db/schema';

describe('Customer API Actions', () => {
  beforeEach(async () => {
    // Setup test database state
    await db.delete(customers).where(eq(customers.email, 'test@example.com'));
  });

  afterEach(async () => {
    // Cleanup test data
    await db.delete(customers).where(eq(customers.email, 'test@example.com'));
  });

  describe('createCustomer', () => {
    it('creates a new customer successfully', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '555-0123',
        address1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '90210',
        country: 'US',
      };

      const result = await createCustomer(customerData);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      });
    });

    it('handles duplicate email validation', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '555-0123',
        address1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '90210',
        country: 'US',
      };

      // Create first customer
      await createCustomer(customerData);

      // Attempt to create duplicate
      const result = await createCustomer(customerData);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('DUPLICATE_EMAIL');
    });
  });
});
```

### **E2E Testing Setup**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### **E2E Test Example**
```typescript
// e2e/customer-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new customer', async ({ page }) => {
    await page.goto('/customers');
    await page.click('[data-testid=add-customer-button]');

    // Fill out customer form
    await page.fill('[data-testid=first-name]', 'John');
    await page.fill('[data-testid=last-name]', 'Doe');
    await page.fill('[data-testid=email]', 'john.doe@example.com');
    await page.fill('[data-testid=phone]', '555-0123');
    await page.fill('[data-testid=address]', '123 Main St');
    await page.fill('[data-testid=city]', 'Anytown');
    await page.selectOption('[data-testid=state]', 'CA');
    await page.fill('[data-testid=zip]', '90210');

    await page.click('[data-testid=submit-button]');

    // Verify success
    await expect(page.locator('[data-testid=success-message]')).toBeVisible();
    await expect(page).toHaveURL('/customers');
    
    // Verify customer appears in list
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should search for customers', async ({ page }) => {
    await page.goto('/customers');
    
    // Perform search
    await page.fill('[data-testid=search-input]', 'john');
    await page.press('[data-testid=search-input]', 'Enter');

    // Wait for search results
    await page.waitForSelector('[data-testid=customer-row]');
    
    // Verify search results
    const customerRows = page.locator('[data-testid=customer-row]');
    await expect(customerRows).toHaveCount(1);
    await expect(customerRows.first()).toContainText('John');
  });
});
```

---

## 🔧 Code Quality Standards

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    // Strict type checking options
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### **ESLint Configuration**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    
    // Import rules
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    
    // General rules
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### **Prettier Configuration**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### **Code Style Guidelines**

#### **Component Structure**
```typescript
// ✅ Good: Clear component structure
interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function CustomerForm({ 
  customer, 
  onSubmit, 
  onCancel, 
  loading = false 
}: CustomerFormProps) {
  // Hooks at the top
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || defaultCustomerValues,
  });

  // Event handlers
  const handleSubmit = useCallback(async (data: CustomerFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  }, [onSubmit]);

  // Early returns for loading states
  if (loading) {
    return <FormSkeleton />;
  }

  // Main render
  return (
    <FormWrapper title="Customer Information">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Form content */}
        </form>
      </Form>
    </FormWrapper>
  );
}
```

#### **Error Handling Patterns**
```typescript
// ✅ Good: Comprehensive error handling
async function createCustomer(data: CustomerFormData): Promise<ActionResult<Customer>> {
  try {
    // Validate input
    const validatedData = customerSchema.parse(data);
    
    // Check for duplicates
    const existingCustomer = await findCustomerByEmail(validatedData.email);
    if (existingCustomer) {
      return {
        success: false,
        error: {
          message: 'Customer with this email already exists',
          code: 'DUPLICATE_EMAIL',
          field: 'email',
        },
      };
    }
    
    // Create customer
    const customer = await db.insert(customers).values(validatedData).returning();
    
    return {
      success: true,
      data: customer[0],
    };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        validationErrors: formatZodErrors(error),
      };
    }
    
    // Log unexpected errors
    console.error('Customer creation failed:', error);
    Sentry.captureException(error, {
      tags: { action: 'createCustomer' },
      extra: { data: sanitizeForLogging(data) },
    });
    
    return {
      success: false,
      error: {
        message: 'Failed to create customer',
        code: 'INTERNAL_ERROR',
      },
    };
  }
}
```

---

## 🚀 Deployment Strategy

### **CI/CD Pipeline**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: repairshop_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run type checking
        run: yarn typecheck
      
      - name: Run linting
        run: yarn lint
      
      - name: Run unit tests
        run: yarn test:run
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/repairshop_test
      
      - name: Run E2E tests
        run: yarn playwright test
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/repairshop_test
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build application
        run: yarn build
        env:
          SKIP_ENV_VALIDATION: true
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: .next/

  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### **Environment-Specific Configurations**

#### **Development Environment**
```typescript
// config/development.ts
export const developmentConfig = {
  database: {
    logging: true,
    maxConnections: 5,
  },
  auth: {
    redirectUrl: 'http://localhost:3000',
  },
  monitoring: {
    enableSentry: false,
    logLevel: 'debug',
  },
  features: {
    enableAnalytics: false,
    enableRealtime: true,
  },
};
```

#### **Production Environment**
```typescript
// config/production.ts
export const productionConfig = {
  database: {
    logging: false,
    maxConnections: 20,
    ssl: true,
  },
  auth: {
    redirectUrl: 'https://repairshop.example.com',
  },
  monitoring: {
    enableSentry: true,
    logLevel: 'error',
  },
  features: {
    enableAnalytics: true,
    enableRealtime: true,
  },
  security: {
    enableCSP: true,
    enableHSTS: true,
  },
};
```

### **Database Migration Strategy**
```typescript
// scripts/migrate.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../src/lib/db';

async function runMigrations() {
  console.log('Starting database migrations...');
  
  try {
    await migrate(db, { 
      migrationsFolder: './drizzle',
      migrationsTable: 'migrations',
    });
    
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
```

---

## 📊 Performance Optimization

### **Bundle Analysis**
```bash
# Analyze bundle size
yarn build:analyze

# Check for duplicate dependencies
yarn dlx bundle-analyzer .next/static/chunks/*.js
```

### **Performance Monitoring**
```typescript
// lib/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    
    try {
      const result = await fn();
      const end = performance.now();
      const duration = end - start;
      
      // Log performance metrics
      console.log(`${name} took ${duration.toFixed(2)}ms`);
      
      // Send to monitoring service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(duration),
        });
      }
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Usage example
export async function getCustomers() {
  return measurePerformance('getCustomers', async () => {
    return await db.select().from(customers).limit(100);
  });
}
```

### **Caching Strategy**
```typescript
// lib/cache.ts
interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
}

class ApplicationCache {
  private cache = new Map<string, { data: any; expires: number }>();
  
  async get<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options: CacheOptions
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    // Return cached data if still valid
    if (cached && now < cached.expires) {
      return cached.data;
    }
    
    // Handle stale-while-revalidate
    if (cached && options.staleWhileRevalidate) {
      // Return stale data immediately
      const staleData = cached.data;
      
      // Revalidate in background
      this.revalidate(key, fetcher, options);
      
      return staleData;
    }
    
    // Fetch fresh data
    const data = await fetcher();
    this.set(key, data, options.ttl);
    
    return data;
  }
  
  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data, options.ttl);
    } catch (error) {
      console.error('Cache revalidation failed:', error);
    }
  }
  
  private set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }
  
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const appCache = new ApplicationCache();
```

---

## 🔒 Security Best Practices

### **Input Validation**
```typescript
// lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// Validate and sanitize form data
export function createSecureValidator<T>(schema: z.ZodSchema<T>) {
  return function validateAndSanitize(input: unknown): T {
    // Parse with Zod
    const parsed = schema.parse(input);
    
    // Sanitize string fields
    const sanitized = Object.entries(parsed as Record<string, any>).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = sanitizeHtml(value);
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );
    
    return sanitized as T;
  };
}
```

### **Authentication Middleware**
```typescript
// middleware.ts
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req: NextRequest) {
    // Security headers
    const response = NextResponse.next();
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customers/:path*',
    '/tickets/:path*',
    '/users/:path*',
  ],
};
```

---

## 📈 Monitoring & Analytics

### **Error Tracking Setup**
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export function initializeMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof TypeError && error.message.includes('ResizeObserver')) {
          return null; // Ignore ResizeObserver errors
        }
      }
      
      return event;
    },
    
    // User context
    initialScope: {
      tags: {
        component: 'repairshop',
      },
    },
  });
}

// Custom error boundary
export function captureError(error: Error, context: Record<string, any> = {}) {
  Sentry.withScope(scope => {
    scope.setContext('errorContext', context);
    Sentry.captureException(error);
  });
}
```

### **Performance Metrics**
```typescript
// lib/analytics.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  
  track(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
    };
    
    this.events.push(event);
    
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, properties);
    }
    
    // Batch send events
    if (this.events.length >= 10) {
      this.flush();
    }
  }
  
  private async flush() {
    if (this.events.length === 0) return;
    
    const events = [...this.events];
    this.events = [];
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Analytics flush failed:', error);
      // Re-add events to queue
      this.events.unshift(...events);
    }
  }
}

export const analytics = new Analytics();

// Usage examples
export function trackCustomerCreated(customerId: number) {
  analytics.track('customer_created', { customerId });
}

export function trackTicketStatusChanged(ticketId: number, status: string) {
  analytics.track('ticket_status_changed', { ticketId, status });
}
```

---

*This implementation guide provides comprehensive guidelines for developing, testing, and deploying the Francisco Computer Repair Shop application. Regular updates ensure best practices remain current with evolving technologies and requirements.*