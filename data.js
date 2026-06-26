/* =========================================================================
   PromptForge — конфигурация путей и двуязычные заготовки промтов.

   CATEGORIES = [ { id, label, icon, desc, types: [ TYPE ] } ]
   TYPE = {
     id, label, icon, desc,
     groups: [ { label, fields: [ FIELD ] } ],
     build(v) -> string   // читает LANG; v[id] = строка | массив {id,name,prompt}
   }
   FIELD: text | textarea | select | segment | toggles

   Двуязычность: перед build() вызывается setLang('en'|'ru').
   L(en, ru) выбирает строку; для тоглов EN берёт item.prompt, RU — item.name.
   ========================================================================= */

let LANG = "en";
function setLang(l) { LANG = l === "ru" ? "ru" : "en"; }

const L = (en, ru) => (LANG === "ru" ? ru : en);
const T = (s, def = "") => (s && String(s).trim() ? String(s).trim() : def);
const names = (arr) => (arr || []).map((x) => (LANG === "ru" ? x.name : x.prompt || x.name));
const joinComma = (arr) => (arr || []).join(", ");
const bullets = (arr) =>
  arr && arr.length ? arr.map((x) => "- " + x).join("\n") : "- " + L("(none specified)", "(не указано)");

function section(title, body) {
  if (!body || !String(body).trim()) return "";
  return `## ${title}\n${body}\n`;
}
function compose(parts) { return parts.filter((p) => p !== "" && p != null).join("\n").trim(); }

// =========================================================================
//  КАТЕГОРИЯ: КОД
// =========================================================================
const CODE_TYPES = [
  // ---- Сайт ----
  {
    id: "website", label: "Сайт", icon: "globe", desc: "Лендинг, корпоративный сайт, портфолио",
    groups: [
      { label: "Основа", fields: [
        { id: "niche", type: "text", label: "Ниша / о чём сайт", placeholder: "например: студия веб-дизайна" },
        { id: "audience", type: "text", label: "Целевая аудитория", placeholder: "например: малый бизнес, стартапы" },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Визуальный стиль",
          options: ["Минимализм", "Корпоративный", "Яркий / игривый", "Премиум / люкс", "Тёмная тема", "Бруталистичный"] },
        { id: "accent", type: "text", label: "Фирменный цвет (опц.)", placeholder: "например: глубокий синий" },
        { id: "ref", type: "text", label: "Сайт-референс (опц.)", placeholder: "например: в духе stripe.com" },
      ]},
      { label: "Блоки и функции", fields: [
        { id: "features", type: "toggles", label: "Что должно быть на сайте", items: [
          { id: "hero", name: "Hero-блок с оффером", prompt: "A strong hero section with headline, subheadline and a primary call-to-action" },
          { id: "calc", name: "Калькулятор цен", prompt: "An interactive price calculator that updates the total live based on user choices" },
          { id: "contacts", name: "Блок контактов / форма", prompt: "A contact section with a validated form (name, email, message) and contact details" },
          { id: "portfolio", name: "Портфолио / кейсы", prompt: "A portfolio gallery showcasing projects with images and short case descriptions" },
          { id: "services", name: "Услуги / тарифы", prompt: "A services or pricing-plans section with feature comparison" },
          { id: "testimonials", name: "Отзывы клиентов", prompt: "A testimonials section with client quotes and avatars" },
          { id: "faq", name: "FAQ", prompt: "An FAQ section with expandable accordion items" },
          { id: "blog", name: "Блог / новости", prompt: "A blog or news section with article cards" },
          { id: "about", name: "О нас / команда", prompt: "An about section presenting the team and mission" },
          { id: "stats", name: "Цифры / достижения", prompt: "A stats section with animated counters of key numbers" },
          { id: "gallery", name: "Галерея / слайдер", prompt: "An image gallery or carousel slider" },
          { id: "map", name: "Карта", prompt: "An embedded map showing the location" },
          { id: "newsletter", name: "Подписка на рассылку", prompt: "A newsletter subscription block" },
          { id: "cta", name: "Финальный призыв", prompt: "A closing call-to-action banner before the footer" },
        ]},
      ]},
      { label: "Техника", fields: [
        { id: "stack", type: "select", label: "Технологии",
          options: ["Без предпочтений", "HTML + CSS + чистый JS", "React + Tailwind", "Next.js", "Vue / Nuxt", "Astro", "Svelte"] },
        { id: "extras", type: "toggles", label: "Дополнительно", items: [
          { id: "responsive", name: "Адаптив под мобильные", prompt: "Fully responsive across mobile, tablet and desktop" },
          { id: "anim", name: "Плавные анимации", prompt: "Smooth scroll-triggered and hover micro-animations" },
          { id: "dark", name: "Переключатель темы", prompt: "A light/dark theme toggle that persists the user choice" },
          { id: "seo", name: "SEO-оптимизация", prompt: "Semantic HTML, meta tags and SEO best practices" },
          { id: "a11y", name: "Доступность (a11y)", prompt: "Accessible markup meeting WCAG AA (keyboard, ARIA, contrast)" },
          { id: "multilang", name: "Несколько языков", prompt: "Multi-language support with an easy way to add locales" },
          { id: "analytics", name: "Аналитика", prompt: "Analytics events wired to key user actions" },
          { id: "perf", name: "Высокая скорость", prompt: "Performance-optimized: lazy loading, optimized assets, high Lighthouse score" },
        ]},
      ]},
    ],
    build(v) {
      const style = T(v.style, L("Minimal", "Минимализм"));
      const styleMap = {
        "Минимализм": L("clean, minimal, lots of whitespace, restrained typography", "чистый минимализм, много воздуха, сдержанная типографика"),
        "Корпоративный": L("professional, trustworthy, structured corporate look", "профессиональный, внушающий доверие корпоративный вид"),
        "Яркий / игривый": L("bold, colorful, playful with energetic accents", "яркий, цветной, игривый с энергичными акцентами"),
        "Премиум / люкс": L("elegant, premium, refined with luxurious detailing", "элегантный, премиальный, с люксовыми деталями"),
        "Тёмная тема": L("sleek dark UI with vivid accent highlights", "стильный тёмный интерфейс с яркими акцентами"),
        "Бруталистичный": L("raw brutalist design, strong type, visible structure", "брутализм: грубая сетка, крупный шрифт, видимая структура"),
      };
      return compose([
        L("You are a senior front-end engineer and UI/UX designer. Build a complete, production-ready website.",
          "Ты — старший фронтенд-разработчик и UI/UX-дизайнер. Создай готовый к продакшену сайт."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a ${style.toLowerCase()} website for "${T(v.niche, "a modern business")}"` + (T(v.audience) ? `, targeted at ${T(v.audience)}.` : "."),
            `Создай сайт в стиле «${style}» для «${T(v.niche, "современный бизнес")}»` + (T(v.audience) ? `, ориентированный на ${T(v.audience)}.` : "."))),
        section(L("Visual direction", "Визуальный стиль"), bullets([
          L("Overall style: ", "Общий стиль: ") + (styleMap[style] || style),
          T(v.accent) ? L("Primary brand color: ", "Фирменный цвет: ") + T(v.accent) : L("Choose a tasteful, cohesive palette", "Подбери гармоничную палитру"),
          T(v.ref) ? L("Reference / inspiration: ", "Референс: ") + T(v.ref) : "",
          L("Rounded corners, soft shadows and clear visual hierarchy", "Округлые углы, мягкие тени, понятная иерархия"),
        ].filter(Boolean))),
        section(L("Required sections & features", "Нужные блоки и функции"), bullets(names(v.features))),
        section(L("Technical requirements", "Технические требования"), bullets([
          L("Tech stack: ", "Стек: ") + (T(v.stack) === "Без предпочтений" || !T(v.stack) ? L("your best modern choice", "на твой выбор") : T(v.stack)),
          ...names(v.extras),
          L("Clean, well-structured and commented code", "Чистый, структурированный код с комментариями"),
        ])),
        section(L("Deliverables", "Результат"),
          L("Provide the full code organized by file, ready to run.", "Выдай полный код по файлам, готовый к запуску.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Telegram-бот ----
  {
    id: "tgbot", label: "Telegram-бот", icon: "bot", desc: "Чат-бот, магазин, рассылки, сервис",
    groups: [
      { label: "Основа", fields: [
        { id: "purpose", type: "text", label: "Что делает бот", placeholder: "например: принимает заказы на доставку" },
        { id: "lang", type: "select", label: "Язык / стек", options: ["Python (aiogram)", "Python (python-telegram-bot)", "Node.js (telegraf)", "Без предпочтений"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Функции бота", items: [
          { id: "menu", name: "Меню с кнопками", prompt: "Inline and reply keyboard menus for navigation" },
          { id: "catalog", name: "Каталог товаров", prompt: "A product catalog with categories, photos and prices" },
          { id: "cart", name: "Корзина и заказ", prompt: "A shopping cart and an order checkout flow" },
          { id: "payments", name: "Приём оплаты", prompt: "Payment handling via Telegram Payments" },
          { id: "faq", name: "Ответы на вопросы", prompt: "An FAQ / auto-reply flow for common questions" },
          { id: "booking", name: "Запись / бронирование", prompt: "A booking flow with date and time selection" },
          { id: "admin", name: "Админ-панель", prompt: "An admin panel to manage content and view orders" },
          { id: "broadcast", name: "Рассылки", prompt: "Mass broadcast messages to all users" },
          { id: "reminders", name: "Напоминания / расписание", prompt: "Scheduled reminders and notifications" },
          { id: "referral", name: "Реферальная система", prompt: "A referral system with invite links" },
          { id: "db", name: "База данных пользователей", prompt: "Persist users and data in a database" },
          { id: "ai", name: "Ответы через ИИ", prompt: "AI-powered free-form answers via an LLM API" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert bot developer. Build a complete, production-ready Telegram bot.",
          "Ты — эксперт по ботам. Создай готового к продакшену Telegram-бота."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a Telegram bot that ${T(v.purpose, "serves users with a useful service")}.`,
            `Создай Telegram-бота, который ${T(v.purpose, "оказывает пользователям полезный сервис")}.`)),
        section(L("Implementation", "Реализация"), bullets([
          L("Framework: ", "Фреймворк: ") + (T(v.lang) === "Без предпочтений" || !T(v.lang) ? L("your best modern choice", "на твой выбор") : T(v.lang)),
          L("Clean command/handler structure with comments", "Чистая структура команд/хендлеров с комментариями"),
          L("Read the bot token from an environment variable", "Токен бота — из переменной окружения"),
          L("Graceful error handling and input validation", "Аккуратная обработка ошибок и валидация ввода"),
        ])),
        section(L("Features", "Функции"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("Full source code by file, a requirements list, and short run instructions.",
            "Полный код по файлам, список зависимостей и краткая инструкция по запуску.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- ИИ-агент ----
  {
    id: "aiagent", label: "ИИ-агент", icon: "brain", desc: "Автономный агент с инструментами и памятью",
    groups: [
      { label: "Основа", fields: [
        { id: "goal", type: "text", label: "Задача агента", placeholder: "например: исследует тему и пишет отчёт" },
        { id: "model", type: "select", label: "Модель / провайдер", options: ["Claude (Anthropic)", "OpenAI", "Без предпочтений"] },
        { id: "framework", type: "select", label: "Фреймворк", options: ["Без фреймворка (чистый код)", "LangChain", "LlamaIndex", "Claude Agent SDK"] },
      ]},
      { label: "Возможности", fields: [
        { id: "tools", type: "toggles", label: "Инструменты и способности", items: [
          { id: "web", name: "Поиск в интернете", prompt: "Web search to gather up-to-date information" },
          { id: "files", name: "Чтение / запись файлов", prompt: "Read and write local files" },
          { id: "code", name: "Выполнение кода", prompt: "Execute code in a sandbox to compute or test" },
          { id: "memory", name: "Долгосрочная память", prompt: "Long-term memory persisted between runs" },
          { id: "api", name: "Вызов внешних API", prompt: "Call external APIs as tools" },
          { id: "rag", name: "База знаний (RAG)", prompt: "Retrieval over a private knowledge base (RAG)" },
          { id: "plan", name: "Планирование шагов", prompt: "Decompose the goal into a step-by-step plan before acting" },
          { id: "reflect", name: "Самопроверка результата", prompt: "Self-reflection step to verify and improve its own output" },
          { id: "multi", name: "Несколько суб-агентов", prompt: "Coordinate multiple specialized sub-agents" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert AI engineer. Build a working autonomous AI agent.",
          "Ты — эксперт по ИИ. Создай рабочего автономного ИИ-агента."),
        "",
        section(L("Objective", "Цель"),
          L(`Create an AI agent whose goal is to ${T(v.goal, "accomplish a user-defined task autonomously")}.`,
            `Создай ИИ-агента, цель которого — ${T(v.goal, "автономно решать заданную пользователем задачу")}.`)),
        section(L("Setup", "Настройка"), bullets([
          L("Model: ", "Модель: ") + (T(v.model) === "Без предпочтений" || !T(v.model) ? L("the latest capable model", "новейшая мощная модель") : T(v.model)),
          L("Framework: ", "Фреймворк: ") + T(v.framework, L("your best choice", "на твой выбор")),
          L("Load API keys from environment variables", "Ключи API — из переменных окружения"),
        ])),
        section(L("Capabilities", "Способности"), bullets(names(v.tools))),
        section(L("Requirements", "Требования"), bullets([
          L("A clear agent loop (reason → act → observe) with logging", "Понятный цикл агента (рассуждение → действие → наблюдение) с логами"),
          L("Robust error handling and a max-iteration safety limit", "Надёжная обработка ошибок и лимит итераций"),
          L("Modular tool definitions that are easy to extend", "Модульные инструменты, которые легко расширять"),
        ])),
        section(L("Deliverables", "Результат"),
          L("Full source by file, dependency list, and a short usage example.",
            "Полный код по файлам, список зависимостей и пример использования.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Мобильное приложение ----
  {
    id: "mobileapp", label: "Моб. приложение", icon: "phone", desc: "iOS / Android приложение",
    groups: [
      { label: "Основа", fields: [
        { id: "idea", type: "text", label: "Идея приложения", placeholder: "например: трекер привычек" },
        { id: "platform", type: "segment", label: "Платформа", options: ["Кроссплатформа", "iOS", "Android"] },
        { id: "stack", type: "select", label: "Технология", options: ["React Native", "Flutter", "SwiftUI", "Kotlin / Compose", "Без предпочтений"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Функции приложения", items: [
          { id: "auth", name: "Авторизация", prompt: "User authentication (sign up / log in)" },
          { id: "onboard", name: "Онбординг", prompt: "An onboarding flow for new users" },
          { id: "push", name: "Push-уведомления", prompt: "Push notifications" },
          { id: "offline", name: "Офлайн-режим", prompt: "Offline support with local storage and sync" },
          { id: "profile", name: "Профиль пользователя", prompt: "A user profile and settings screen" },
          { id: "social", name: "Соц. функции", prompt: "Social features (friends, sharing, comments)" },
          { id: "payments", name: "Подписки / покупки", prompt: "In-app purchases or subscriptions" },
          { id: "geo", name: "Геолокация / карта", prompt: "Geolocation and map features" },
          { id: "darkmode", name: "Тёмная тема", prompt: "Light and dark theme support" },
          { id: "charts", name: "Статистика / графики", prompt: "Stats screens with charts and progress" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a senior mobile app developer. Build a polished, production-ready mobile app.",
          "Ты — старший мобильный разработчик. Создай аккуратное готовое к продакшену приложение."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a mobile app: ${T(v.idea, "a useful everyday app")}.`,
            `Создай мобильное приложение: ${T(v.idea, "полезное приложение на каждый день")}.`)),
        section(L("Setup", "Настройка"), bullets([
          L("Target: ", "Платформа: ") + T(v.platform, L("Cross-platform", "Кроссплатформа")),
          L("Stack: ", "Стек: ") + (T(v.stack) === "Без предпочтений" || !T(v.stack) ? L("your best modern choice", "на твой выбор") : T(v.stack)),
          L("Clean architecture and reusable components", "Чистая архитектура и переиспользуемые компоненты"),
          L("Modern, friendly UI with smooth navigation", "Современный дружелюбный UI с плавной навигацией"),
        ])),
        section(L("Features", "Функции"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("Full project structure with code by file and run instructions.",
            "Полная структура проекта с кодом по файлам и инструкцией по запуску.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Бэкенд / API ----
  {
    id: "backend", label: "Бэкенд / API", icon: "server", desc: "REST/GraphQL API, серверная логика",
    groups: [
      { label: "Основа", fields: [
        { id: "purpose", type: "text", label: "Что обслуживает API", placeholder: "например: бэкенд для таск-менеджера" },
        { id: "lang", type: "select", label: "Язык / фреймворк", options: ["Node.js (Express)", "Node.js (NestJS)", "Python (FastAPI)", "Python (Django)", "Go", "Без предпочтений"] },
        { id: "apitype", type: "segment", label: "Тип API", options: ["REST", "GraphQL"] },
        { id: "db", type: "select", label: "База данных", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Без предпочтений"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Функции", items: [
          { id: "auth", name: "Аутентификация (JWT)", prompt: "Authentication and authorization (JWT, roles)" },
          { id: "crud", name: "CRUD-ресурсы", prompt: "Full CRUD endpoints for the core resources" },
          { id: "validation", name: "Валидация данных", prompt: "Request validation and clear error responses" },
          { id: "pagination", name: "Пагинация / фильтры", prompt: "Pagination, filtering and sorting" },
          { id: "files", name: "Загрузка файлов", prompt: "File upload handling" },
          { id: "realtime", name: "Реальное время (WebSocket)", prompt: "Realtime updates via WebSockets" },
          { id: "docs", name: "Документация (Swagger)", prompt: "Auto-generated API docs (OpenAPI/Swagger)" },
          { id: "tests", name: "Тесты", prompt: "Unit and integration tests" },
          { id: "docker", name: "Docker", prompt: "A Dockerfile and docker-compose for local run" },
          { id: "ratelimit", name: "Rate limiting", prompt: "Rate limiting and basic security hardening" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a senior backend engineer. Build a robust, production-ready backend.",
          "Ты — старший бэкенд-разработчик. Создай надёжный готовый к продакшену бэкенд."),
        "",
        section(L("Objective", "Цель"),
          L(`Build a ${T(v.apitype, "REST")} API: ${T(v.purpose, "a backend service")}.`,
            `Создай ${T(v.apitype, "REST")} API: ${T(v.purpose, "серверный сервис")}.`)),
        section(L("Stack", "Стек"), bullets([
          L("Framework: ", "Фреймворк: ") + (T(v.lang) === "Без предпочтений" || !T(v.lang) ? L("your best modern choice", "на твой выбор") : T(v.lang)),
          L("Database: ", "База данных: ") + (T(v.db) === "Без предпочтений" || !T(v.db) ? L("an appropriate database", "подходящая БД") : T(v.db)),
          L("Layered structure (routes → services → data) with comments", "Слоистая структура (роуты → сервисы → данные) с комментариями"),
          L("Environment-based config and secrets", "Конфиг и секреты через переменные окружения"),
        ])),
        section(L("Features", "Функции"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("Full source by file, env example, schema/migrations and run instructions.",
            "Полный код по файлам, пример .env, схема/миграции и инструкция по запуску.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Игра ----
  {
    id: "game", label: "Игра", icon: "game", desc: "Браузерная / 2D игра",
    groups: [
      { label: "Основа", fields: [
        { id: "idea", type: "text", label: "Идея игры", placeholder: "например: аркада, уворачивайся от метеоритов" },
        { id: "genre", type: "segment", label: "Жанр", options: ["Аркада", "Платформер", "Головоломка", "Раннер", "Тир", "Карточная"] },
        { id: "stack", type: "select", label: "Технология", options: ["HTML5 Canvas + JS", "Phaser", "Unity (C#)", "Godot", "Без предпочтений"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Что включить", items: [
          { id: "score", name: "Очки и рекорды", prompt: "Score system and a saved high-score" },
          { id: "levels", name: "Уровни / сложность", prompt: "Multiple levels with rising difficulty" },
          { id: "controls", name: "Управление с клавиш и тача", prompt: "Keyboard and touch controls" },
          { id: "sound", name: "Звуки и музыка", prompt: "Sound effects and background music" },
          { id: "menu", name: "Меню и пауза", prompt: "A start menu, pause and game-over screens" },
          { id: "powerups", name: "Бонусы / усиления", prompt: "Power-ups and collectibles" },
          { id: "enemies", name: "Враги / препятствия", prompt: "Enemies or obstacles with simple AI" },
          { id: "animations", name: "Анимации и эффекты", prompt: "Sprite animations and particle effects" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an experienced game developer. Build a complete, playable game.",
          "Ты — опытный геймдев-разработчик. Создай законченную играбельную игру."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a ${T(v.genre, "casual")} game: ${T(v.idea, "a fun arcade game")}.`,
            `Создай игру в жанре «${T(v.genre, "аркада")}»: ${T(v.idea, "увлекательная аркада")}.`)),
        section(L("Setup", "Настройка"), bullets([
          L("Engine/stack: ", "Движок/стек: ") + (T(v.stack) === "Без предпочтений" || !T(v.stack) ? L("your best choice", "на твой выбор") : T(v.stack)),
          L("Smooth game loop and clean, readable code", "Плавный игровой цикл и чистый читаемый код"),
        ])),
        section(L("Features", "Что включить"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("Full runnable code by file and how to play.", "Полный запускаемый код по файлам и как играть.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Расширение для браузера ----
  {
    id: "extension", label: "Расширение", icon: "puzzle", desc: "Браузерное расширение Chrome",
    groups: [
      { label: "Основа", fields: [
        { id: "purpose", type: "text", label: "Что делает расширение", placeholder: "например: блокирует отвлекающие сайты" },
        { id: "browser", type: "segment", label: "Браузер", options: ["Chrome", "Firefox", "Кроссбраузерное"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Функции", items: [
          { id: "popup", name: "Всплывающее окно", prompt: "A popup UI from the toolbar icon" },
          { id: "content", name: "Изменение страниц", prompt: "A content script that modifies pages" },
          { id: "context", name: "Пункт в правом клике", prompt: "A right-click context-menu action" },
          { id: "storage", name: "Сохранение настроек", prompt: "Persisted user settings via storage" },
          { id: "shortcut", name: "Горячие клавиши", prompt: "Keyboard shortcuts" },
          { id: "badge", name: "Счётчик на иконке", prompt: "A badge counter on the toolbar icon" },
          { id: "options", name: "Страница настроек", prompt: "An options/settings page" },
          { id: "sync", name: "Синхронизация", prompt: "Settings sync across devices" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert browser-extension developer. Build a complete extension (Manifest V3).",
          "Ты — эксперт по браузерным расширениям. Создай готовое расширение (Manifest V3)."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a ${T(v.browser, "Chrome")} extension that ${T(v.purpose, "improves the browsing experience")}.`,
            `Создай расширение для «${T(v.browser, "Chrome")}», которое ${T(v.purpose, "улучшает работу в браузере")}.`)),
        section(L("Features", "Функции"), bullets(names(v.features))),
        section(L("Requirements", "Требования"), bullets([
          L("Valid manifest.json (MV3) and minimal permissions", "Корректный manifest.json (MV3) и минимум разрешений"),
          L("Clean structure and a simple, tidy UI", "Чистая структура и аккуратный простой UI"),
        ])),
        section(L("Deliverables", "Результат"),
          L("All files by name and how to load it unpacked.", "Все файлы по именам и как установить распакованным.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- Скрипт автоматизации ----
  {
    id: "automation", label: "Автоматизация", icon: "bolt", desc: "Скрипт / парсер / автоматизация рутины",
    groups: [
      { label: "Основа", fields: [
        { id: "task", type: "text", label: "Что автоматизировать", placeholder: "например: собрать цены с сайта в таблицу" },
        { id: "lang", type: "select", label: "Язык", options: ["Python", "Node.js", "Bash", "Без предпочтений"] },
        { id: "source", type: "text", label: "Источник данных (опц.)", placeholder: "например: сайт, API, папка с файлами" },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Что нужно", items: [
          { id: "scrape", name: "Парсинг сайтов", prompt: "Scrape data from web pages" },
          { id: "api", name: "Работа с API", prompt: "Fetch and process data from an API" },
          { id: "files", name: "Обработка файлов", prompt: "Read, transform and write files (CSV/Excel/JSON)" },
          { id: "schedule", name: "Запуск по расписанию", prompt: "Run on a schedule (cron-like)" },
          { id: "notify", name: "Уведомления", prompt: "Send notifications (email/Telegram) on results" },
          { id: "clean", name: "Очистка / трансформация данных", prompt: "Clean and transform the data" },
          { id: "logs", name: "Логи и отчёт", prompt: "Logging and a summary report" },
          { id: "retry", name: "Повторы при ошибках", prompt: "Retries and error recovery" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an automation engineer. Write a reliable script to automate a routine task.",
          "Ты — инженер по автоматизации. Напиши надёжный скрипт для автоматизации рутины."),
        "",
        section(L("Objective", "Цель"),
          L(`Automate: ${T(v.task, "a repetitive task")}.`, `Автоматизируй: ${T(v.task, "повторяющуюся задачу")}.`) +
          (T(v.source) ? L(` Data source: ${T(v.source)}.`, ` Источник данных: ${T(v.source)}.`) : "")),
        section(L("Implementation", "Реализация"), bullets([
          L("Language: ", "Язык: ") + (T(v.lang) === "Без предпочтений" || !T(v.lang) ? L("your best choice", "на твой выбор") : T(v.lang)),
          L("Clear configuration at the top and helpful comments", "Понятная конфигурация сверху и комментарии"),
        ])),
        section(L("Features", "Что нужно"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("The full script, dependencies, and how to run it.", "Полный скрипт, зависимости и как запустить.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },

  // ---- n8n / воркфлоу ----
  {
    id: "n8n", label: "n8n / воркфлоу", icon: "flow", desc: "No-code автоматизация: n8n, Make, Zapier",
    groups: [
      { label: "Основа", fields: [
        { id: "task", type: "text", label: "Что должен делать воркфлоу", placeholder: "например: новая заявка с сайта → в Google Sheets и в Telegram" },
        { id: "platform", type: "segment", label: "Платформа", options: ["n8n", "Make", "Zapier"] },
        { id: "trigger", type: "segment", label: "Триггер (с чего стартует)", options: ["Webhook", "По расписанию", "Событие в приложении", "Новая строка/запись", "Форма", "Вручную"] },
      ]},
      { label: "Интеграции", fields: [
        { id: "apps", type: "toggles", label: "Сервисы, которые участвуют", items: [
          { id: "sheets", name: "Google Sheets", prompt: "Google Sheets (read/write rows)" },
          { id: "telegram", name: "Telegram", prompt: "Telegram (send messages/notifications)" },
          { id: "gmail", name: "Email / Gmail", prompt: "Email/Gmail (send or read mail)" },
          { id: "slack", name: "Slack", prompt: "Slack (post messages)" },
          { id: "notion", name: "Notion", prompt: "Notion (create/update pages)" },
          { id: "airtable", name: "Airtable", prompt: "Airtable (records)" },
          { id: "openai", name: "ИИ (OpenAI/Claude)", prompt: "An AI/LLM node to generate or classify text" },
          { id: "http", name: "HTTP-запрос к API", prompt: "An HTTP Request node to call an external API" },
          { id: "db", name: "База данных", prompt: "A database node (Postgres/MySQL)" },
          { id: "crm", name: "CRM", prompt: "A CRM (e.g. HubSpot/Bitrix) node" },
          { id: "discord", name: "Discord", prompt: "Discord (send messages)" },
          { id: "webhookout", name: "Webhook наружу", prompt: "An outgoing webhook to another service" },
        ]},
      ]},
      { label: "Логика", fields: [
        { id: "logic", type: "toggles", label: "Обработка данных", items: [
          { id: "filter", name: "Условие / фильтр", prompt: "Conditional branching (IF/Switch) and filtering" },
          { id: "transform", name: "Трансформация данных", prompt: "Data mapping/transformation between nodes" },
          { id: "loop", name: "Цикл по элементам", prompt: "Loop over items / batch processing" },
          { id: "merge", name: "Слияние веток", prompt: "Merge data from multiple branches" },
          { id: "dedupe", name: "Удаление дублей", prompt: "Deduplicate records" },
          { id: "delay", name: "Задержка / ожидание", prompt: "A wait/delay step" },
          { id: "error", name: "Обработка ошибок", prompt: "Error handling with retries and a fallback path" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L(`You are an automation expert. Design a complete ${T(v.platform, "n8n")} workflow and explain how to build it node by node.`,
          `Ты — эксперт по автоматизации. Спроектируй полный воркфлоу ${T(v.platform, "n8n")} и объясни, как собрать его узел за узлом.`),
        "",
        section(L("Goal", "Цель"),
          L(`The workflow should: ${T(v.task, "automate a process across apps")}.`,
            `Воркфлоу должен: ${T(v.task, "автоматизировать процесс между сервисами")}.`)),
        section(L("Trigger", "Триггер"),
          L(`Start the workflow with: ${T(v.trigger, "a webhook")}.`, `Запуск воркфлоу: ${T(v.trigger, "Webhook")}.`)),
        section(L("Apps & nodes", "Сервисы и узлы"), bullets(names(v.apps))),
        section(L("Logic & data handling", "Логика и обработка данных"), bullets(names(v.logic))),
        section(L("Requirements", "Требования"), bullets([
          L("List every node in order with its purpose and key settings", "Перечисли все узлы по порядку: назначение и ключевые настройки"),
          L("Explain field mappings between nodes", "Объясни маппинг полей между узлами"),
          L("Note required credentials/keys for each integration", "Укажи нужные креды/ключи для каждой интеграции"),
          L("If the platform supports JSON import, also provide the importable workflow JSON", "Если платформа поддерживает импорт JSON — приложи готовый для импорта JSON воркфлоу"),
        ])),
        L("Give a clear, step-by-step build guide.", "Дай чёткое пошаговое руководство по сборке."),
      ]);
    },
  },

  // ---- SQL / база данных ----
  {
    id: "sql", label: "SQL / база данных", icon: "database", desc: "SQL-запросы, схема, оптимизация",
    groups: [
      { label: "Задача", fields: [
        { id: "task", type: "text", label: "Что нужно от запроса", placeholder: "например: топ-10 клиентов по выручке за квартал" },
        { id: "dialect", type: "select", label: "СУБД / диалект", options: ["PostgreSQL", "MySQL", "SQLite", "SQL Server", "BigQuery", "Без предпочтений"] },
        { id: "schema", type: "textarea", label: "Схема / таблицы (опц.)", placeholder: "например: orders(id, user_id, amount, created_at), users(id, name)" },
      ]},
      { label: "Что использовать", fields: [
        { id: "ops", type: "toggles", label: "Приёмы", items: [
          { id: "joins", name: "JOIN-ы нескольких таблиц", prompt: "Joins across multiple tables" },
          { id: "agg", name: "Группировка и агрегаты", prompt: "GROUP BY with aggregate functions" },
          { id: "window", name: "Оконные функции", prompt: "Window functions (RANK, ROW_NUMBER, etc.)" },
          { id: "cte", name: "CTE / подзапросы", prompt: "CTEs (WITH) and subqueries" },
          { id: "filterdate", name: "Фильтры по датам", prompt: "Date range filtering" },
          { id: "schemagen", name: "Создать схему (DDL)", prompt: "Also generate the CREATE TABLE schema" },
          { id: "optimize", name: "Оптимизация / индексы", prompt: "Suggest indexes and optimize for performance" },
          { id: "explain", name: "Пояснить запрос", prompt: "Explain how the query works, step by step" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a senior database engineer and SQL expert.", "Ты — старший инженер БД и эксперт по SQL."),
        "",
        section(L("Task", "Задача"),
          L(`Write SQL to: ${T(v.task, "answer a data question")}.`, `Напиши SQL, чтобы: ${T(v.task, "ответить на вопрос по данным")}.`)),
        section(L("Database", "База данных"),
          L("Dialect: ", "Диалект: ") + (T(v.dialect) === "Без предпочтений" || !T(v.dialect) ? L("standard SQL", "стандартный SQL") : T(v.dialect))),
        T(v.schema) ? section(L("Schema", "Схема"), T(v.schema)) : "",
        section(L("Use", "Использовать"), bullets(names(v.ops))),
        section(L("Requirements", "Требования"), bullets([
          L("Correct, efficient and readable SQL", "Корректный, эффективный и читаемый SQL"),
          L("Use clear aliases and comments", "Понятные алиасы и комментарии"),
        ])),
        L("Return the SQL plus a short explanation.", "Верни SQL и краткое пояснение."),
      ]);
    },
  },

  // ---- Discord-бот ----
  {
    id: "discord", label: "Discord-бот", icon: "discord", desc: "Бот для Discord-сервера",
    groups: [
      { label: "Основа", fields: [
        { id: "purpose", type: "text", label: "Что делает бот", placeholder: "например: модерация и музыка для игрового сервера" },
        { id: "lang", type: "select", label: "Язык / библиотека", options: ["Python (discord.py)", "Node.js (discord.js)", "Без предпочтений"] },
      ]},
      { label: "Возможности", fields: [
        { id: "features", type: "toggles", label: "Функции бота", items: [
          { id: "slash", name: "Slash-команды", prompt: "Modern slash commands with options and autocomplete" },
          { id: "mod", name: "Модерация", prompt: "Moderation tools (kick, ban, mute, warn, auto-mod)" },
          { id: "roles", name: "Выдача ролей", prompt: "Reaction/button role assignment" },
          { id: "welcome", name: "Приветствие новичков", prompt: "Welcome messages for new members" },
          { id: "music", name: "Музыка в голосовом", prompt: "Music playback in voice channels" },
          { id: "levels", name: "Уровни и XP", prompt: "Leveling/XP system with a leaderboard" },
          { id: "tickets", name: "Тикеты поддержки", prompt: "A support-ticket system" },
          { id: "embeds", name: "Красивые embed-сообщения", prompt: "Rich embed messages" },
          { id: "logs", name: "Логи событий", prompt: "Event logging to a channel" },
          { id: "ai", name: "Ответы через ИИ", prompt: "AI chat responses via an LLM API" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert Discord bot developer. Build a complete, production-ready Discord bot.",
          "Ты — эксперт по Discord-ботам. Создай готового к продакшену бота для Discord."),
        "",
        section(L("Objective", "Цель"),
          L(`Create a Discord bot that ${T(v.purpose, "serves a community server")}.`,
            `Создай Discord-бота, который ${T(v.purpose, "обслуживает сообщество")}.`)),
        section(L("Implementation", "Реализация"), bullets([
          L("Library: ", "Библиотека: ") + (T(v.lang) === "Без предпочтений" || !T(v.lang) ? L("your best modern choice", "на твой выбор") : T(v.lang)),
          L("Token and IDs from environment variables", "Токен и ID — из переменных окружения"),
          L("Clean command structure with permission checks", "Чистая структура команд с проверкой прав"),
        ])),
        section(L("Features", "Функции"), bullets(names(v.features))),
        section(L("Deliverables", "Результат"),
          L("Full source by file, dependencies, and setup/run instructions.",
            "Полный код по файлам, зависимости и инструкция по запуску.")),
        L("Reply only with the implementation.", "В ответе — только реализация."),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: ИЗОБРАЖЕНИЕ
// =========================================================================
const IMG_END = (v) => {
  const out = [];
  if (T(v.aspect)) out.push(L("aspect ratio ", "соотношение сторон ") + T(v.aspect));
  if (T(v.quality)) out.push(T(v.quality).toLowerCase());
  return out;
};

const IMAGE_TYPES = [
  // ---- Иллюстрация ----
  {
    id: "illustration", label: "Иллюстрация", icon: "brush", desc: "Арт, концепт, диджитал-иллюстрация",
    groups: [
      { label: "Сюжет", fields: [
        { id: "subject", type: "text", label: "Что изображено", placeholder: "например: лиса в осеннем лесу" },
        { id: "setting", type: "text", label: "Окружение / фон (опц.)", placeholder: "например: туманное утро, золотые листья" },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Художественный стиль",
          options: ["Flat / вектор", "Аниме", "Акварель", "Концепт-арт", "Пиксель-арт", "3D-рендер", "Карандаш", "Поп-арт", "Изометрия"] },
        { id: "palette", type: "text", label: "Цветовая палитра (опц.)", placeholder: "например: тёплые охра и бордо" },
        { id: "mood", type: "segment", label: "Настроение", options: ["Уютное", "Драматичное", "Минималистичное", "Сказочное", "Мрачное", "Энергичное"] },
      ]},
      { label: "Параметры", fields: [
        { id: "aspect", type: "segment", label: "Соотношение сторон", options: ["1:1", "16:9", "9:16", "4:3", "3:2"] },
        { id: "quality", type: "segment", label: "Качество", options: ["Highly detailed", "Clean and simple"] },
        { id: "negative", type: "text", label: "Чего избегать (опц.)", placeholder: "например: текст, лишние пальцы" },
      ]},
    ],
    build(v) {
      const parts = [
        T(v.subject, L("a captivating subject", "выразительный сюжет")),
        T(v.setting),
        (T(v.style) ? T(v.style).toLowerCase() + L(" illustration style", " стиль иллюстрации") : L("digital illustration", "диджитал-иллюстрация")),
        (T(v.mood) ? T(v.mood).toLowerCase() + L(" mood", " настроение") : ""),
        (T(v.palette) ? L("color palette: ", "палитра: ") + T(v.palette) : ""),
        L("intricate composition, professional artwork, trending on ArtStation", "детальная композиция, профессиональный арт, ArtStation"),
        ...IMG_END(v),
      ].filter(Boolean);
      let out = joinComma(parts);
      if (T(v.negative)) out += "\n\n" + L("Avoid: ", "Избегать: ") + T(v.negative);
      return out;
    },
  },

  // ---- Фото ----
  {
    id: "photoreal", label: "Фото", icon: "camera", desc: "Фотореалистичные изображения",
    groups: [
      { label: "Сюжет", fields: [
        { id: "subject", type: "text", label: "Что на фото", placeholder: "например: чашка кофе на деревянном столе" },
        { id: "setting", type: "text", label: "Локация / фон (опц.)", placeholder: "например: уютное кафе у окна" },
      ]},
      { label: "Съёмка", fields: [
        { id: "lighting", type: "segment", label: "Свет", options: ["Естественный", "Золотой час", "Студийный", "Драматичный", "Неон", "Контровой"] },
        { id: "lens", type: "select", label: "Камера / объектив", options: ["50mm портретный", "35mm репортажный", "85mm с боке", "Макро", "Широкоугольный", "Без предпочтений"] },
        { id: "mood", type: "text", label: "Атмосфера (опц.)", placeholder: "например: спокойствие, утро" },
      ]},
      { label: "Параметры", fields: [
        { id: "aspect", type: "segment", label: "Соотношение сторон", options: ["1:1", "16:9", "9:16", "4:3", "3:2"] },
        { id: "quality", type: "segment", label: "Качество", options: ["Ultra detailed 8K", "Natural and soft"] },
        { id: "negative", type: "text", label: "Чего избегать (опц.)", placeholder: "например: размытость, водяные знаки" },
      ]},
    ],
    build(v) {
      const lensMap = {
        "50mm портретный": "shot on a 50mm lens", "35mm репортажный": "shot on a 35mm lens",
        "85mm с боке": "shot on an 85mm lens with creamy bokeh", "Макро": "macro photography, extreme close-up",
        "Широкоугольный": "wide-angle lens",
      };
      const parts = [
        L("Professional photograph of ", "профессиональное фото: ") + T(v.subject, L("a beautiful subject", "красивый объект")),
        T(v.setting),
        (T(v.lighting) ? T(v.lighting).toLowerCase() + L(" lighting", " свет") : ""),
        lensMap[T(v.lens)] || "",
        T(v.mood),
        L("photorealistic, sharp focus, high dynamic range, lifelike textures", "фотореализм, резкий фокус, широкий динамический диапазон, реалистичные текстуры"),
        ...IMG_END(v),
      ].filter(Boolean);
      let out = joinComma(parts);
      if (T(v.negative)) out += "\n\n" + L("Avoid: ", "Избегать: ") + T(v.negative);
      return out;
    },
  },

  // ---- Логотип ----
  {
    id: "logo", label: "Логотип", icon: "badge", desc: "Логотип и фирменный знак",
    groups: [
      { label: "Бренд", fields: [
        { id: "brand", type: "text", label: "Название бренда", placeholder: "например: Nova Coffee" },
        { id: "field", type: "text", label: "Сфера", placeholder: "например: сеть кофеен" },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Тип логотипа", options: ["Минималистичный", "Геометрический", "Винтажный", "Игривый", "Люкс / премиум", "Техно", "Рукописный"] },
        { id: "symbol", type: "text", label: "Идея символа (опц.)", placeholder: "например: зерно кофе + восход" },
        { id: "colors", type: "text", label: "Цвета (опц.)", placeholder: "например: тёмно-коричневый и кремовый" },
      ]},
    ],
    build(v) {
      const parts = [
        L('Minimal vector logo for "', 'минималистичный векторный логотип для «') + T(v.brand, L("a brand", "бренда")) + L('"', "»"),
        T(v.field) ? L("a ", "сфера: ") + T(v.field) : "",
        (T(v.style) ? T(v.style).toLowerCase() + L(" style", " стиль") : L("modern style", "современный стиль")),
        T(v.symbol) ? L("incorporating ", "обыграть символ: ") + T(v.symbol) : "",
        T(v.colors) ? L("colors: ", "цвета: ") + T(v.colors) : "",
        L("flat, scalable, memorable, on a plain background, professional branding", "плоский, масштабируемый, запоминающийся, на однотонном фоне, профессиональный брендинг"),
      ].filter(Boolean);
      return joinComma(parts);
    },
  },

  // ---- Персонаж ----
  {
    id: "character", label: "Персонаж", icon: "mask", desc: "Персонаж, аватар, маскот",
    groups: [
      { label: "Персонаж", fields: [
        { id: "who", type: "text", label: "Кто это", placeholder: "например: девушка-космонавт" },
        { id: "details", type: "textarea", label: "Внешность и детали", placeholder: "например: короткие рыжие волосы, серебристый скафандр, уверенный взгляд" },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Стиль", options: ["Аниме", "Картун", "Реализм", "3D", "Комикс", "Пиксель", "Чиби"] },
        { id: "shot", type: "segment", label: "Кадр", options: ["Портрет", "По пояс", "В полный рост"] },
        { id: "aspect", type: "segment", label: "Соотношение сторон", options: ["1:1", "9:16", "3:4"] },
      ]},
    ],
    build(v) {
      const shotMap = { "Портрет": "close-up portrait", "По пояс": "half-body shot", "В полный рост": "full-body shot" };
      const parts = [
        (shotMap[T(v.shot)] || "portrait") + L(" of ", ": ") + T(v.who, L("an original character", "оригинальный персонаж")),
        T(v.details),
        (T(v.style) ? T(v.style).toLowerCase() + L(" style", " стиль") : ""),
        L("highly detailed character design, expressive, clean background", "детальный дизайн персонажа, выразительный, чистый фон"),
        ...IMG_END(v),
      ].filter(Boolean);
      return joinComma(parts);
    },
  },

  // ---- 3D-рендер ----
  {
    id: "render3d", label: "3D-рендер", icon: "cube", desc: "3D-сцена, продукт, объект",
    groups: [
      { label: "Объект", fields: [
        { id: "subject", type: "text", label: "Что отрендерить", placeholder: "например: кроссовок будущего" },
        { id: "material", type: "text", label: "Материалы (опц.)", placeholder: "например: матовый пластик, стекло, металл" },
      ]},
      { label: "Сцена", fields: [
        { id: "style", type: "segment", label: "Стиль", options: ["Реалистичный", "Стилизованный", "Clay / глина", "Низкополигональный", "Изометрия"] },
        { id: "lighting", type: "segment", label: "Свет", options: ["Студийный", "Мягкий", "Драматичный", "Неон"] },
        { id: "bg", type: "text", label: "Фон (опц.)", placeholder: "например: градиент, подиум" },
        { id: "aspect", type: "segment", label: "Соотношение сторон", options: ["1:1", "16:9", "4:3"] },
      ]},
    ],
    build(v) {
      const parts = [
        L("3D render of ", "3D-рендер: ") + T(v.subject, L("a product", "продукт")),
        (T(v.style) ? T(v.style).toLowerCase() + L(" style", " стиль") : ""),
        (T(v.material) ? L("materials: ", "материалы: ") + T(v.material) : ""),
        (T(v.lighting) ? T(v.lighting).toLowerCase() + L(" lighting", " свет") : ""),
        (T(v.bg) ? L("background: ", "фон: ") + T(v.bg) : ""),
        L("octane render, high detail, soft shadows, product visualization", "octane render, высокая детализация, мягкие тени, продуктовая визуализация"),
        ...IMG_END(v),
      ].filter(Boolean);
      return joinComma(parts);
    },
  },

  // ---- UI / интерфейс ----
  {
    id: "uikit", label: "UI / интерфейс", icon: "layout", desc: "Концепт экрана, дизайн интерфейса",
    groups: [
      { label: "Экран", fields: [
        { id: "screen", type: "text", label: "Какой экран", placeholder: "например: дашборд аналитики, экран входа, главная приложения" },
        { id: "platform", type: "segment", label: "Платформа", options: ["Веб", "Мобильное", "Десктоп", "Планшет"] },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Визуальный стиль",
          options: ["Минимализм", "Глассморфизм", "Неоморфизм", "Material", "iOS / Human Interface", "Тёмная тема", "Брутализм", "Корпоративный"] },
        { id: "accent", type: "text", label: "Акцентный цвет (опц.)", placeholder: "например: индиго" },
        { id: "mood", type: "segment", label: "Характер", options: ["Спокойный", "Премиальный", "Дружелюбный", "Технологичный"] },
      ]},
      { label: "Элементы", fields: [
        { id: "elements", type: "toggles", label: "Что показать на экране", items: [
          { id: "nav", name: "Навигация / меню", prompt: "A navigation bar or menu" },
          { id: "sidebar", name: "Боковая панель", prompt: "A sidebar" },
          { id: "cards", name: "Карточки", prompt: "Content cards" },
          { id: "charts", name: "Графики / статистика", prompt: "Charts and stats widgets" },
          { id: "table", name: "Таблица данных", prompt: "A data table" },
          { id: "forms", name: "Формы / поля ввода", prompt: "Forms and input fields" },
          { id: "cta", name: "Кнопки действий", prompt: "Prominent action buttons" },
          { id: "avatar", name: "Профиль / аватар", prompt: "A user profile area with avatar" },
        ]},
        { id: "aspect", type: "segment", label: "Соотношение сторон", options: ["16:9", "4:3", "9:16", "1:1"] },
      ]},
    ],
    build(v) {
      const parts = [
        L("Clean UI design concept of ", "концепт UI-дизайна: ") + T(v.screen, L("an app screen", "экран приложения")),
        (T(v.platform) ? L("for ", "для ") + T(v.platform).toLowerCase() : ""),
        (T(v.style) ? T(v.style).toLowerCase() + L(" style", " стиль") : "modern style"),
        (T(v.mood) ? T(v.mood).toLowerCase() + L(" feel", " характер") : ""),
        (T(v.accent) ? L("accent color: ", "акцентный цвет: ") + T(v.accent) : ""),
        ...names(v.elements).map((s) => s.toLowerCase()),
        L("polished, modern interface, rounded corners, soft shadows, high-fidelity mockup, Dribbble shot", "аккуратный современный интерфейс, скругления, мягкие тени, hi-fi макет, Dribbble"),
        (T(v.aspect) ? L("aspect ratio ", "соотношение сторон ") + T(v.aspect) : ""),
      ].filter(Boolean);
      return joinComma(parts);
    },
  },

  // ---- Стикеры / иконки ----
  {
    id: "stickers", label: "Стикеры / иконки", icon: "sticker", desc: "Набор стикеров, иконок, эмодзи",
    groups: [
      { label: "Объект", fields: [
        { id: "subject", type: "text", label: "Что на стикере/иконке", placeholder: "например: милый кот, иконки для приложения погоды" },
        { id: "kind", type: "segment", label: "Тип", options: ["Стикер", "Иконка", "Эмодзи", "Маскот"] },
      ]},
      { label: "Стиль", fields: [
        { id: "style", type: "segment", label: "Стиль", options: ["Каваий / милый", "Флэт", "3D-глянец", "Контурный (line)", "Наклейка с обводкой", "Пиксель"] },
        { id: "colors", type: "text", label: "Цвета (опц.)", placeholder: "например: пастельные тона" },
        { id: "set", type: "segment", label: "Количество", options: ["Один", "Набор из нескольких", "Единый стиль-сет"] },
      ]},
    ],
    build(v) {
      const parts = [
        (T(v.kind) ? T(v.kind).toLowerCase() : "sticker") + L(" design of ", ": ") + T(v.subject, L("a cute character", "милый персонаж")),
        (T(v.style) ? T(v.style).toLowerCase() + L(" style", " стиль") : ""),
        (T(v.colors) ? L("colors: ", "цвета: ") + T(v.colors) : ""),
        (T(v.set) && T(v.set) !== "Один" ? L("a cohesive set with consistent style", "единый набор в одном стиле") : ""),
        L("clean vector look, bold outline, flat background, die-cut sticker, high detail, centered", "чистый вектор, жирная обводка, плоский фон, вырубной стикер, детально, по центру"),
      ].filter(Boolean);
      return joinComma(parts);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: ТЕКСТ
// =========================================================================
const TEXT_TYPES = [
  { id: "article", label: "Статья / SEO", icon: "doc", desc: "Блог, гайд, SEO-статья",
    groups: [
      { label: "Тема", fields: [
        { id: "topic", type: "text", label: "Тема статьи", placeholder: "например: как выбрать первый велосипед" },
        { id: "audience", type: "text", label: "Для кого", placeholder: "например: новички" },
        { id: "keywords", type: "text", label: "Ключевые слова (опц.)", placeholder: "например: велосипед, выбор, начинающим" },
      ]},
      { label: "Формат", fields: [
        { id: "tone", type: "segment", label: "Тон", options: ["Дружелюбный", "Экспертный", "Нейтральный", "Вдохновляющий"] },
        { id: "length", type: "segment", label: "Объём", options: ["Короткая (~500)", "Средняя (~1000)", "Подробная (~2000)"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "headings", name: "Подзаголовки", prompt: "Clear H2/H3 subheadings" },
          { id: "intro", name: "Цепляющее вступление", prompt: "An engaging introduction" },
          { id: "lists", name: "Списки", prompt: "Bulleted or numbered lists where helpful" },
          { id: "examples", name: "Примеры", prompt: "Concrete examples" },
          { id: "faq", name: "Блок FAQ", prompt: "A short FAQ section" },
          { id: "cta", name: "Призыв в конце", prompt: "A concluding call-to-action" },
          { id: "meta", name: "SEO meta-описание", prompt: "An SEO title and meta description" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert content writer and SEO specialist.", "Ты — эксперт по контенту и SEO."),
        "",
        section(L("Task", "Задача"),
          L(`Write an article about "${T(v.topic, "the given topic")}"` + (T(v.audience) ? ` for ${T(v.audience)}.` : "."),
            `Напиши статью на тему «${T(v.topic, "заданная тема")}»` + (T(v.audience) ? ` для аудитории: ${T(v.audience)}.` : "."))),
        section(L("Requirements", "Требования"), bullets([
          L("Tone: ", "Тон: ") + T(v.tone, L("engaging and clear", "увлекательный и понятный")),
          L("Length: ", "Объём: ") + T(v.length, L("medium", "средний")),
          T(v.keywords) ? L("Naturally include keywords: ", "Естественно вписать ключи: ") + T(v.keywords) : L("Optimize for relevant keywords", "Оптимизировать под релевантные ключи"),
          ...names(v.extras),
          L("Original, accurate, easy to read; avoid fluff", "Оригинально, точно, легко читается; без воды"),
        ])),
        L("Write the full article in well-formatted Markdown.", "Напиши полную статью в аккуратном Markdown."),
      ]);
    },
  },
  { id: "social", label: "Соцсети", icon: "megaphone", desc: "Посты для Instagram, Telegram, X",
    groups: [
      { label: "Пост", fields: [
        { id: "topic", type: "text", label: "О чём пост", placeholder: "например: запуск новой коллекции" },
        { id: "platform", type: "segment", label: "Платформа", options: ["Instagram", "Telegram", "X / Twitter", "LinkedIn", "TikTok", "VK"] },
        { id: "goal", type: "segment", label: "Цель", options: ["Вовлечение", "Продажа", "Информирование", "Подписка"] },
      ]},
      { label: "Стиль", fields: [
        { id: "tone", type: "segment", label: "Тон", options: ["Дружелюбный", "Дерзкий", "Экспертный", "Вдохновляющий"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "hook", name: "Сильный хук", prompt: "A scroll-stopping first line" },
          { id: "emoji", name: "Эмодзи", prompt: "Tasteful emojis" },
          { id: "hashtags", name: "Хэштеги", prompt: "A set of relevant hashtags" },
          { id: "cta", name: "Призыв к действию", prompt: "A clear call-to-action" },
          { id: "story", name: "Сторителлинг", prompt: "A short storytelling angle" },
          { id: "variants", name: "3 варианта", prompt: "Provide 3 distinct variants" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a senior social media copywriter.", "Ты — старший SMM-копирайтер."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.platform, "social media")} post about "${T(v.topic, "the topic")}".`,
            `Напиши пост для ${T(v.platform, "соцсетей")} на тему «${T(v.topic, "тема")}».`)),
        section(L("Requirements", "Требования"), bullets([
          L("Goal: ", "Цель: ") + T(v.goal, L("engagement", "вовлечение")),
          L("Tone: ", "Тон: ") + T(v.tone, L("friendly", "дружелюбный")),
          L("Fit the platform's format and best length", "Под формат и оптимальную длину платформы"),
          ...names(v.extras),
        ])),
        L("Write the post(s) ready to publish.", "Напиши пост(ы), готовые к публикации."),
      ]);
    },
  },
  { id: "sales", label: "Продающий текст", icon: "tag", desc: "Лендинг, оффер, описание товара",
    groups: [
      { label: "Продукт", fields: [
        { id: "product", type: "text", label: "Что продаём", placeholder: "например: онлайн-курс по фотографии" },
        { id: "audience", type: "text", label: "Аудитория", placeholder: "например: начинающие фотографы" },
        { id: "benefit", type: "textarea", label: "Ключевые выгоды", placeholder: "например: научитесь снимать как профи за 30 дней" },
      ]},
      { label: "Формат", fields: [
        { id: "format", type: "segment", label: "Что писать", options: ["Текст лендинга", "Короткий оффер", "Описание товара", "Рекламный текст"] },
        { id: "framework", type: "segment", label: "Формула", options: ["AIDA", "PAS", "На усмотрение"] },
        { id: "tone", type: "segment", label: "Тон", options: ["Энергичный", "Доверительный", "Премиальный"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are a world-class direct-response copywriter.", "Ты — копирайтер мирового уровня (direct-response)."),
        "",
        section(L("Task", "Задача"),
          L(`Write ${T(v.format, "persuasive copy")} for "${T(v.product, "the product")}"` + (T(v.audience) ? `, aimed at ${T(v.audience)}.` : "."),
            `Напиши ${T(v.format, "продающий текст")} для «${T(v.product, "продукт")}»` + (T(v.audience) ? `, для аудитории: ${T(v.audience)}.` : "."))),
        section(L("Key benefits", "Ключевые выгоды"), T(v.benefit, L("Highlight the strongest benefits.", "Подчеркни самые сильные выгоды."))),
        section(L("Requirements", "Требования"), bullets([
          T(v.framework) && T(v.framework) !== "На усмотрение" ? L("Use the " + T(v.framework) + " framework", "Используй формулу " + T(v.framework)) : L("Use the most fitting structure", "Используй самую подходящую структуру"),
          L("Tone: ", "Тон: ") + T(v.tone, L("confident and trustworthy", "уверенный и вызывающий доверие")),
          L("Strong headline, clear value, objection handling and a compelling CTA", "Сильный заголовок, ясная ценность, отработка возражений и убедительный призыв"),
          L("Concrete and benefit-driven; avoid empty hype", "Конкретика и выгоды; без пустого хайпа"),
        ])),
        L("Write the final copy, ready to use.", "Напиши финальный текст, готовый к использованию."),
      ]);
    },
  },
  { id: "email", label: "Письмо / рассылка", icon: "mail", desc: "Email, цепочка писем, рассылка",
    groups: [
      { label: "Письмо", fields: [
        { id: "goal", type: "text", label: "Цель письма", placeholder: "например: вернуть клиента, который не заходил месяц" },
        { id: "audience", type: "text", label: "Кому пишем", placeholder: "например: подписчики магазина" },
        { id: "type", type: "segment", label: "Тип", options: ["Продающее", "Приветственное", "Новость", "Реактивация", "Цепочка"] },
      ]},
      { label: "Стиль", fields: [
        { id: "tone", type: "segment", label: "Тон", options: ["Дружелюбный", "Деловой", "Энергичный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "subjects", name: "3 темы письма", prompt: "3 subject-line options" },
          { id: "preheader", name: "Прехедер", prompt: "A preheader line" },
          { id: "cta", name: "Кнопка-призыв", prompt: "A clear CTA button text" },
          { id: "ps", name: "Постскриптум", prompt: "A P.S. line" },
          { id: "short", name: "Кратко", prompt: "Keep it concise and scannable" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert email marketer.", "Ты — эксперт по email-маркетингу."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.type, "marketing")} email whose goal is to ${T(v.goal, "drive action")}.`,
            `Напиши ${T(v.type, "маркетинговое")} письмо, цель которого — ${T(v.goal, "побудить к действию")}.`) +
          (T(v.audience) ? L(` Audience: ${T(v.audience)}.`, ` Аудитория: ${T(v.audience)}.`) : "")),
        section(L("Requirements", "Требования"), bullets([
          L("Tone: ", "Тон: ") + T(v.tone, L("friendly", "дружелюбный")),
          ...names(v.extras),
          L("Persuasive, skimmable, with a single clear goal", "Убедительно, легко сканируется, одна ясная цель"),
        ])),
        L("Write the full email ready to send.", "Напиши готовое к отправке письмо."),
      ]);
    },
  },
  { id: "presentation", label: "Презентация", icon: "slides", desc: "Структура и текст слайдов",
    groups: [
      { label: "Тема", fields: [
        { id: "topic", type: "text", label: "Тема презентации", placeholder: "например: запуск нового продукта" },
        { id: "audience", type: "text", label: "Для кого", placeholder: "например: инвесторы, клиенты, команда" },
        { id: "slides", type: "segment", label: "Сколько слайдов", options: ["5–7", "8–12", "15+"] },
      ]},
      { label: "Формат", fields: [
        { id: "purpose", type: "segment", label: "Цель", options: ["Питч инвесторам", "Продажа", "Обучение", "Отчёт", "Доклад"] },
        { id: "tone", type: "segment", label: "Тон", options: ["Деловой", "Вдохновляющий", "Простой и ясный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "title", name: "Титульный слайд", prompt: "A title slide" },
          { id: "agenda", name: "Содержание / agenda", prompt: "An agenda slide" },
          { id: "problem", name: "Проблема и решение", prompt: "Problem and solution slides" },
          { id: "data", name: "Данные / графики", prompt: "Data slides with suggested charts" },
          { id: "notes", name: "Заметки спикера", prompt: "Speaker notes for each slide" },
          { id: "summary", name: "Итоги", prompt: "A summary slide" },
          { id: "cta", name: "Призыв / next steps", prompt: "A closing call-to-action / next steps slide" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert presentation designer and storyteller.", "Ты — эксперт по презентациям и сторителлингу."),
        "",
        section(L("Task", "Задача"),
          L(`Create a ${T(v.slides, "8–12")}-slide presentation about "${T(v.topic, "the topic")}"` + (T(v.audience) ? ` for ${T(v.audience)}.` : "."),
            `Создай презентацию на ${T(v.slides, "8–12")} слайдов на тему «${T(v.topic, "тема")}»` + (T(v.audience) ? ` для аудитории: ${T(v.audience)}.` : "."))),
        section(L("Requirements", "Требования"), bullets([
          L("Purpose: ", "Цель: ") + T(v.purpose, L("inform and persuade", "информировать и убедить")),
          L("Tone: ", "Тон: ") + T(v.tone, L("clear and engaging", "ясный и увлекательный")),
          ...names(v.extras),
          L("For each slide give a title and concise bullet content", "Для каждого слайда — заголовок и краткие тезисы"),
        ])),
        L("Output the full slide-by-slide outline with content.", "Выдай полную структуру слайд за слайдом с содержанием."),
      ]);
    },
  },
  { id: "resume", label: "Резюме / CV", icon: "resume", desc: "Резюме и сопроводительное письмо",
    groups: [
      { label: "О вас", fields: [
        { id: "role", type: "text", label: "Желаемая должность", placeholder: "например: продуктовый дизайнер" },
        { id: "background", type: "textarea", label: "Опыт и навыки", placeholder: "например: 4 года в UX, вёл редизайн приложения, Figma, аналитика" },
        { id: "job", type: "text", label: "Под какую вакансию (опц.)", placeholder: "например: вставьте требования из вакансии" },
      ]},
      { label: "Формат", fields: [
        { id: "style", type: "segment", label: "Формат", options: ["Современное", "Классическое", "Креативное"] },
        { id: "tone", type: "segment", label: "Тон", options: ["Уверенный", "Профессиональный", "Лаконичный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "summary", name: "Краткое саммари", prompt: "A strong professional summary" },
          { id: "metrics", name: "Достижения с цифрами", prompt: "Achievements quantified with metrics" },
          { id: "skills", name: "Блок навыков", prompt: "A skills section" },
          { id: "ats", name: "ATS-дружественное", prompt: "ATS-friendly formatting and keywords" },
          { id: "tailor", name: "Заточить под вакансию", prompt: "Tailor wording to the target job" },
          { id: "cover", name: "Сопроводительное письмо", prompt: "Also write a matching cover letter" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a professional resume writer and career coach.", "Ты — профессиональный составитель резюме и карьерный коуч."),
        "",
        section(L("Task", "Задача"),
          L(`Write a resume for the role of "${T(v.role, "the target role")}".`,
            `Составь резюме на должность «${T(v.role, "целевая должность")}».`)),
        section(L("Candidate background", "Опыт кандидата"), T(v.background, L("(use placeholders where details are missing)", "(где данных нет — оставь плейсхолдеры)"))),
        T(v.job) ? section(L("Target job requirements", "Требования вакансии"), T(v.job)) : "",
        section(L("Requirements", "Требования"), bullets([
          L("Format: ", "Формат: ") + T(v.style, L("modern", "современное")),
          L("Tone: ", "Тон: ") + T(v.tone, L("confident and professional", "уверенный и профессиональный")),
          ...names(v.extras),
          L("Clear sections, strong action verbs, no fluff", "Чёткие разделы, сильные глаголы действия, без воды"),
        ])),
        L("Output the finished, well-structured resume.", "Выдай готовое, хорошо структурированное резюме."),
      ]);
    },
  },
  { id: "youtube", label: "YouTube-сценарий", icon: "youtube", desc: "Сценарий для длинного видео",
    groups: [
      { label: "Видео", fields: [
        { id: "topic", type: "text", label: "Тема видео", placeholder: "например: обзор лучших ноутбуков 2025" },
        { id: "audience", type: "text", label: "Для кого", placeholder: "например: новички, выбирающие первый ноут" },
        { id: "duration", type: "segment", label: "Длительность", options: ["5–8 мин", "10–15 мин", "20+ мин"] },
      ]},
      { label: "Формат", fields: [
        { id: "format", type: "segment", label: "Тип ролика", options: ["Обзор", "Туториал", "Топ-лист", "Видео-эссе", "Влог", "Разбор кейса"] },
        { id: "tone", type: "segment", label: "Тон", options: ["Энергичный", "Экспертный", "Дружелюбный", "Развлекательный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "hook", name: "Хук-вступление", prompt: "A strong hook in the first 15 seconds" },
          { id: "intro", name: "Интро-самопрезентация", prompt: "A brief channel intro" },
          { id: "structure", name: "Чёткая структура / тайм-коды", prompt: "Clear sections with timestamps/chapters" },
          { id: "broll", name: "Подсказки по видеоряду (B-roll)", prompt: "B-roll and on-screen visual cues" },
          { id: "retention", name: "Удерживающие приёмы", prompt: "Retention tactics (open loops, pattern interrupts)" },
          { id: "cta", name: "Призыв (лайк/подписка)", prompt: "Calls-to-action (like, subscribe, comment)" },
          { id: "seo", name: "Заголовок + описание + теги", prompt: "An SEO title, description and tags" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a top YouTube scriptwriter and content strategist.", "Ты — топовый сценарист YouTube и контент-стратег."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.duration, "10–15 min")} ${T(v.format, "YouTube")} video script about "${T(v.topic, "the topic")}"` + (T(v.audience) ? ` for ${T(v.audience)}.` : "."),
            `Напиши сценарий ${T(v.format, "YouTube-видео")} на ${T(v.duration, "10–15 мин")} на тему «${T(v.topic, "тема")}»` + (T(v.audience) ? ` для аудитории: ${T(v.audience)}.` : "."))),
        section(L("Requirements", "Требования"), bullets([
          L("Tone: ", "Тон: ") + T(v.tone, L("energetic and clear", "энергичный и понятный")),
          L("Conversational, spoken-style narration", "Разговорный стиль, как для озвучки"),
          ...names(v.extras),
        ])),
        L("Write the full script with section headers and narration.", "Напиши полный сценарий с разделами и текстом озвучки."),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: ВИДЕО
// =========================================================================
const VIDEO_TYPES = [
  { id: "shortform", label: "Reels / Shorts", icon: "film", desc: "Сценарий для вертикального видео",
    groups: [
      { label: "Идея", fields: [
        { id: "topic", type: "text", label: "Тема ролика", placeholder: "например: 3 ошибки новичков в зале" },
        { id: "platform", type: "segment", label: "Платформа", options: ["Instagram Reels", "YouTube Shorts", "TikTok"] },
        { id: "duration", type: "segment", label: "Длина", options: ["15 сек", "30 сек", "60 сек"] },
      ]},
      { label: "Подача", fields: [
        { id: "tone", type: "segment", label: "Тон", options: ["Энергичный", "Экспертный", "Юмор", "Спокойный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "hook", name: "Хук в первые 3 сек", prompt: "A powerful 3-second hook" },
          { id: "shots", name: "Раскадровка по сценам", prompt: "A scene-by-scene shot list with timings" },
          { id: "onscreen", name: "Текст на экране", prompt: "On-screen text captions" },
          { id: "voiceover", name: "Текст озвучки", prompt: "Full voiceover script" },
          { id: "trend", name: "Трендовый формат", prompt: "Tie into a current trend or sound" },
          { id: "cta", name: "Призыв в конце", prompt: "A closing call-to-action" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a viral short-form video scriptwriter.", "Ты — сценарист вирусных коротких видео."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.duration, "30s")} ${T(v.platform, "short-form")} video script about "${T(v.topic, "the topic")}".`,
            `Напиши сценарий вертикального видео на ${T(v.duration, "30 сек")} для ${T(v.platform, "соцсетей")} на тему «${T(v.topic, "тема")}».`)),
        section(L("Requirements", "Требования"), bullets([
          L("Tone: ", "Тон: ") + T(v.tone, L("energetic", "энергичный")),
          L("Optimized for retention and replays", "Оптимизировано под удержание и повторные просмотры"),
          ...names(v.extras),
        ])),
        L("Format the script clearly with timecodes, visuals and voiceover.", "Оформи сценарий с таймкодами, видеорядом и озвучкой."),
      ]);
    },
  },
  { id: "explainer", label: "Explainer", icon: "clapper", desc: "Объясняющий / промо-ролик",
    groups: [
      { label: "Идея", fields: [
        { id: "product", type: "text", label: "Продукт / тема", placeholder: "например: приложение для медитаций" },
        { id: "audience", type: "text", label: "Аудитория", placeholder: "например: занятые люди 25–40" },
        { id: "duration", type: "segment", label: "Длина", options: ["30 сек", "60 сек", "90 сек"] },
      ]},
      { label: "Подача", fields: [
        { id: "goal", type: "segment", label: "Цель", options: ["Объяснить продукт", "Привлечь клиентов", "Презентация инвесторам"] },
        { id: "tone", type: "segment", label: "Тон", options: ["Дружелюбный", "Профессиональный", "Вдохновляющий"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are a professional explainer-video scriptwriter.", "Ты — профессиональный сценарист объясняющих роликов."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.duration, "60s")} explainer video script for "${T(v.product, "the product")}"` + (T(v.audience) ? `, aimed at ${T(v.audience)}.` : "."),
            `Напиши сценарий объясняющего ролика на ${T(v.duration, "60 сек")} для «${T(v.product, "продукт")}»` + (T(v.audience) ? `, для аудитории: ${T(v.audience)}.` : "."))),
        section(L("Requirements", "Требования"), bullets([
          L("Goal: ", "Цель: ") + T(v.goal, L("explain the product clearly", "понятно объяснить продукт")),
          L("Tone: ", "Тон: ") + T(v.tone, L("friendly", "дружелюбный")),
          L("Structure: hook → problem → solution → how it works → call-to-action", "Структура: хук → проблема → решение → как работает → призыв"),
          L("Include scene descriptions and voiceover, with timings", "Опиши сцены и озвучку с таймингами"),
        ])),
        L("Write the full script ready for production.", "Напиши полный сценарий, готовый к продакшену."),
      ]);
    },
  },
  { id: "adscript", label: "Рекламный ролик", icon: "play", desc: "Сценарий рекламы / промо",
    groups: [
      { label: "Идея", fields: [
        { id: "product", type: "text", label: "Что рекламируем", placeholder: "например: новый энергетик" },
        { id: "usp", type: "text", label: "Главное преимущество", placeholder: "например: без сахара, заряд на 6 часов" },
        { id: "duration", type: "segment", label: "Длина", options: ["15 сек", "30 сек", "60 сек"] },
      ]},
      { label: "Подача", fields: [
        { id: "style", type: "segment", label: "Стиль", options: ["Эмоциональный", "Юмор", "Динамичный", "Премиальный", "Проблема-решение"] },
        { id: "platform", type: "segment", label: "Где крутим", options: ["Соцсети", "YouTube", "ТВ", "Наружка / экраны"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are an award-winning ad creative and scriptwriter.", "Ты — креативщик и сценарист рекламы с наградами."),
        "",
        section(L("Task", "Задача"),
          L(`Write a ${T(v.duration, "30s")} ad script for "${T(v.product, "the product")}".`,
            `Напиши рекламный сценарий на ${T(v.duration, "30 сек")} для «${T(v.product, "продукт")}».`)),
        section(L("Requirements", "Требования"), bullets([
          T(v.usp) ? L("Key selling point: ", "Главное преимущество: ") + T(v.usp) : L("Lead with the strongest selling point", "Сделай упор на сильнейшем преимуществе"),
          L("Creative style: ", "Стиль: ") + T(v.style, L("dynamic", "динамичный")),
          L("Channel: ", "Площадка: ") + T(v.platform, L("social media", "соцсети")),
          L("Memorable concept, clear brand message and a strong CTA", "Запоминающаяся идея, ясное сообщение бренда и сильный призыв"),
          L("Include visuals, voiceover and on-screen text with timings", "Опиши видеоряд, озвучку и текст на экране с таймингами"),
        ])),
        L("Write the full ad script ready for production.", "Напиши полный рекламный сценарий, готовый к продакшену."),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: АУДИО / МУЗЫКА
// =========================================================================
const AUDIO_TYPES = [
  { id: "music", label: "Музыка", icon: "note", desc: "Промт для Suno / Udio и т.п.",
    groups: [
      { label: "Трек", fields: [
        { id: "genre", type: "text", label: "Жанр / стиль", placeholder: "например: lo-fi hip-hop, синтвейв" },
        { id: "mood", type: "segment", label: "Настроение", options: ["Спокойное", "Энергичное", "Грустное", "Эпичное", "Мечтательное", "Тёмное"] },
        { id: "theme", type: "text", label: "О чём трек (опц.)", placeholder: "например: ночная поездка по городу" },
      ]},
      { label: "Детали", fields: [
        { id: "instruments", type: "text", label: "Инструменты (опц.)", placeholder: "например: пианино, мягкие ударные, бас" },
        { id: "vocal", type: "segment", label: "Вокал", options: ["Без вокала", "Мужской", "Женский", "Хор"] },
        { id: "tempo", type: "segment", label: "Темп", options: ["Медленный", "Средний", "Быстрый"] },
        { id: "lyrics", type: "textarea", label: "Текст / тема куплета (опц.)", placeholder: "если нужен вокал — пара строк или тема" },
      ]},
    ],
    build(v) {
      const parts = [
        T(v.genre, L("instrumental track", "инструментальный трек")),
        (T(v.mood) ? T(v.mood).toLowerCase() + L(" mood", " настроение") : ""),
        (T(v.tempo) ? T(v.tempo).toLowerCase() + L(" tempo", " темп") : ""),
        (T(v.instruments) ? L("instruments: ", "инструменты: ") + T(v.instruments) : ""),
        (T(v.vocal) && T(v.vocal) !== "Без вокала" ? L(T(v.vocal).toLowerCase() + " vocals", T(v.vocal).toLowerCase() + " вокал") : L("instrumental, no vocals", "инструментал, без вокала")),
        (T(v.theme) ? L("theme: ", "тема: ") + T(v.theme) : ""),
        L("high quality, well mixed", "высокое качество, хороший микс"),
      ].filter(Boolean);
      let out = joinComma(parts);
      if (T(v.lyrics)) out += "\n\n" + L("Lyrics / theme:\n", "Текст / тема:\n") + T(v.lyrics);
      return out;
    },
  },
  { id: "voiceover", label: "Озвучка / голос", icon: "mic", desc: "Текст и стиль для TTS-озвучки",
    groups: [
      { label: "Озвучка", fields: [
        { id: "purpose", type: "text", label: "Для чего", placeholder: "например: озвучка ролика про кофейню" },
        { id: "script", type: "textarea", label: "Текст для озвучки", placeholder: "вставьте текст, который нужно озвучить" },
      ]},
      { label: "Голос", fields: [
        { id: "voice", type: "segment", label: "Голос", options: ["Мужской", "Женский", "Нейтральный"] },
        { id: "tone", type: "segment", label: "Подача", options: ["Тёплая", "Энергичная", "Деловая", "Дикторская", "Доверительная"] },
        { id: "pace", type: "segment", label: "Темп", options: ["Медленный", "Средний", "Быстрый"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are a professional voiceover director. Produce a natural, expressive voiceover.",
          "Ты — режиссёр озвучки. Сделай естественную выразительную озвучку."),
        "",
        section(L("Context", "Контекст"), L(`Voiceover for: ${T(v.purpose, "a short video")}.`, `Озвучка для: ${T(v.purpose, "короткого ролика")}.`)),
        section(L("Voice", "Голос"), bullets([
          L("Voice: ", "Голос: ") + T(v.voice, L("neutral", "нейтральный")),
          L("Delivery: ", "Подача: ") + T(v.tone, L("warm", "тёплая")),
          L("Pace: ", "Темп: ") + T(v.pace, L("medium", "средний")),
        ])),
        section(L("Script", "Текст"), T(v.script, L("(paste the script here)", "(вставьте текст)"))),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: АССИСТЕНТ (промты для самих нейросетей)
// =========================================================================
const ASSISTANT_TYPES = [
  { id: "system", label: "Системный промт", icon: "persona", desc: "Роль / персона для ИИ-ассистента",
    groups: [
      { label: "Роль", fields: [
        { id: "role", type: "text", label: "Кем должен быть ассистент", placeholder: "например: дружелюбный нутрициолог" },
        { id: "domain", type: "text", label: "Область экспертизы", placeholder: "например: питание и здоровые привычки" },
        { id: "audience", type: "text", label: "С кем общается (опц.)", placeholder: "например: новички без мед. образования" },
      ]},
      { label: "Поведение", fields: [
        { id: "tone", type: "segment", label: "Тон", options: ["Дружелюбный", "Профессиональный", "Лаконичный", "Сократический", "Поддерживающий"] },
        { id: "rules", type: "toggles", label: "Правила и стиль ответов", items: [
          { id: "character", name: "Всегда оставаться в роли", prompt: "Always stay in character and never break role" },
          { id: "clarify", name: "Уточнять, если непонятно", prompt: "Ask clarifying questions when the request is ambiguous" },
          { id: "steps", name: "Объяснять по шагам", prompt: "Explain reasoning step by step when helpful" },
          { id: "examples", name: "Приводить примеры", prompt: "Provide concrete examples" },
          { id: "cite", name: "Ссылаться на источники", prompt: "Cite sources or note uncertainty" },
          { id: "concise", name: "Без воды", prompt: "Be concise and avoid filler" },
          { id: "markdown", name: "Форматировать в Markdown", prompt: "Format answers in clean Markdown" },
          { id: "refuse", name: "Не уходить от темы", prompt: "Politely decline off-topic or out-of-scope requests" },
          { id: "safety", name: "Безопасность / дисклеймеры", prompt: "Add safety disclaimers for sensitive advice" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("Generate a high-quality system prompt for an AI assistant, ready to paste into the system field.",
          "Сгенерируй качественный системный промт для ИИ-ассистента, готовый вставить в system-поле."),
        "",
        section(L("Role", "Роль"),
          L(`You are ${T(v.role, "a helpful expert assistant")}` + (T(v.domain) ? `, specialized in ${T(v.domain)}.` : "."),
            `Ты — ${T(v.role, "полезный экспертный ассистент")}` + (T(v.domain) ? `, специализируешься на: ${T(v.domain)}.` : "."))),
        T(v.audience) ? section(L("Audience", "Аудитория"), L(`You talk to ${T(v.audience)}.`, `Ты общаешься с: ${T(v.audience)}.`)) : "",
        section(L("Tone", "Тон"), T(v.tone, L("friendly and clear", "дружелюбный и понятный"))),
        section(L("Behavior rules", "Правила поведения"), bullets(names(v.rules))),
        L("Write the final system prompt as a clear instruction block (second person, imperative).",
          "Выдай финальный системный промт чётким блоком инструкций (на «ты», в повелительном наклонении)."),
      ]);
    },
  },
  { id: "analyze", label: "Анализ текста", icon: "scan", desc: "Промт для разбора текста / документа",
    groups: [
      { label: "Задача", fields: [
        { id: "goal", type: "segment", label: "Что сделать с текстом", options: ["Краткое саммари", "Ключевые тезисы", "Критика / разбор", "Перевод", "Переписать", "Тональность", "Извлечь данные"] },
        { id: "about", type: "text", label: "Что за текст (опц.)", placeholder: "например: договор, отзыв клиента, статья" },
      ]},
      { label: "Формат вывода", fields: [
        { id: "format", type: "segment", label: "Как оформить ответ", options: ["Списком", "Абзацем", "Таблицей", "JSON"] },
        { id: "length", type: "segment", label: "Объём", options: ["Очень кратко", "Средне", "Подробно"] },
        { id: "extras", type: "toggles", label: "Дополнительно", items: [
          { id: "tone", name: "Сохранить исходный тон", prompt: "Preserve the original tone" },
          { id: "risks", name: "Подсветить риски / проблемы", prompt: "Highlight risks or problems" },
          { id: "actions", name: "Дать рекомендации / шаги", prompt: "Suggest action items or next steps" },
          { id: "quotes", name: "Приводить цитаты", prompt: "Support points with short quotes" },
          { id: "lang", name: "Ответ на русском", prompt: "Answer in Russian regardless of input language" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert analyst. Process the text the user provides as instructed below.",
          "Ты — эксперт-аналитик. Обработай текст, который даст пользователь, по инструкции ниже."),
        "",
        section(L("Task", "Задача"),
          L(`${T(v.goal, "Summarize")} the provided text` + (T(v.about) ? ` (${T(v.about)}).` : "."),
            `${T(v.goal, "Сделай саммари")} предоставленного текста` + (T(v.about) ? ` (${T(v.about)}).` : "."))),
        section(L("Output", "Формат вывода"), bullets([
          L("Format: ", "Формат: ") + T(v.format, L("bullet list", "список")),
          L("Length: ", "Объём: ") + T(v.length, L("medium", "средне")),
          ...names(v.extras),
        ])),
        L("Wait for the user's text, then return only the result.", "Жди текст пользователя, затем верни только результат."),
        "",
        L("--- USER TEXT BELOW ---", "--- ТЕКСТ ПОЛЬЗОВАТЕЛЯ НИЖЕ ---"),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: БИЗНЕС
// =========================================================================
const BUSINESS_TYPES = [
  { id: "bizplan", label: "Бизнес-план", icon: "briefcase", desc: "Структурированный план для идеи",
    groups: [
      { label: "Идея", fields: [
        { id: "idea", type: "text", label: "Бизнес-идея", placeholder: "например: сервис доставки здоровой еды" },
        { id: "market", type: "text", label: "Рынок / гео", placeholder: "например: Москва, аудитория 25–40" },
        { id: "stage", type: "segment", label: "Стадия", options: ["Идея", "Запуск", "Есть продажи", "Масштабирование"] },
      ]},
      { label: "Что включить", fields: [
        { id: "parts", type: "toggles", label: "Разделы плана", items: [
          { id: "summary", name: "Резюме проекта", prompt: "An executive summary" },
          { id: "audience", name: "Целевая аудитория", prompt: "Target audience and segments" },
          { id: "competitors", name: "Анализ конкурентов", prompt: "Competitor analysis" },
          { id: "model", name: "Модель монетизации", prompt: "Revenue/business model" },
          { id: "marketing", name: "Маркетинг и каналы", prompt: "Marketing and acquisition channels" },
          { id: "finance", name: "Финансы и точка безубыточности", prompt: "Basic financials and break-even estimate" },
          { id: "risks", name: "Риски", prompt: "Key risks and mitigations" },
          { id: "roadmap", name: "Дорожная карта", prompt: "A step-by-step roadmap" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a seasoned startup advisor and business strategist.", "Ты — опытный стартап-советник и бизнес-стратег."),
        "",
        section(L("Task", "Задача"),
          L(`Write a practical business plan for: ${T(v.idea, "the business idea")}.`, `Составь практичный бизнес-план для: ${T(v.idea, "бизнес-идея")}.`) +
          (T(v.market) ? L(` Market: ${T(v.market)}.`, ` Рынок: ${T(v.market)}.`) : "") +
          (T(v.stage) ? L(` Stage: ${T(v.stage)}.`, ` Стадия: ${T(v.stage)}.`) : "")),
        section(L("Include sections", "Включить разделы"), bullets(names(v.parts))),
        section(L("Requirements", "Требования"), bullets([
          L("Concrete, realistic and actionable — avoid generic advice", "Конкретно, реалистично, применимо — без общих слов"),
          L("Use clear structure with headings", "Чёткая структура с заголовками"),
        ])),
        L("Output the full business plan in Markdown.", "Выдай полный бизнес-план в Markdown."),
      ]);
    },
  },
  { id: "marketing", label: "Маркетинг-стратегия", icon: "target", desc: "План продвижения продукта",
    groups: [
      { label: "Продукт", fields: [
        { id: "product", type: "text", label: "Продукт / услуга", placeholder: "например: онлайн-школа английского" },
        { id: "audience", type: "text", label: "Аудитория", placeholder: "например: взрослые 25–45" },
        { id: "goal", type: "segment", label: "Главная цель", options: ["Узнаваемость", "Лиды / продажи", "Удержание", "Запуск нового продукта"] },
      ]},
      { label: "Каналы", fields: [
        { id: "channels", type: "toggles", label: "Каналы продвижения", items: [
          { id: "social", name: "Соцсети (SMM)", prompt: "Organic social media (SMM)" },
          { id: "ads", name: "Платная реклама", prompt: "Paid ads (targeting, search, retargeting)" },
          { id: "content", name: "Контент-маркетинг / SEO", prompt: "Content marketing and SEO" },
          { id: "email", name: "Email-маркетинг", prompt: "Email marketing funnels" },
          { id: "influencers", name: "Блогеры / инфлюенсеры", prompt: "Influencer partnerships" },
          { id: "video", name: "Видео (YouTube/Reels)", prompt: "Short and long-form video" },
          { id: "referral", name: "Реферальная программа", prompt: "Referral/word-of-mouth program" },
          { id: "partnerships", name: "Партнёрства", prompt: "Strategic partnerships" },
        ]},
        { id: "budget", type: "segment", label: "Бюджет", options: ["Минимальный", "Средний", "Большой"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are a senior marketing strategist.", "Ты — старший маркетинг-стратег."),
        "",
        section(L("Task", "Задача"),
          L(`Create a marketing strategy for "${T(v.product, "the product")}"` + (T(v.audience) ? `, targeting ${T(v.audience)}.` : "."),
            `Создай маркетинг-стратегию для «${T(v.product, "продукт")}»` + (T(v.audience) ? `, аудитория: ${T(v.audience)}.` : "."))),
        section(L("Parameters", "Параметры"), bullets([
          L("Primary goal: ", "Главная цель: ") + T(v.goal, L("growth", "рост")),
          L("Budget level: ", "Бюджет: ") + T(v.budget, L("medium", "средний")),
          L("Channels: ", "Каналы: ") + (names(v.channels).length ? joinComma(names(v.channels)) : L("recommend the best mix", "предложи лучший микс")),
        ])),
        section(L("Requirements", "Требования"), bullets([
          L("Positioning, key messages and a channel-by-channel plan", "Позиционирование, ключевые сообщения и план по каждому каналу"),
          L("Concrete tactics, a simple funnel and KPIs to track", "Конкретные тактики, простая воронка и KPI"),
          L("A 90-day action plan", "План действий на 90 дней"),
        ])),
        L("Output the strategy in clear, structured Markdown.", "Выдай стратегию в структурированном Markdown."),
      ]);
    },
  },
  { id: "naming", label: "Нейминг и слоган", icon: "bulb", desc: "Названия бренда и слоганы",
    groups: [
      { label: "Бренд", fields: [
        { id: "about", type: "text", label: "О продукте / бренде", placeholder: "например: приложение для медитаций" },
        { id: "values", type: "text", label: "Характер / ценности", placeholder: "например: спокойствие, простота, забота" },
        { id: "audience", type: "text", label: "Аудитория (опц.)", placeholder: "например: занятые горожане" },
      ]},
      { label: "Что нужно", fields: [
        { id: "want", type: "toggles", label: "Сгенерировать", items: [
          { id: "names", name: "10+ вариантов названия", prompt: "10+ brand name ideas in varied styles" },
          { id: "slogan", name: "Слоганы / тэглайны", prompt: "Several slogan/tagline options" },
          { id: "domain", name: "Свободные домены", prompt: "Likely-available .com domain suggestions" },
          { id: "explain", name: "Пояснение смысла", prompt: "A short rationale for each name" },
          { id: "tone", name: "Разные тональности", prompt: "Options across playful, premium and minimal tones" },
        ]},
        { id: "style", type: "segment", label: "Стиль названий", options: ["Короткие и звучные", "Описательные", "Выдуманные слова", "Метафоры"] },
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert brand naming specialist and copywriter.", "Ты — эксперт по неймингу и копирайтер."),
        "",
        section(L("Task", "Задача"),
          L(`Generate brand naming for: ${T(v.about, "the brand")}.`, `Придумай нейминг для: ${T(v.about, "бренд")}.`) +
          (T(v.values) ? L(` Character/values: ${T(v.values)}.`, ` Характер/ценности: ${T(v.values)}.`) : "") +
          (T(v.audience) ? L(` Audience: ${T(v.audience)}.`, ` Аудитория: ${T(v.audience)}.`) : "")),
        section(L("Deliver", "Выдать"), bullets(names(v.want))),
        section(L("Style", "Стиль"), T(v.style, L("short and memorable", "короткие и запоминающиеся"))),
        section(L("Requirements", "Требования"), bullets([
          L("Easy to pronounce, distinctive, not generic", "Легко произносятся, отличаются, не банальны"),
          L("Group the options and present them in a clean list", "Сгруппируй варианты и подай аккуратным списком"),
        ])),
        L("Output the naming options.", "Выдай варианты нейминга."),
      ]);
    },
  },
];

// =========================================================================
//  КАТЕГОРИЯ: ОБУЧЕНИЕ
// =========================================================================
const LEARNING_TYPES = [
  { id: "explain", label: "Объяснить тему", icon: "bulb", desc: "Понятное объяснение чего угодно",
    groups: [
      { label: "Тема", fields: [
        { id: "topic", type: "text", label: "Что объяснить", placeholder: "например: как работает блокчейн" },
        { id: "level", type: "segment", label: "Уровень", options: ["Как ребёнку (ELI5)", "Новичок", "Средний", "Продвинутый"] },
      ]},
      { label: "Как объяснить", fields: [
        { id: "style", type: "segment", label: "Подача", options: ["Простыми словами", "С аналогиями", "С примерами", "Строго и точно"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "analogy", name: "Аналогия из жизни", prompt: "A relatable real-life analogy" },
          { id: "example", name: "Конкретный пример", prompt: "A concrete worked example" },
          { id: "steps", name: "Разбор по шагам", prompt: "A step-by-step breakdown" },
          { id: "mistakes", name: "Частые заблуждения", prompt: "Common misconceptions to avoid" },
          { id: "visual", name: "Описать схему/визуал", prompt: "Describe a simple diagram or mental model" },
          { id: "summary", name: "Краткий итог (TL;DR)", prompt: "A short TL;DR summary" },
          { id: "quiz", name: "3 вопроса на проверку", prompt: "3 quick check-yourself questions" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are a brilliant teacher who makes complex things simple.", "Ты — блестящий преподаватель, который объясняет сложное просто."),
        "",
        section(L("Task", "Задача"),
          L(`Explain "${T(v.topic, "the topic")}" at a ${T(v.level, "beginner")} level.`,
            `Объясни «${T(v.topic, "тема")}» на уровне «${T(v.level, "новичок")}».`)),
        section(L("Approach", "Подача"), T(v.style, L("plain language", "простыми словами"))),
        section(L("Include", "Включить"), bullets(names(v.extras))),
        section(L("Requirements", "Требования"), bullets([
          L("Clear, engaging and accurate; build up from basics", "Понятно, увлекательно и точно; от основ к сложному"),
          L("Avoid unexplained jargon", "Без необъяснённого жаргона"),
        ])),
        L("Write the explanation.", "Напиши объяснение."),
      ]);
    },
  },
  { id: "studyplan", label: "План обучения", icon: "calendar", desc: "Дорожная карта изучения навыка",
    groups: [
      { label: "Цель", fields: [
        { id: "skill", type: "text", label: "Что хочу освоить", placeholder: "например: Python для анализа данных" },
        { id: "level", type: "segment", label: "Текущий уровень", options: ["С нуля", "Кое-что знаю", "Средний"] },
        { id: "time", type: "segment", label: "Сколько времени есть", options: ["1 час/день", "2–3 часа/день", "Выходные", "Интенсив"] },
      ]},
      { label: "Формат", fields: [
        { id: "horizon", type: "segment", label: "Срок", options: ["2 недели", "1 месяц", "3 месяца"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "weekly", name: "Разбивка по неделям", prompt: "A week-by-week breakdown" },
          { id: "resources", name: "Ресурсы и материалы", prompt: "Recommended resources (courses, books, docs)" },
          { id: "projects", name: "Практические проекты", prompt: "Hands-on projects to build" },
          { id: "milestones", name: "Контрольные точки", prompt: "Milestones to track progress" },
          { id: "practice", name: "Задания на практику", prompt: "Exercises to practice each topic" },
          { id: "pitfalls", name: "Чего избегать", prompt: "Common pitfalls for beginners" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert learning coach and curriculum designer.", "Ты — эксперт-наставник и методист."),
        "",
        section(L("Task", "Задача"),
          L(`Create a ${T(v.horizon, "1-month")} study plan to learn "${T(v.skill, "the skill")}".`,
            `Составь план обучения на ${T(v.horizon, "1 месяц")} для освоения «${T(v.skill, "навык")}».`)),
        section(L("Learner", "Ученик"), bullets([
          L("Current level: ", "Текущий уровень: ") + T(v.level, L("beginner", "с нуля")),
          L("Available time: ", "Время: ") + T(v.time, L("1 hour/day", "1 час/день")),
        ])),
        section(L("Include", "Включить"), bullets(names(v.extras))),
        section(L("Requirements", "Требования"), bullets([
          L("Realistic pacing and a clear progression", "Реалистичный темп и понятная прогрессия"),
          L("Practical and motivating", "Практично и мотивирующе"),
        ])),
        L("Output the structured plan.", "Выдай структурированный план."),
      ]);
    },
  },
  { id: "quiz", label: "Тест / квиз", icon: "quiz", desc: "Вопросы для проверки знаний",
    groups: [
      { label: "Тема", fields: [
        { id: "topic", type: "text", label: "Тема теста", placeholder: "например: основы маркетинга" },
        { id: "count", type: "segment", label: "Сколько вопросов", options: ["5", "10", "20"] },
        { id: "difficulty", type: "segment", label: "Сложность", options: ["Лёгкий", "Средний", "Сложный", "Смешанный"] },
      ]},
      { label: "Формат", fields: [
        { id: "kind", type: "segment", label: "Тип вопросов", options: ["С вариантами (тест)", "Верно/неверно", "Открытые", "Смешанный"] },
        { id: "extras", type: "toggles", label: "Включить", items: [
          { id: "answers", name: "Ответы в конце", prompt: "An answer key at the end" },
          { id: "explain", name: "Пояснения к ответам", prompt: "A short explanation for each answer" },
          { id: "scoring", name: "Шкала оценки", prompt: "A scoring scale / interpretation" },
          { id: "progressive", name: "По нарастанию сложности", prompt: "Order questions from easy to hard" },
        ]},
      ]},
    ],
    build(v) {
      return compose([
        L("You are an expert quiz and assessment designer.", "Ты — эксперт по составлению тестов."),
        "",
        section(L("Task", "Задача"),
          L(`Create a ${T(v.count, "10")}-question quiz on "${T(v.topic, "the topic")}".`,
            `Составь тест из ${T(v.count, "10")} вопросов по теме «${T(v.topic, "тема")}».`)),
        section(L("Format", "Формат"), bullets([
          L("Question type: ", "Тип вопросов: ") + T(v.kind, L("multiple choice", "с вариантами")),
          L("Difficulty: ", "Сложность: ") + T(v.difficulty, L("mixed", "смешанная")),
          ...names(v.extras),
        ])),
        section(L("Requirements", "Требования"), bullets([
          L("Clear, unambiguous questions with plausible options", "Чёткие однозначные вопросы с правдоподобными вариантами"),
          L("Cover the topic well and avoid trick wording", "Хорошо покрой тему, без подвоха в формулировках"),
        ])),
        L("Output the quiz.", "Выдай тест."),
      ]);
    },
  },
];

// =========================================================================
//  УСИЛИТЕЛЬ ПРОМТОВ — профессиональные стандарты под категорию
//  level: "short" (без усиления) | "normal" (стандарт) | "max" (максимум)
// =========================================================================
function enrichPrompt(catId, level) {
  level = level || "normal";
  if (level === "short") return ""; // «Кратко» — только базовая заготовка

  // Для картинок и аудио промт — это описательная строка, усиливаем мягко.
  if (catId === "image") {
    let s = "\n\n" + L(
      "Technical quality: ultra-detailed, sharp focus, professional lighting, masterpiece, coherent anatomy and geometry, clean edges, no artifacts. If a tool supports it, you may append parameters like --ar and quality flags.",
      "Качество: максимально детально, резкий фокус, профессиональный свет, шедевр, корректная анатомия и геометрия, чистые края, без артефактов. Если инструмент поддерживает — можно добавить параметры вроде --ar и флаги качества.");
    if (level === "max") s += "\n\n" + L("Then provide 2 alternative variations of this prompt with different mood or composition.",
      "Затем дай 2 альтернативных варианта этого промта с другим настроением или композицией.");
    return s;
  }
  if (catId === "audio") {
    let s = "\n\n" + L("Production quality: well-mixed, balanced, professional and cohesive in style.",
      "Качество: хороший микс, баланс, профессионально и цельно по стилю.");
    if (level === "max") s += " " + L("Offer 2 stylistic variations.", "Предложи 2 стилистических варианта.");
    return s;
  }

  const blocks = [];
  if (catId === "code") {
    blocks.push(section(L("Quality bar", "Планка качества"), bullets([
      L("Production-quality, modular code with clear names and a logical file structure", "Код продакшен-уровня: модульный, с понятными именами и логичной структурой файлов"),
      L("Handle errors, edge cases and empty/loading states", "Обрабатывай ошибки, граничные случаи и пустые/загрузочные состояния"),
      L("Follow security best practices; never hardcode secrets or keys", "Соблюдай безопасность; не хардкодь секреты и ключи"),
      L("Concise comments for non-obvious logic; consistent formatting", "Краткие комментарии к неочевидной логике; единый стиль форматирования"),
    ])));
    blocks.push(section(L("How to respond", "Как отвечать"),
      L("First briefly state your assumptions and the planned file structure, then provide the complete, runnable code. For anything unspecified, choose sensible modern defaults and note them. Make it work end-to-end.",
        "Сначала кратко укажи допущения и планируемую структуру файлов, затем выдай полный рабочий код. Для неуказанного выбери разумные современные значения по умолчанию и отметь их. Должно работать от и до.")));
  } else if (catId === "text" || catId === "business") {
    blocks.push(section(L("Quality bar", "Планка качества"), bullets([
      L("Original, specific and accurate — no clichés, padding or empty hype", "Оригинально, конкретно и точно — без клише, воды и пустого хайпа"),
      L("Match the audience's language, level and intent", "Под язык, уровень и намерение аудитории"),
      L("Active voice, smooth flow and a logical structure", "Активный залог, плавность и логичная структура"),
      L("Where details are missing, use realistic placeholders in [brackets]", "Где данных нет — реалистичные плейсхолдеры в [скобках]"),
    ])));
  } else if (catId === "video") {
    blocks.push(section(L("Quality bar", "Планка качества"), bullets([
      L("Grab attention in the first seconds and keep tight pacing", "Зацепи в первые секунды и держи плотный темп"),
      L("Native to the platform; spoken, natural language", "Под формат площадки; живой разговорный язык"),
      L("Format as a clear table/blocks: time · visuals · voiceover · on-screen text", "Оформи таблицей/блоками: время · видеоряд · озвучка · текст на экране"),
    ])));
  } else if (catId === "assistant") {
    blocks.push(section(L("Quality bar", "Планка качества"), bullets([
      L("Make the prompt robust, unambiguous and self-contained", "Сделай промт надёжным, однозначным и самодостаточным"),
      L("Anticipate edge cases and tell the model how to handle them", "Предусмотри краевые случаи и опиши, как их обрабатывать"),
    ])));
  } else if (catId === "learning") {
    blocks.push(section(L("Quality bar", "Планка качества"), bullets([
      L("Accurate, clear and genuinely helpful for the learner", "Точно, понятно и реально полезно для ученика"),
      L("Concrete examples over abstract description", "Конкретные примеры вместо абстракций"),
    ])));
  }

  // «Максимум» — дополнительная глубина
  if (level === "max") {
    if (catId === "code") {
      blocks.push(section(L("Go further", "Сверх того"), bullets([
        L("Briefly note 1–2 alternative approaches and why you chose this one", "Кратко отметь 1–2 альтернативных подхода и почему выбран этот"),
        L("Add instructions to run and test it locally", "Добавь инструкции по локальному запуску и проверке"),
        L("Suggest sensible next improvements", "Предложи разумные следующие улучшения"),
      ])));
    } else if (catId === "text" || catId === "business") {
      blocks.push(section(L("Go further", "Сверх того"), bullets([
        L("Provide 2 distinct variations to choose from", "Дай 2 разных варианта на выбор"),
        L("Add a short note on why this approach works", "Кратко поясни, почему этот подход работает"),
      ])));
    } else if (catId === "video") {
      blocks.push(section(L("Go further", "Сверх того"),
        L("Also give 2 alternative hook options for the opening.", "Также дай 2 альтернативных хука для начала.")));
    } else if (catId === "assistant") {
      blocks.push(section(L("Go further", "Сверх того"),
        L("Include one short example interaction showing the assistant in action.", "Добавь один короткий пример диалога, показывающий ассистента в деле.")));
    } else if (catId === "learning") {
      blocks.push(section(L("Go further", "Сверх того"),
        L("End with 3 quick self-check questions and suggested next steps.", "Заверши 3 вопросами для самопроверки и следующими шагами.")));
    }
  }
  return blocks.length ? "\n\n" + blocks.join("\n") : "";
}

// =========================================================================
//  ИТОГОВАЯ КОНФИГУРАЦИЯ
// =========================================================================
const CATEGORIES = [
  { id: "code", label: "Код", icon: "code", desc: "Сайты, боты, агенты, n8n, SQL, игры", types: CODE_TYPES },
  { id: "image", label: "Изображение", icon: "image", desc: "Иллюстрации, фото, логотипы, 3D, UI", types: IMAGE_TYPES },
  { id: "text", label: "Текст", icon: "text", desc: "Статьи, посты, письма, презентации, резюме", types: TEXT_TYPES },
  { id: "video", label: "Видео", icon: "video", desc: "Reels, explainer, реклама, YouTube", types: VIDEO_TYPES },
  { id: "audio", label: "Аудио", icon: "audio", desc: "Музыка и озвучка", types: AUDIO_TYPES },
  { id: "assistant", label: "Ассистент", icon: "assistant", desc: "Системные промты и анализ текста", types: ASSISTANT_TYPES },
  { id: "business", label: "Бизнес", icon: "briefcase", desc: "Бизнес-план, маркетинг, нейминг", types: BUSINESS_TYPES },
  { id: "learning", label: "Обучение", icon: "book", desc: "Объяснения, планы обучения, тесты", types: LEARNING_TYPES },
];
