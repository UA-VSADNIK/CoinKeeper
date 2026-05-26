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
````mermaid 
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
````mermaid
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
