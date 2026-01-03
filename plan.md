# Expense Manager - Complete Implementation Plan

## Project Overview

Build a full-stack expense management application with:
- **Frontend**: Next.js 14+ (App Router) with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL hosted on Supabase
- **Authentication**: JWT-based custom auth

---

## Project Structure

```
Expense/                         # MAIN PROJECT FOLDER
├── expense-v1/                  # Next.js frontend (ALREADY EXISTS - enhance it)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── expenses/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── SummaryCards.tsx
│   │   │   │   ├── RecentExpenses.tsx
│   │   │   │   └── QuickAddExpense.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   └── ExpenseFilters.tsx
│   │   │   ├── categories/
│   │   │   │   ├── CategoryList.tsx
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   └── CategoryCard.tsx
│   │   │   └── charts/
│   │   │       ├── CategoryPieChart.tsx
│   │   │       ├── ExpenseTrendChart.tsx
│   │   │       └── MonthlyBarChart.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useExpenses.ts
│   │   │   └── useAnalytics.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                     # NestJS application (CREATE NEW)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   └── dto/
│   │   │       ├── signup.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── auth-response.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── dto/
│   │   │       ├── create-category.dto.ts
│   │   │       └── update-category.dto.ts
│   │   ├── expenses/
│   │   │   ├── expenses.module.ts
│   │   │   ├── expenses.controller.ts
│   │   │   ├── expenses.service.ts
│   │   │   └── dto/
│   │   │       ├── create-expense.dto.ts
│   │   │       ├── update-expense.dto.ts
│   │   │       └── filter-expense.dto.ts
│   │   └── analytics/
│   │       ├── analytics.module.ts
│   │       ├── analytics.controller.ts
│   │       └── analytics.service.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env
│
└── README.md
```

---

## PHASE 1: Backend Setup (NestJS)

### Step 1.1: Create NestJS Project

Navigate to the main Expense folder and create backend:

```bash
cd Expense
npm i -g @nestjs/cli
nest new backend --package-manager npm --skip-git
cd backend
```

> **Note:** The `backend` folder will be created as a sibling to `expense-v1` inside the `Expense` folder.

### Step 1.2: Install Backend Dependencies

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer prisma @prisma/client
npm install -D @types/passport-jwt @types/bcrypt
```

### Step 1.3: Initialize Prisma

```bash
npx prisma init
```

### Step 1.4: Create Prisma Schema

Create file: `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
  
  @@map("users")
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
  
  @@unique([userId, name])
  @@index([userId])
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

### Step 1.5: Create Environment File

Create file: `backend/.env`

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRATION="7d"
PORT=3001
```

### Step 1.6: Create Prisma Module

Create file: `backend/src/prisma/prisma.module.ts`

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Create file: `backend/src/prisma/prisma.service.ts`

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Step 1.7: Create Auth Module

Create file: `backend/src/auth/dto/signup.dto.ts`

```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
```

Create file: `backend/src/auth/dto/login.dto.ts`

```typescript
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

Create file: `backend/src/auth/dto/auth-response.dto.ts`

```typescript
export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
```

Create file: `backend/src/auth/strategies/jwt.strategy.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

Create file: `backend/src/auth/guards/jwt-auth.guard.ts`

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Create file: `backend/src/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Create file: `backend/src/auth/auth.service.ts`

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    // Generate token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }
}
```

Create file: `backend/src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string; username: string; email: string }) {
    return user;
  }
}
```

Create file: `backend/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Step 1.8: Create Users Module

Create file: `backend/src/users/dto/update-user.dto.ts`

```typescript
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;
}
```

Create file: `backend/src/users/users.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }
}
```

Create file: `backend/src/users/users.controller.ts`

```typescript
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
```

Create file: `backend/src/users/users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Step 1.9: Create Categories Module

Create file: `backend/src/categories/dto/create-category.dto.ts`

```typescript
import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}
```

Create file: `backend/src/categories/dto/update-category.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

Create file: `backend/src/categories/categories.service.ts`

```typescript
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id, userId);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id, userId);

    if (category._count.expenses > 0) {
      throw new BadRequestException('Cannot delete category with existing expenses');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
```

Create file: `backend/src/categories/categories.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.categoriesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.categoriesService.findOne(id, user.id);
  }

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.id, createCategoryDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, user.id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.categoriesService.remove(id, user.id);
  }
}
```

Create file: `backend/src/categories/categories.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

### Step 1.10: Create Expenses Module

Create file: `backend/src/expenses/dto/create-expense.dto.ts`

```typescript
import { IsString, IsNumber, IsOptional, IsDateString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsUUID()
  categoryId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}
```

Create file: `backend/src/expenses/dto/update-expense.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
```

Create file: `backend/src/expenses/dto/filter-expense.dto.ts`

```typescript
import { IsOptional, IsDateString, IsUUID } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
```

Create file: `backend/src/expenses/expenses.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: FilterExpenseDto) {
    const where: any = { userId };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        categoryId: createExpenseDto.categoryId,
        amount: createExpenseDto.amount,
        description: createExpenseDto.description,
        date: new Date(createExpenseDto.date),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    const data: any = { ...updateExpenseDto };
    if (updateExpenseDto.date) {
      data.date = new Date(updateExpenseDto.date);
    }

    return this.prisma.expense.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
```

Create file: `backend/src/expenses/expenses.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query() filters: FilterExpenseDto,
  ) {
    return this.expensesService.findAll(user.id, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.expensesService.findOne(id, user.id);
  }

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user.id, createExpenseDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, user.id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.expensesService.remove(id, user.id);
  }
}
```

Create file: `backend/src/expenses/expenses.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
```

### Step 1.11: Create Analytics Module

Create file: `backend/src/analytics/analytics.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getMonthlyAnalytics(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all expenses for the month
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Daily breakdown
    const dailyMap = new Map<string, number>();
    expenses.forEach((exp) => {
      const dateKey = exp.date.toISOString().split('T')[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + Number(exp.amount));
    });

    const dailyBreakdown = Array.from(dailyMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));

    // Category breakdown
    const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
    expenses.forEach((exp) => {
      const existing = categoryMap.get(exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        categoryMap.set(exp.categoryId, {
          name: exp.category.name,
          color: exp.category.color,
          amount: Number(exp.amount),
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([id, data]) => ({
      categoryId: id,
      categoryName: data.name,
      color: data.color,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }));

    return {
      year,
      month,
      total,
      expenseCount: expenses.length,
      dailyBreakdown,
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
    };
  }

  async getYearlyAnalytics(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Monthly breakdown
    const monthlyMap = new Map<number, number>();
    for (let i = 1; i <= 12; i++) {
      monthlyMap.set(i, 0);
    }
    expenses.forEach((exp) => {
      const month = exp.date.getMonth() + 1;
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(exp.amount));
    });

    const monthlyBreakdown = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      monthName: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' }),
      amount,
    }));

    // Category breakdown
    const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
    expenses.forEach((exp) => {
      const existing = categoryMap.get(exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        categoryMap.set(exp.categoryId, {
          name: exp.category.name,
          color: exp.category.color,
          amount: Number(exp.amount),
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([id, data]) => ({
      categoryId: id,
      categoryName: data.name,
      color: data.color,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }));

    return {
      year,
      total,
      expenseCount: expenses.length,
      monthlyBreakdown,
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
      averageMonthly: total / 12,
    };
  }

  async getDashboardSummary(userId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // This month
    const thisMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const thisMonthEnd = new Date(currentYear, currentMonth, 0);

    // Last month
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0);

    const [thisMonthExpenses, lastMonthExpenses, recentExpenses] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: thisMonthStart, lte: thisMonthEnd },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
      }),
    ]);

    const thisMonthTotal = Number(thisMonthExpenses._sum.amount) || 0;
    const lastMonthTotal = Number(lastMonthExpenses._sum.amount) || 0;

    return {
      thisMonth: {
        total: thisMonthTotal,
        count: thisMonthExpenses._count,
      },
      lastMonth: {
        total: lastMonthTotal,
      },
      comparison: {
        difference: thisMonthTotal - lastMonthTotal,
        percentageChange: lastMonthTotal > 0
          ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
          : 0,
      },
      recentExpenses,
    };
  }
}
```

Create file: `backend/src/analytics/analytics.controller.ts`

```typescript
import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('monthly')
  async getMonthlyAnalytics(
    @CurrentUser() user: { id: string },
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    @Query('month', new DefaultValuePipe(new Date().getMonth() + 1), ParseIntPipe) month: number,
  ) {
    return this.analyticsService.getMonthlyAnalytics(user.id, year, month);
  }

  @Get('yearly')
  async getYearlyAnalytics(
    @CurrentUser() user: { id: string },
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
  ) {
    return this.analyticsService.getYearlyAnalytics(user.id, year);
  }

  @Get('dashboard')
  async getDashboardSummary(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getDashboardSummary(user.id);
  }
}
```

Create file: `backend/src/analytics/analytics.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
```

### Step 1.12: Update App Module

Update file: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
```

### Step 1.13: Update Main.ts

Update file: `backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
```

### Step 1.14: Push Database Schema

```bash
cd backend
npx prisma db push
npx prisma generate
```

### Step 1.15: Test Backend

```bash
npm run start:dev
```

Test endpoints with curl or Postman:
- POST http://localhost:3001/api/auth/signup
- POST http://localhost:3001/api/auth/login
- GET http://localhost:3001/api/auth/me (with Authorization header)

---

## PHASE 2: Frontend Implementation (Next.js)

### Step 2.1: Install Frontend Dependencies

```bash
cd expense-v1
npm install axios recharts date-fns lucide-react
npm install -D @types/node
```

### Step 2.2: Create Types

Create file: `expense-v1/src/types/index.ts`

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  _count?: {
    expenses: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  };
  createdAt: string;
}

export interface DashboardSummary {
  thisMonth: {
    total: number;
    count: number;
  };
  lastMonth: {
    total: number;
  };
  comparison: {
    difference: number;
    percentageChange: number;
  };
  recentExpenses: Expense[];
}

export interface MonthlyAnalytics {
  year: number;
  month: number;
  total: number;
  expenseCount: number;
  dailyBreakdown: { date: string; amount: number }[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface YearlyAnalytics {
  year: number;
  total: number;
  expenseCount: number;
  monthlyBreakdown: { month: number; monthName: string; amount: number }[];
  categoryBreakdown: CategoryBreakdown[];
  averageMonthly: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}
```

### Step 2.3: Create API Client

Create file: `expense-v1/src/lib/api.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; color?: string; icon?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: { name?: string; color?: string; icon?: string }) =>
    api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Expenses API
export const expensesApi = {
  getAll: (params?: { startDate?: string; endDate?: string; categoryId?: string }) =>
    api.get('/expenses', { params }),
  getOne: (id: string) => api.get(`/expenses/${id}`),
  create: (data: { categoryId: string; amount: number; description?: string; date: string }) =>
    api.post('/expenses', data),
  update: (id: string, data: { categoryId?: string; amount?: number; description?: string; date?: string }) =>
    api.patch(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMonthly: (year: number, month: number) =>
    api.get('/analytics/monthly', { params: { year, month } }),
  getYearly: (year: number) =>
    api.get('/analytics/yearly', { params: { year } }),
};
```

### Step 2.4: Create Auth Context

Create file: `expense-v1/src/context/AuthContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authApi.me();
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { accessToken, user } = response.data as AuthResponse;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    router.push('/dashboard');
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await authApi.signup({ username, email, password });
    const { accessToken, user } = response.data as AuthResponse;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Step 2.5: Create Toast Context

Create file: `expense-v1/src/context/ToastContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
```

### Step 2.6: Create UI Components

Create file: `expense-v1/src/components/ui/Button.tsx`

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4\" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

Create file: `expense-v1/src/components/ui/Input.tsx`

```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

Create file: `expense-v1/src/components/ui/Card.tsx`

```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
```

Create file: `expense-v1/src/components/ui/Modal.tsx`

```typescript
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
```

Create file: `expense-v1/src/components/ui/Select.tsx`

```typescript
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

Create file: `expense-v1/src/components/ui/Spinner.tsx`

```typescript
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`}
      />
    </div>
  );
}
```

Create file: `expense-v1/src/components/ui/Toast.tsx`

```typescript
'use client';

import React from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-blue-600'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5" />}
          {toast.type === 'info' && <Info className="h-5 w-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Step 2.7: Create Layout Components

Create file: `expense-v1/src/components/layout/Sidebar.tsx`

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  LogOut,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">ExpenseTracker</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-2 mb-4">
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user?.username}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
```

Create file: `expense-v1/src/components/layout/Navbar.tsx`

```typescript
'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
        </div>
      </div>
    </header>
  );
}
```

### Step 2.8: Create Auth Pages

Create file: `expense-v1/src/app/(auth)/layout.tsx`

```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
```

Create file: `expense-v1/src/app/(auth)/login/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-100 rounded-xl mb-4">
            <Wallet className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
```

Create file: `expense-v1/src/app/(auth)/signup/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Wallet } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(username, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-100 rounded-xl mb-4">
            <Wallet className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-600 mt-2">Start tracking your expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
```

### Step 2.9: Create Dashboard Layout

Create file: `expense-v1/src/app/(dashboard)/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

### Step 2.10: Create Dashboard Page

Create file: `expense-v1/src/app/(dashboard)/dashboard/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { DashboardSummary } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ExpenseTrendChart } from '@/components/charts/ExpenseTrendChart';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsApi.getDashboard();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!summary) {
    return <div>Failed to load dashboard</div>;
  }

  const isPositiveChange = summary.comparison.difference <= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summary.thisMonth.total.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summary.lastMonth.total.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.thisMonth.count}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">vs Last Month</p>
                <p className={`text-2xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? '-' : '+'}${Math.abs(summary.comparison.difference).toFixed(2)}
                </p>
              </div>
              <div className={`p-3 ${isPositiveChange ? 'bg-green-100' : 'bg-red-100'} rounded-xl`}>
                {isPositiveChange ? (
                  <TrendingDown className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
        </CardHeader>
        <CardContent>
          {summary.recentExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {summary.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.description || expense.category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.category.name} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${Number(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 2.11: Create Categories Page

Create file: `expense-v1/src/app/(dashboard)/categories/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#6366f1' });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#6366f1' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
        showToast('Category updated successfully', 'success');
      } else {
        await categoriesApi.create(formData);
        showToast('Category created successfully', 'success');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesApi.delete(id);
      showToast('Category deleted successfully', 'success');
      loadCategories();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your expense categories</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category._count?.expenses || 0} expenses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No categories yet. Create your first category!</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Groceries"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
```

### Step 2.12: Create Expenses Page

Create file: `expense-v1/src/app/(dashboard)/expenses/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { expensesApi, categoriesApi } from '@/lib/api';
import { Expense, Category } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [filters]);

  const loadData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        expensesApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      const params: any = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.categoryId) params.categoryId = filters.categoryId;

      const response = await expensesApi.getAll(params);
      setExpenses(response.data);
    } catch (error) {
      showToast('Failed to load expenses', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      categoryId: expense.category.id,
      amount: String(expense.amount),
      description: expense.description || '',
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        date: formData.date,
      };

      if (editingExpense) {
        await expensesApi.update(editingExpense.id, data);
        showToast('Expense updated successfully', 'success');
      } else {
        await expensesApi.create(data);
        showToast('Expense created successfully', 'success');
      }
      setIsModalOpen(false);
      loadExpenses();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expensesApi.delete(id);
      showToast('Expense deleted successfully', 'success');
      loadExpenses();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
        <Button onClick={openCreateModal} disabled={categories.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-6">
            <p className="text-amber-600 text-center">
              Please create at least one category before adding expenses.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-40"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-40"
            />
            <Select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              className="w-40"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ startDate: '', endDate: '', categoryId: '' })}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
        <span className="text-indigo-900 font-medium">
          Total: {expenses.length} expenses
        </span>
        <span className="text-2xl font-bold text-indigo-600">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Expenses List */}
      <Card>
        <CardContent className="pt-6">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses found</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.description || expense.category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.category.name} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900 text-lg">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <Input
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What was this expense for?"
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingExpense ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
```

### Step 2.13: Create Analytics Page

Create file: `expense-v1/src/app/(dashboard)/analytics/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { MonthlyAnalytics, YearlyAnalytics } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ExpenseTrendChart } from '@/components/charts/ExpenseTrendChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewType = 'monthly' | 'yearly';

export default function AnalyticsPage() {
  const [view, setView] = useState<ViewType>('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [view, year, month]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (view === 'monthly') {
        const response = await analyticsApi.getMonthly(year, month);
        setMonthlyData(response.data);
      } else {
        const response = await analyticsApi.getYearly(year);
        setYearlyData(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (view === 'monthly') {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      setYear(year - 1);
    }
  };

  const handleNext = () => {
    if (view === 'monthly') {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      setYear(year + 1);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Insights into your spending patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setView('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={view === 'yearly' ? 'primary' : 'secondary'}
            onClick={() => setView('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold min-w-[200px] text-center">
              {view === 'monthly' ? `${monthName} ${year}` : year}
            </span>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : view === 'monthly' && monthlyData ? (
        <>
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${monthlyData.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {monthlyData.expenseCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(monthlyData.total / new Date(year, month, 0).getDate()).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Spending by Category</h2>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={monthlyData.categoryBreakdown} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Daily Spending</h2>
              </CardHeader>
              <CardContent>
                <ExpenseTrendChart data={monthlyData.dailyBreakdown} />
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown Table */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Category Breakdown</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.categoryBreakdown.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="flex-1 font-medium">{cat.categoryName}</span>
                    <span className="text-gray-600">{cat.percentage.toFixed(1)}%</span>
                    <span className="font-semibold w-24 text-right">
                      ${cat.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : yearlyData ? (
        <>
          {/* Yearly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${yearlyData.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {yearlyData.expenseCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Monthly Average</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${yearlyData.averageMonthly.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Spending by Category</h2>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={yearlyData.categoryBreakdown} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Monthly Spending</h2>
              </CardHeader>
              <CardContent>
                <MonthlyBarChart data={yearlyData.monthlyBreakdown} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
```

### Step 2.14: Create Chart Components

Create file: `expense-v1/src/components/charts/CategoryPieChart.tsx`

```typescript
'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryBreakdown } from '@/types';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.color,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Create file: `expense-v1/src/components/charts/ExpenseTrendChart.tsx`

```typescript
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ExpenseTrendChartProps {
  data: { date: string; amount: number }[];
}

export function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), 'MMM d'),
    amount: item.amount,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Create file: `expense-v1/src/components/charts/MonthlyBarChart.tsx`

```typescript
'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyBarChartProps {
  data: { month: number; monthName: string; amount: number }[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="monthName" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Step 2.15: Update Root Layout

Update file: `expense-v1/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage your expenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2.16: Update Home Page (Redirect)

Update file: `expense-v1/src/app/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
```

### Step 2.17: Create Environment File

Create file: `expense-v1/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## PHASE 3: Testing

### Step 3.1: Start Backend

```bash
cd backend
npm run start:dev
```

### Step 3.2: Start Frontend

```bash
cd expense-v1
npm run dev
```

### Step 3.3: Test Checklist

1. **Auth Flow**
   - [ ] Sign up with new account
   - [ ] Log out
   - [ ] Log in with created account
   - [ ] Verify protected routes redirect

2. **Categories**
   - [ ] Create a category
   - [ ] Edit a category
   - [ ] Delete an empty category
   - [ ] Try deleting category with expenses (should fail)

3. **Expenses**
   - [ ] Create an expense
   - [ ] Edit an expense
   - [ ] Delete an expense
   - [ ] Filter by date range
   - [ ] Filter by category

4. **Analytics**
   - [ ] View monthly analytics
   - [ ] View yearly analytics
   - [ ] Navigate between months/years
   - [ ] Verify charts render correctly

---

## PHASE 4: Deployment

### Step 4.1: Setup Supabase (Database)

1. Go to https://supabase.com and sign up
2. Create new project
3. Save the database password
4. Go to Settings > Database > Connection string
5. Copy the URI and update backend `.env`

### Step 4.2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Connect GitHub repository
3. Create new Web Service
4. Configure:
   - Name: expense-manager-api
   - Root Directory: backend
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Start Command: `npm run start:prod`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`
   - `FRONTEND_URL` (your Vercel URL)

### Step 4.3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Import GitHub repository
3. Configure:
   - Framework: Next.js
   - Root Directory: expense-v1
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your Render URL + /api)

### Step 4.4: Update CORS

Update backend CORS configuration in `main.ts` to include your Vercel domain.

---

## Summary

This plan covers:
- ✅ NestJS backend with authentication, CRUD operations, and analytics
- ✅ PostgreSQL database with Prisma ORM
- ✅ Next.js frontend with full UI components
- ✅ JWT-based authentication
- ✅ Charts and data visualization
- ✅ Deployment instructions for free hosting

Execute each phase in order. The backend should be completed and tested before moving to frontend integration.
