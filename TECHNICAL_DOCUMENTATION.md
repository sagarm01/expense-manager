# Expense Tracker - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Layer (Prisma + PostgreSQL)](#database-layer-prisma--postgresql)
4. [Authentication System](#authentication-system)
5. [API Authentication Flow](#api-authentication-flow)
6. [Database Connection (Supabase)](#database-connection-supabase)
7. [Bug Fixes & Solutions](#bug-fixes--solutions)
8. [API Endpoints](#api-endpoints)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
│                     Next.js 16 (App Router)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Login     │  │  Dashboard  │  │  Expenses   │  │  Analytics  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                            │                                             │
│                    Axios HTTP Client                                     │
│                    (with JWT interceptor)                                │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER                                      │
│                        NestJS Backend                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ AuthModule  │  │UsersModule  │  │CategoriesM. │  │ExpensesM.   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                            │                                             │
│                    Prisma ORM Client                                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ PostgreSQL Protocol
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE                                       │
│                   Supabase (PostgreSQL)                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │    users    │  │ categories  │  │  expenses   │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend (expense-v1/)
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| Recharts | Data visualization |
| React Context | State management (Auth, Toast) |

### Backend (backend/)
| Technology | Purpose |
|------------|---------|
| NestJS | Node.js framework |
| TypeScript | Type safety |
| Prisma | ORM for database |
| Passport.js | Authentication middleware |
| JWT | Token-based authentication |
| bcrypt | Password hashing |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database |
| Supabase | Hosted PostgreSQL with connection pooling |
| PgBouncer | Connection pooler (managed by Supabase) |

---

## Database Layer (Prisma + PostgreSQL)

### How Prisma Works

Prisma is an ORM (Object-Relational Mapping) that provides:
1. **Type-safe database client** - Auto-generated TypeScript types
2. **Schema-first approach** - Define models in `schema.prisma`
3. **Migration system** - Track and apply database changes
4. **Query builder** - Intuitive API for database operations

### Schema Definition (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled connection (PgBouncer)
  directUrl = env("DIRECT_URL")        // Direct connection (for migrations)
}

model User {
  id           String     @id @default(uuid())
  username     String     @unique @db.VarChar(50)
  email        String     @unique @db.VarChar(255)
  passwordHash String     @map("password_hash") @db.VarChar(255)
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")

  categories   Category[]
  expenses     Expense[]

  @@map("users")  // Maps to "users" table in PostgreSQL
}

model Category {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  name      String    @db.VarChar(100)
  color     String    @default("#6366f1") @db.VarChar(7)
  icon      String?   @db.VarChar(50)
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses  Expense[]

  @@unique([userId, name])  // Composite unique constraint
  @@index([userId])         // Index for faster queries
  @@map("categories")
}

model Expense {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  categoryId  String   @map("category_id")
  amount      Decimal  @db.Decimal(12, 2)
  description String?  @db.Text
  date        DateTime @db.Date
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([userId, date(sort: Desc)])
  @@index([categoryId])
  @@map("expenses")
}
```

### Prisma Client Usage

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();  // Connect when module initializes
  }

  async onModuleDestroy() {
    await this.$disconnect();  // Disconnect when app shuts down
  }
}
```

### Common Prisma Operations

```typescript
// CREATE
const user = await prisma.user.create({
  data: { username, email, passwordHash }
});

// READ (with relations)
const expenses = await prisma.expense.findMany({
  where: { userId },
  include: { category: true },
  orderBy: { date: 'desc' }
});

// UPDATE
const updated = await prisma.category.update({
  where: { id },
  data: { name, color }
});

// DELETE
await prisma.expense.delete({ where: { id } });

// AGGREGATE
const total = await prisma.expense.aggregate({
  where: { userId },
  _sum: { amount: true }
});
```

---

## Authentication System

### Overview

The application uses **JWT (JSON Web Token)** based authentication:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Client     │      │   Server     │      │   Database   │
│  (Browser)   │      │  (NestJS)    │      │ (PostgreSQL) │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │  1. POST /auth/signup                     │
       │  {email, password}  │                     │
       │────────────────────>│                     │
       │                     │  2. Hash password   │
       │                     │  (bcrypt)           │
       │                     │                     │
       │                     │  3. Store user      │
       │                     │────────────────────>│
       │                     │                     │
       │                     │  4. Generate JWT    │
       │                     │                     │
       │  5. Return token    │                     │
       │<────────────────────│                     │
       │                     │                     │
       │  6. Store token     │                     │
       │  (localStorage)     │                     │
       │                     │                     │
       │  7. GET /expenses   │                     │
       │  Authorization:     │                     │
       │  Bearer <token>     │                     │
       │────────────────────>│                     │
       │                     │  8. Verify JWT      │
       │                     │  Extract userId     │
       │                     │                     │
       │                     │  9. Query database  │
       │                     │────────────────────>│
       │                     │                     │
       │  10. Return data    │<────────────────────│
       │<────────────────────│                     │
```

### Backend Authentication Components

#### 1. Auth Service (auth/auth.service.ts)

```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // 1. Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existingUser) throw new ConflictException('User already exists');

    // 2. Hash password with bcrypt (10 salt rounds)
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3. Create user in database
    const user = await this.prisma.user.create({
      data: { username: dto.username, email: dto.email, passwordHash },
    });

    // 4. Generate JWT token
    const token = this.generateToken(user.id);

    return { accessToken: token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate JWT token
    const token = this.generateToken(user.id);

    return { accessToken: token, user: { id: user.id, username: user.username, email: user.email } };
  }

  private generateToken(userId: string): string {
    // JWT payload contains user ID
    return this.jwtService.sign({ sub: userId });
  }
}
```

#### 2. JWT Strategy (auth/strategies/jwt.strategy.ts)

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract from "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Called after JWT is verified
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return user;  // Attached to request.user
  }
}
```

#### 3. JWT Auth Guard (auth/guards/jwt-auth.guard.ts)

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Usage in controllers:
@Controller('expenses')
@UseGuards(JwtAuthGuard)  // Protects all routes in this controller
export class ExpensesController {
  @Get()
  findAll(@CurrentUser() user: User) {  // user is injected from JWT
    return this.expensesService.findAll(user.id);
  }
}
```

#### 4. Current User Decorator (auth/decorators/current-user.decorator.ts)

```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;  // Returns user attached by JwtStrategy
  },
);
```

### Frontend Authentication

#### Auth Context (context/AuthContext.tsx)

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await authApi.me();  // Verify token with backend
      setUser(response.data);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);  // Store token
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };
}
```

#### Axios Interceptor (lib/api.ts)

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor - adds JWT to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### JWT Token Structure

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    // Header (algorithm, type)
eyJzdWIiOiJ1c2VyLWlkLTEyMyIsImlhdCI6MTY...  // Payload (sub=userId, iat, exp)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  // Signature (HMAC-SHA256)
```

**Payload contents:**
- `sub`: User ID (subject)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (7 days from issue)

---

## Database Connection (Supabase)

### Connection Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                          │
│  ┌───────────────────┐      ┌──────────────────────────┐   │
│  │    PgBouncer      │      │     PostgreSQL           │   │
│  │  (Port 6543)      │      │     (Port 5432)          │   │
│  │                   │      │                          │   │
│  │  - Connection     │      │  - Actual database       │   │
│  │    pooling        │─────>│  - Direct connections    │   │
│  │  - Transaction    │      │  - Supports prepared     │   │
│  │    mode           │      │    statements            │   │
│  └───────────────────┘      └──────────────────────────┘   │
│           ▲                            ▲                    │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
     DATABASE_URL                   DIRECT_URL
     (Runtime queries)              (Migrations)
```

### Environment Variables (.env)

```bash
# Pooled connection via PgBouncer (for application queries)
# Port 6543 = PgBouncer pooler
# ?pgbouncer=true = Disables prepared statements
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations and schema changes)
# Port 5432 = Direct PostgreSQL connection
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### Why Two URLs?

| Feature | DATABASE_URL (Pooled) | DIRECT_URL (Direct) |
|---------|----------------------|---------------------|
| Port | 6543 | 5432 |
| Connection type | Via PgBouncer | Direct to PostgreSQL |
| Connection limit | Shared pool (~100+) | Limited (~10-20) |
| Use case | Application queries | Migrations, schema changes |
| Prepared statements | Disabled (pgbouncer=true) | Supported |

---

## Bug Fixes & Solutions

### Bug #1: Prisma Config Blocking Environment Variables

**Symptom:**
```
Prisma config detected, skipping environment variable loading
```

**Cause:** A `prisma.config.ts` file existed in the project, which caused Prisma to skip loading `.env` files.

**Solution:** Delete the `prisma.config.ts` file.

---

### Bug #2: Database Connection Hanging (Password with Special Characters)

**Symptom:** `npx prisma db push` hangs indefinitely with no error message.

**Cause:** The database password contained `@` symbol which is a reserved character in URLs.

**Original:**
```
postgresql://postgres:kunalbsdk@321@supabase.com:6543/postgres
                              ↑
                     Interpreted as URL separator
```

**Solution:** URL-encode special characters (`@` becomes `%40`):
```
postgresql://postgres:kunalbsdk%40321@supabase.com:6543/postgres
```

**Common URL Encodings:**
| Character | Encoded |
|-----------|---------|
| @ | %40 |
| # | %23 |
| $ | %24 |
| & | %26 |
| + | %2B |
| / | %2F |
| : | %3A |
| = | %3D |
| ? | %3F |

---

### Bug #3: JWT ExpiresIn Type Error

**Symptom:**
```
Type 'string' is not assignable to type 'number | StringValue'
```

**Cause:** NestJS JWT module expects a specific type for `expiresIn`, not a generic string from `ConfigService.get<string>()`.

**Original code:**
```typescript
signOptions: {
  expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
}
```

**Solution:** Use a constant assertion:
```typescript
signOptions: {
  expiresIn: '7d' as const,
}
```

---

### Bug #4: Analytics 500 Internal Server Error

**Symptom:** `/api/analytics/dashboard` returns 500 error.

**Cause:** Incorrect usage of Prisma's `aggregate` with `_count`.

**Original code:**
```typescript
const result = await this.prisma.expense.aggregate({
  where: { userId },
  _sum: { amount: true },
  _count: true,  // This doesn't work as expected
});
```

**Solution:** Use separate `count()` query:
```typescript
const [aggregateResult, countResult] = await Promise.all([
  this.prisma.expense.aggregate({
    where: { userId },
    _sum: { amount: true },
  }),
  this.prisma.expense.count({
    where: { userId },
  }),
]);
```

---

### Bug #5: Prepared Statement Does Not Exist

**Symptom:**
```
PostgresError { code: "26000", message: "prepared statement \"s14\" does not exist" }
```

**Cause:** Supabase uses PgBouncer in transaction mode, which doesn't support prepared statements. Prisma uses prepared statements by default.

**Solution:** Add `?pgbouncer=true` to DATABASE_URL:
```bash
# Before
DATABASE_URL="postgresql://...@pooler.supabase.com:6543/postgres"

# After
DATABASE_URL="postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true"
```

This tells Prisma to disable prepared statements when using the pooled connection.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/me | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/users/profile | Get user profile | Yes |
| PATCH | /api/users/profile | Update profile | Yes |
| DELETE | /api/users/profile | Delete account | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/categories | List all categories | Yes |
| POST | /api/categories | Create category | Yes |
| PATCH | /api/categories/:id | Update category | Yes |
| DELETE | /api/categories/:id | Delete category | Yes |

### Expenses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/expenses | List expenses (with filters) | Yes |
| POST | /api/expenses | Create expense | Yes |
| GET | /api/expenses/:id | Get single expense | Yes |
| PATCH | /api/expenses/:id | Update expense | Yes |
| DELETE | /api/expenses/:id | Delete expense | Yes |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/analytics/dashboard | Dashboard summary | Yes |
| GET | /api/analytics/monthly?year=&month= | Monthly breakdown | Yes |
| GET | /api/analytics/yearly?year= | Yearly breakdown | Yes |

---

## Running the Application

### Backend
```bash
cd backend
npm install
npx prisma generate    # Generate Prisma client
npx prisma db push     # Sync schema to database
npm run start:dev      # Start in development mode
```

### Frontend
```bash
cd expense-v1
npm install
npm run dev            # Start Next.js dev server
```

### Environment Setup

**Backend (.env):**
```bash
DATABASE_URL="postgresql://...?pgbouncer=true"
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Security Considerations

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Expiration**: 7 days (configurable)
3. **CORS**: Restricted to frontend URL
4. **SQL Injection**: Prevented by Prisma's parameterized queries
5. **User Isolation**: All queries filtered by `userId` from JWT
6. **Cascade Deletes**: User deletion removes all related data
