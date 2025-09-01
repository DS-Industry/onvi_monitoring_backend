# Platform User Permission System - Visual Representation

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[HTTP Request]
        B[Controller with @CheckAbilities]
    end
    
    subgraph "Guard Layer"
        C[JWT Guard]
        D[AbilitiesGuard]
    end
    
    subgraph "Permission Layer"
        E[AbilityFactory]
        F[CASL Ability Builder]
        G[Permission Rules]
    end
    
    subgraph "Data Layer"
        H[Redis Cache]
        I[Database - Prisma]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    E --> H
    E --> I
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style H fill:#ffebee
    style I fill:#e8f5e8
```

## 2. Permission Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant AbilitiesGuard
    participant AbilityFactory
    participant Redis
    participant Database
    participant CASL

    Client->>Controller: HTTP Request with @CheckAbilities
    Controller->>AbilitiesGuard: Check permissions
    AbilitiesGuard->>AbilityFactory: createForPlatformManager(user)
    
    AbilityFactory->>Redis: Check cache (ability:userId:)
    
    alt Cache Hit
        Redis-->>AbilityFactory: Return cached rules
    else Cache Miss
        AbilityFactory->>Database: Get user role permissions
        AbilityFactory->>Database: Get user organization permissions
        AbilityFactory->>Database: Get user POS permissions
        AbilityFactory->>Database: Get user loyalty program permissions
        AbilityFactory->>Database: Get permission objects
        AbilityFactory->>CASL: Build ability with conditions
        AbilityFactory->>Redis: Cache rules (1 hour TTL)
    end
    
    AbilityFactory-->>AbilitiesGuard: Return ability
    AbilitiesGuard->>CASL: Check permissions using ForbiddenError
    CASL-->>AbilitiesGuard: Permission result
    AbilitiesGuard-->>Controller: Allow/Deny access
    Controller-->>Client: Response
```

## 3. Database Schema Relationships

```mermaid
erDiagram
    User {
        int id PK
        string email
        int userRoleId FK
        datetime createdAt
        datetime updatedAt
    }
    
    UserRole {
        int id PK
        string name
        string description
    }
    
    PlatformUserPermission {
        int id PK
        enum action
        int objectId FK
    }
    
    ObjectPermissions {
        int id PK
        string name
    }
    
    Organization {
        int id PK
        string name
        string slug
        enum status
    }
    
    Pos {
        int id PK
        string name
        int organizationId FK
        enum status
    }
    
    User ||--o{ UserRole : has
    UserRole ||--o{ PlatformUserPermission : contains
    PlatformUserPermission ||--|| ObjectPermissions : references
    User ||--o{ Organization : belongs_to
    User ||--o{ Pos : has_access_to
    Organization ||--o{ Pos : contains
```

## 4. Permission Building Process

```mermaid
flowchart TD
    A[Start: User Login] --> B[Get User Role]
    B --> C[Get Role Permissions]
    C --> D[Get User Context]
    
    D --> E[Organization Permissions]
    D --> F[POS Permissions]
    D --> G[Loyalty Program Permissions]
    
    E --> H[Build Object Map]
    F --> H
    G --> H
    
    H --> I[Process Each Permission]
    
    I --> J{Object Type?}
    
    J -->|Pos| K[Add POS Conditions]
    J -->|LTYProgram| L[Add Loyalty Conditions]
    J -->|Organization| M[Add Org Conditions]
    J -->|Other Objects| N[Add POS-based Conditions]
    
    K --> O[Build CASL Ability]
    L --> O
    M --> O
    N --> O
    
    O --> P[Cache in Redis]
    P --> Q[Return Ability]
    
    style A fill:#e3f2fd
    style Q fill:#e8f5e8
    style P fill:#fff3e0
```

## 5. Permission Condition Logic

```mermaid
graph LR
    subgraph "Permission Conditions"
        A[Pos Object] --> B[id: {in: posCondition}<br/>organizationId: {in: orgCondition}]
        
        C[LTYProgram Object] --> D[id: {in: loyaltyProgramCondition}]
        
        E[Organization Object] --> F[id: {in: orgCondition}]
        
        G[Other Objects<br/>Incident, TechTask,<br/>Warehouse, etc.] --> H[posId: {in: posCondition}]
    end
    
    subgraph "User Context"
        I[User ID] --> J[Role Permissions]
        J --> K[Organization Access]
        J --> L[POS Access]
        J --> M[Loyalty Access]
    end
    
    style A fill:#e8f5e8
    style C fill:#e8f5e8
    style E fill:#e8f5e8
    style G fill:#e8f5e8
    style I fill:#e3f2fd
```

## 6. Controller Usage Examples

```mermaid
graph TD
    subgraph "Controller Methods"
        A[@Get('/pos/:id')<br/>@CheckAbilities(new ReadPosAbility())]
        
        B[@Post('/incident')<br/>@CheckAbilities(new CreateIncidentAbility())]
        
        C[@Patch('/organization/:id')<br/>@CheckAbilities(new UpdateOrgAbility())]
        
        D[@Delete('/loyalty/:id')<br/>@CheckAbilities(new DeleteLoyaltyAbility())]
    end
    
    subgraph "Guard Processing"
        E[Extract @CheckAbilities metadata]
        E --> F[Get user from request]
        F --> G[Build ability for user]
        G --> H[Check each permission rule]
        H --> I[Allow/Deny access]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#fff3e0
```

## 7. Caching Strategy

```mermaid
graph LR
    subgraph "Cache Key Structure"
        A[ability:userId:timestamp]
    end
    
    subgraph "Cache Operations"
        B[Check Cache] --> C{Cache Hit?}
        C -->|Yes| D[Return Cached Rules]
        C -->|No| E[Build New Ability]
        E --> F[Serialize Rules to JSON]
        F --> G[Store in Redis (1 hour TTL)]
        G --> H[Return New Ability]
    end
    
    subgraph "Cache Benefits"
        I[Reduce Database Queries]
        J[Faster Permission Checks]
        K[Lower Latency]
    end
    
    A --> B
    D --> I
    H --> I
    I --> J
    J --> K
    
    style A fill:#e3f2fd
    style I fill:#e8f5e8
    style J fill:#e8f5e8
    style K fill:#e8f5e8
```

## 8. Permission Types and Actions

```mermaid
graph TB
    subgraph "Permission Actions"
        A[read] --> A1[View data]
        B[create] --> B1[Add new records]
        C[update] --> C1[Modify existing data]
        D[delete] --> D1[Remove records]
        E[manage] --> E1[Full control]
    end
    
    subgraph "Common Objects"
        F[Organization] --> F1[Company/Entity management]
        G[Pos] --> G1[Point of Sale locations]
        H[Incident] --> H1[Equipment issues]
        I[TechTask] --> I1[Technical tasks]
        J[Warehouse] --> J1[Inventory management]
        K[CashCollection] --> K1[Financial operations]
        L[ShiftReport] --> L1[Work shift reports]
        M[ManagerPaper] --> M1[Managerial documents]
    end
    
    subgraph "Condition Types"
        N[Organization-based] --> N1[User's org access]
        O[POS-based] --> O1[User's location access]
        P[Loyalty-based] --> P1[User's program access]
    end
    
    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#e8f5e8
```

## Key Insights

1. **Multi-layered Security**: JWT → Role → Permission → Object → Condition
2. **Context-aware Permissions**: User's organization, POS, and loyalty program access
3. **Performance Optimization**: Redis caching with 1-hour TTL
4. **Flexible Architecture**: Easy to add new objects and permission types
5. **Complex Business Logic**: Hardcoded conditions for different object types
6. **CASL Integration**: Leverages CASL's powerful permission engine
7. **NestJS Integration**: Clean integration with guards and decorators

## Areas for Improvement

1. **Dynamic Conditions**: Replace hardcoded business logic with configuration
2. **Performance**: Optimize database queries and reduce N+1 problems
3. **Type Safety**: Improve TypeScript types and reduce `any` usage
4. **Testing**: Add comprehensive unit tests for permission logic
5. **Monitoring**: Add permission check logging and performance metrics
