```mermaid
graph TD
    A([Початок]) --> B[Користувач заповнює форму витрати]
    B --> C{Натиснуто<br>'+ Додати'?}
    C -- Ні --> B
    C -- Так --> D[Зчитування даних з полів]
    D --> E{Валідація:<br>Чи заповнені поля?}
    
    E -- Ні --> F[Alert: Заповніть всі поля]
    F --> B
    
    E -- Так --> G[Запит поточного балансу з БД]
    G --> H{Сума > Баланс?}
    
    H -- Так --> I[Alert: Сума перевищує баланс]
    I --> B
    
    H -- Ні --> J[Збереження запису в MySQL БД]
    J --> L[Оновлення інтерфейсу:<br>Таблиця + Графіки]
    L --> M([Кінець])

    %% Стилізація під кольори CoinKeeper
    style A fill:#222e54,stroke:#222e54,color:#fff
    style M fill:#222e54,stroke:#222e54,color:#fff
    style B fill:#4c929e,stroke:#222e54,color:#fff
    style D fill:#4c929e,stroke:#222e54,color:#fff
    style G fill:#4c929e,stroke:#222e54,color:#fff
    style L fill:#bed3c4,stroke:#222e54,color:#222e54
    style J fill:#bed3c4,stroke:#222e54,color:#222e54
    
    style C fill:#222e54,stroke:#4c929e,color:#fff
    style E fill:#222e54,stroke:#4c929e,color:#fff
    style H fill:#222e54,stroke:#4c929e,color:#fff
    
    style F fill:#ce6a6c,stroke:#ce6a6c,color:#fff
    style I fill:#ce6a6c,stroke:#ce6a6c,color:#fff

    %% Кольори стрілок
    linkStyle default stroke:#4c929e,stroke-width:2px;
```
```mermaid
C4Container
    title Container Diagram - Personal Finance Tracker (CoinKeeper)

    Person(user, "Користувач", "Керує фінансами та переглядає аналітику")

    System_Boundary(system, "Finance Tracking System") {
        Container(frontend, "Web Application", "HTML, CSS, JavaScript", "Надає інтерфейс користувача, відображає графіки Chart.js")
        Container(backend, "Backend Application", "PHP", "Обробляє бізнес-логіку, валідує ліміти, працює з сесіями")
        ContainerDb(db, "Database", "MySQL", "Зберігає дані користувачів, транзакції, категорії та місячні ліміти")
    }

    Rel(user, frontend, "Використовує", "HTTPS")
    Rel(frontend, backend, "Відправляє запити / отримує дані", "JSON/HTTPS")
    Rel(backend, db, "Читає / Записує", "SQL")

    %% Стилізація C4 під палітру проєкту
    UpdateElementStyle(user, $bgColor="#222e54", $fontColor="#ffffff", $borderColor="#4c929e")
    UpdateElementStyle(frontend, $bgColor="#4c929e", $fontColor="#ffffff", $borderColor="#222e54")
    UpdateElementStyle(backend, $bgColor="#222e54", $fontColor="#ffffff", $borderColor="#4c929e")
    UpdateElementStyle(db, $bgColor="#5b6b8f", $fontColor="#ffffff", $borderColor="#222e54")
    
    UpdateRelStyle(user, frontend, $lineColor="#4c929e", $textColor="#222e54")
    UpdateRelStyle(frontend, backend, $lineColor="#4c929e", $textColor="#222e54")
    UpdateRelStyle(backend, db, $lineColor="#ce6a6c", $textColor="#222e54")
```
```mermaid
C4Context
    title System Context - Personal Finance Tracker (CoinKeeper)

    Person(user, "Користувач", "Вносить витрати, встановлює ліміти та контролює особистий бюджет")
    System(system, "Finance Tracking System", "Веб-додаток (CoinKeeper) для обліку фінансів та аналітики трендів витрат")
    System_Ext(db, "MySQL Database", "Зовнішнє сховище для надійного збереження фінансових логів")

    Rel(user, system, "Вносить дані, переглядає графіки")
    Rel(system, db, "Синхронізує транзакції та бюджети")

    %% Стилізація Context
    UpdateElementStyle(user, $bgColor="#222e54", $fontColor="#ffffff", $borderColor="#4c929e")
    UpdateElementStyle(system, $bgColor="#4c929e", $fontColor="#ffffff", $borderColor="#222e54")
    UpdateElementStyle(db, $bgColor="#ce6a6c", $fontColor="#ffffff", $borderColor="#222e54")

    UpdateRelStyle(user, system, $lineColor="#4c929e", $textColor="#222e54")
    UpdateRelStyle(system, db, $lineColor="#222e54", $textColor="#222e54")
```
```mermaid
graph LR
    %% Актори (Зліва)
    subgraph Ролі [Користувачі системи]
        Guest((Гість))
        User((Користувач))
        FamilyMember((Член групи))
        Admin((Адмін групи))
    end
    
    SystemNode((«Automated»<br>Система))

    %% Успадкування акторів
    User --> Guest
    FamilyMember --> User
    Admin --> FamilyMember

    %% РЯД 1: Авторизація -> Облік -> Аналітика (Йдуть зліва направо)
    subgraph AuthProfile [1. Авторизація та Профіль]
        UC_Reg[Створення акаунту]
        UC_Confirm[Підтвердження Email]
        UC_Reset[Відновлення паролю]
        UC_Login[Вхід у систему]
        UC_Profile[Налаштування профілю]
        
        UC_Reg -.->|include| UC_Confirm
    end

    subgraph FinAccounting [2. Облік фінансів]
        UC_AddExp[Додавання витрати]
        UC_Cat[Вибір категорії]
        UC_CreateCat[Створення категорії]
        UC_EditExp[Редагування витрат]
        UC_AddInc[Поповнення доходу]
        
        UC_AddExp -.->|include| UC_Cat
    end

    subgraph BudgetAnalytics [3. Бюджет та Аналітика]
        UC_SetLimit[Встановлення ліміту]
        UC_Dash[Перегляд дашборду]
        UC_Trend[Аналітика та тренди]
        UC_History[Історія транзакцій]
        UC_Filter[Фільтрація]
        
        UC_History -.->|extend| UC_Filter
    end

    subgraph FamilyBudget [4. Сімейний бюджет]
        UC_FamCreate[Створення групи]
        UC_FamJoin[Приєднання до групи]
        UC_FamAdd[Спільні витрати]
        UC_FamManage[Керування групою]
    end

    subgraph NotifSupport [5. Сповіщення та FAQ]
        UC_Timeout[Сесія при неактивності]
        UC_Lock[Блокування 5 спроб]
        UC_Remind[Нагадування]
        UC_Alert[Сповіщення про ліміт]
        UC_FAQ[Перегляд FAQ]
    end

    %% Напрямок зв'язків для розтягування вшир
    AuthProfile --> FinAccounting --> BudgetAnalytics --> FamilyBudget

    %% Зв'язки Акторів з прецедентами
    Guest --> UC_Reg
    Guest --> UC_Login
    Guest --> UC_Reset

    User --> UC_Profile
    User --> UC_AddExp
    User --> UC_CreateCat
    User --> UC_EditExp
    User --> UC_AddInc
    User --> UC_SetLimit
    User --> UC_Dash
    User --> UC_Trend
    User --> UC_History
    User --> UC_FAQ

    FamilyMember --> UC_FamJoin
    FamilyMember --> UC_FamAdd
    
    Admin --> UC_FamCreate
    Admin --> UC_FamManage

    SystemNode --> UC_Timeout
    SystemNode --> UC_Lock
    SystemNode --> UC_Remind
    SystemNode --> UC_Alert

    %% СТИЛІЗАЦІЯ COINKEEPER
    style Guest fill:#222e54,stroke:#4c929e,stroke-width:2px,color:#fff
    style User fill:#222e54,stroke:#4c929e,stroke-width:2px,color:#fff
    style FamilyMember fill:#222e54,stroke:#4c929e,stroke-width:2px,color:#fff
    style Admin fill:#222e54,stroke:#4c929e,stroke-width:2px,color:#fff
    style SystemNode fill:#363e4d,stroke:#718096,stroke-width:2px,color:#fff

    style AuthProfile fill:#f7fafc,stroke:#222e54,stroke-width:2px
    style NotifSupport fill:#f7fafc,stroke:#222e54,stroke-width:2px
    style FinAccounting fill:#f7fafc,stroke:#4c929e,stroke-width:2px
    style BudgetAnalytics fill:#f7fafc,stroke:#4c929e,stroke-width:2px
    style FamilyBudget fill:#f0f5f2,stroke:#bed3c4,stroke-width:2px

    classDef default fill:#4c929e,stroke:#222e54,stroke-width:1px,color:#fff;
    classDef relations fill:#ce6a6c,stroke:#222e54,stroke-width:1px,color:#fff;
    classDef family fill:#bed3c4,stroke:#222e54,stroke-width:1px,color:#222e54;

    class UC_Confirm,UC_Cat,UC_Filter relations;
    class UC_FamCreate,UC_FamJoin,UC_FamAdd,UC_FamManage family;

    linkStyle default stroke:#4c929e,stroke-width:1.5px;

```
