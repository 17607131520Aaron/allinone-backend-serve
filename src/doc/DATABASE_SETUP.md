# 全局数据库配置说明

## 🎯 全局数据库特性

项目现在使用**全局数据库连接**，无需在每个模块中单独注入TypeORM模块。数据库连接在整个应用中都是可用的。

## 环境变量配置

在项目根目录创建 `.env` 文件，参考 `env.example` 文件：

```bash
# 应用配置
NODE_ENV=development
SERVICE_PORT=9000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=allinone_db

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## 全局数据库配置

### 1. 主配置

- `src/configs/database.config.ts` - 数据库连接配置
- `src/app.module.ts` - 全局注册TypeORM连接

### 2. 全局数据库服务

- `src/services/global-database.service.ts` - 全局数据库服务
- 提供统一的数据库操作接口

## 🚀 使用方法

### 方式一：使用全局数据库服务（推荐）

```typescript
import { Injectable } from '@nestjs/common';
import { GlobalDatabaseService } from '@/services/global-database.service';
import { User } from '@/entity/user.entity';

@Injectable()
export class YourService {
  constructor(private readonly globalDatabaseService: GlobalDatabaseService) {}

  async getUsers(): Promise<User[]> {
    // 获取Repository
    const userRepository = this.globalDatabaseService.getRepository(User);

    // 执行查询
    return await userRepository.find();
  }

  async executeCustomQuery(): Promise<any> {
    // 执行原生SQL
    return await this.globalDatabaseService.query('SELECT * FROM users WHERE status = ?', [1]);
  }
}
```

### 方式二：直接注入DataSource

```typescript
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@/entity/user.entity';

@Injectable()
export class YourService {
  private userRepository: Repository<User>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
```

## 📋 全局数据库服务API

### 核心方法

```typescript
class GlobalDatabaseService {
  // 获取指定实体的Repository
  getRepository<T>(entity: EntityTarget<T>): Repository<T>;

  // 执行原生SQL查询
  query(sql: string, parameters?: any[]): Promise<any>;

  // 检查数据库连接状态
  isConnected(): boolean;

  // 获取数据库名称
  getDatabaseName(): string;
}
```

### 使用示例

```typescript
// 获取Repository
const userRepo = this.globalDatabaseService.getRepository(User);

// 基本查询
const users = await userRepo.find();
const user = await userRepo.findOne({ where: { id: 1 } });

// 复杂查询
const activeUsers = await userRepo.find({
  where: { status: 1 },
  order: { createdAt: 'DESC' },
  take: 10,
  skip: 0,
});

// 原生SQL
const result = await this.globalDatabaseService.query(
  'SELECT COUNT(*) as count FROM users WHERE status = ?',
  [1],
);
```

## 🔧 实体定义

### 创建实体

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('your_table')
export class YourEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '名称' })
  name: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;
}
```

### 实体自动发现

- 所有 `.entity.ts` 文件会被自动发现
- 无需在模块中手动注册
- 支持热重载

## 🚀 启动前准备

1. **启动MySQL服务**
2. **创建数据库**：
   ```sql
   CREATE DATABASE allinone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **配置环境变量**：复制 `env.example` 为 `.env`
4. **启动应用**：`npm run dev`

## ✨ 优势

1. **全局可用**：数据库连接在整个应用中都是可用的
2. **无需重复注入**：不需要在每个模块中单独配置TypeORM
3. **统一接口**：通过GlobalDatabaseService提供统一的数据库操作接口
4. **类型安全**：完整的TypeScript类型支持
5. **自动发现**：实体文件自动发现和加载

## ⚠️ 注意事项

- 生产环境请关闭 `synchronize` 选项，使用数据库迁移
- 生产环境请关闭 `logging` 选项
- 请根据实际需求调整连接池参数
- 建议使用环境变量管理敏感信息
- 全局数据库服务已自动注册，无需额外配置
