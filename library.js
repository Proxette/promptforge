/* =========================================================================
   PromptForge — Библиотека готовых промтов.
   Источники: prompts.chat / awesome-chatgpt-prompts (CC0) + авторские.
   Каждый промт: { id, group, title(ru), desc(ru), prompt(en) }
   Плейсхолдеры в [квадратных скобках] пользователь заменяет под себя.
   ========================================================================= */
const LIBRARY_GROUPS = [
  { id: "writing", label: "Письмо и текст", icon: "text" },
  { id: "code", label: "Код", icon: "code" },
  { id: "marketing", label: "Маркетинг", icon: "megaphone" },
  { id: "career", label: "Карьера", icon: "briefcase" },
  { id: "learning", label: "Обучение", icon: "book" },
  { id: "productivity", label: "Продуктивность", icon: "bolt" },
  { id: "creative", label: "Творчество", icon: "brush" },
  { id: "image", label: "Изображения", icon: "image" },
];

const LIBRARY = [
  // ---------- Письмо и текст ----------
  {
    id: "translator", group: "writing", title: "Переводчик и улучшитель текста",
    desc: "Переводит на английский и делает текст красивее и грамотнее",
    prompt: `I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning the same, but make them more literary. I want you to only reply with the correction and the improvements, and nothing else — do not write explanations. My first sentence is:\n\n"[your text]"`,
  },
  {
    id: "proofreader", group: "writing", title: "Корректор / редактор",
    desc: "Вычитывает текст: орфография, грамматика, стиль",
    prompt: `I want you to act as a proofreader and editor. I will provide you with a text and I want you to review it for any spelling, grammar, punctuation or style mistakes. After reviewing, give me: (1) the corrected version of the text, and (2) a short bullet list of the main issues you fixed and why. Keep my original tone and voice. Here is the text:\n\n"[paste your text]"`,
  },
  {
    id: "rewrite", group: "writing", title: "Переписать в нужном тоне",
    desc: "Перепишет текст под выбранный стиль и аудиторию",
    prompt: `Rewrite the following text to be [more professional / friendlier / more concise / more persuasive], for an audience of [audience]. Keep the core meaning, improve clarity and flow, remove fluff, and use active voice. Return only the rewritten text.\n\nText:\n"[paste your text]"`,
  },
  {
    id: "summarize", group: "writing", title: "Краткое саммари",
    desc: "Сжимает длинный текст до сути с ключевыми тезисами",
    prompt: `Summarize the text below. Provide: (1) a one-sentence TL;DR, (2) 3–5 key bullet points, and (3) any action items or conclusions. Be accurate and concise; do not add information that isn't in the text.\n\nText:\n"[paste your text]"`,
  },

  // ---------- Код ----------
  {
    id: "linux", group: "code", title: "Linux-терминал",
    desc: "ИИ ведёт себя как терминал Linux",
    prompt: `I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. Do not write explanations. Do not type commands unless I instruct you to do so. When I need to tell you something in English I will do so by putting text inside curly brackets {like this}. My first command is pwd.`,
  },
  {
    id: "jsconsole", group: "code", title: "JavaScript-консоль",
    desc: "ИИ ведёт себя как консоль JS",
    prompt: `I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. Do not write explanations. Do not type commands unless I instruct you to do so. When I need to tell you something in English I will do so by putting text inside curly brackets {like this}. My first command is console.log("Hello World");`,
  },
  {
    id: "explaincode", group: "code", title: "Объяснить код",
    desc: "Разберёт чужой код построчно простыми словами",
    prompt: `Act as a senior software engineer. Explain the following code to me clearly: (1) what it does overall, (2) a step-by-step walkthrough of the key parts, (3) any bugs, edge cases or bad practices you notice, and (4) suggestions to improve it. Use simple language.\n\n\`\`\`\n[paste your code]\n\`\`\``,
  },
  {
    id: "debug", group: "code", title: "Найти и исправить баг",
    desc: "Помогает отладить ошибку в коде",
    prompt: `Act as an expert debugger. I have a bug. Here is my code, the expected behavior, and the actual error.\n\nCode:\n\`\`\`\n[paste code]\n\`\`\`\nExpected: [what should happen]\nActual / error: [paste the error or wrong behavior]\n\nFind the root cause, explain it simply, and give me the corrected code with the fix highlighted.`,
  },
  {
    id: "regex", group: "code", title: "Регулярные выражения",
    desc: "Сгенерирует и объяснит regex под задачу",
    prompt: `Act as a regex expert. I need a regular expression that [describe what to match]. Examples that SHOULD match: [examples]. Examples that should NOT match: [examples]. Give me the regex, explain each part, and show how to use it in [JavaScript/Python].`,
  },
  {
    id: "reviewcode", group: "code", title: "Code review",
    desc: "Ревью кода: качество, баги, улучшения",
    prompt: `Act as a senior engineer doing a thorough code review. Review the code below for correctness, readability, performance, security and best practices. List issues by severity (critical / major / minor) with a brief explanation and a concrete suggested fix for each. End with an overall assessment.\n\n\`\`\`\n[paste your code]\n\`\`\``,
  },

  // ---------- Маркетинг ----------
  {
    id: "advertiser", group: "marketing", title: "Рекламная кампания",
    desc: "Придумает кампанию для продукта",
    prompt: `I want you to act as an advertiser. You will create a campaign to promote a product or service of my choosing. You will choose a target audience, develop key messages and slogans, select the media channels for promotion, and decide on any additional activities needed to reach the goals. My product is: [product], the target audience is [audience], and the budget is [budget]. Provide the full campaign plan.`,
  },
  {
    id: "coldemail", group: "marketing", title: "Холодное письмо",
    desc: "Цепляющее B2B/продажное письмо",
    prompt: `Act as a top B2B copywriter. Write a short, personalized cold email to [recipient/role] at a [type of company]. My offer: [what you sell] which helps them [main benefit]. Keep it under 120 words, lead with a relevant hook (not about me), make one clear ask, and add 2 alternative subject lines. Avoid spammy hype.`,
  },
  {
    id: "socialcalendar", group: "marketing", title: "Контент-план на месяц",
    desc: "План постов для соцсетей",
    prompt: `Act as a social media strategist. Create a 1-month content calendar for [brand/product] on [platform], aimed at [audience]. Goal: [awareness/sales/engagement]. Give me a weekly table with: post idea, format (reel/carousel/text), hook, and a call-to-action. Mix educational, entertaining and promotional posts (roughly 3:1).`,
  },
  {
    id: "seobrief", group: "marketing", title: "SEO-бриф для статьи",
    desc: "Структура и ключи для статьи под поиск",
    prompt: `Act as an SEO content strategist. For the target keyword "[keyword]" and audience [audience], create an article brief: search intent, a compelling H1, a full H2/H3 outline, key questions to answer, related keywords to include, suggested word count, and a meta title + description. Make it genuinely useful, not keyword-stuffed.`,
  },

  // ---------- Карьера ----------
  {
    id: "interviewer", group: "career", title: "Интервьюер (тренировка)",
    desc: "Проводит собеседование на вакансию",
    prompt: `I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position [position]. I want you to only reply as the interviewer. Do not write the whole conversation at once. Ask me the questions one by one like a real interviewer and wait for my answers. After the interview, give me feedback on my answers. My first sentence is "Hi".`,
  },
  {
    id: "coverletter", group: "career", title: "Сопроводительное письмо",
    desc: "Письмо под конкретную вакансию",
    prompt: `Act as a professional career writer. Write a tailored cover letter for the role of [position] at [company]. Here is my background: [paste your experience / resume highlights]. Here is the job description: [paste key requirements]. Make it confident but not arrogant, connect my experience to their needs, keep it under one page, and avoid clichés.`,
  },
  {
    id: "careercoach", group: "career", title: "Карьерный коуч",
    desc: "Помощь с выбором и развитием в карьере",
    prompt: `Act as a career counselor. I am [your situation: role, experience, what you enjoy and dislike]. I'm considering [your question or options]. Ask me up to 3 clarifying questions first, then give me honest, structured advice: realistic paths, skills to build, and concrete next steps for the next 90 days.`,
  },
  {
    id: "resumebullets", group: "career", title: "Усилить пункты резюме",
    desc: "Переписывает опыт в сильные достижения",
    prompt: `Act as an expert resume writer. Rewrite the following job responsibilities into strong, achievement-focused resume bullet points. Use action verbs, quantify impact where possible (use realistic [placeholders] if numbers are missing), and keep each bullet to one line. Here is my experience:\n\n[paste your responsibilities]`,
  },

  // ---------- Обучение ----------
  {
    id: "eli5", group: "learning", title: "Объясни как ребёнку (ELI5)",
    desc: "Простое объяснение сложной темы",
    prompt: `Explain [topic] to me like I'm 5 years old. Use a simple real-life analogy, avoid jargon, and keep it short. Then add one slightly more advanced paragraph for when I'm ready to go deeper. End with a one-line summary.`,
  },
  {
    id: "tutor", group: "learning", title: "Персональный репетитор",
    desc: "Учит теме пошагово, с проверкой",
    prompt: `Act as my personal tutor for [subject/topic]. My current level is [beginner/intermediate]. Teach me step by step: explain one concept at a time in plain language, give a concrete example, then ask me a quick question to check my understanding before moving on. Wait for my answer each time. Start now.`,
  },
  {
    id: "socratic", group: "learning", title: "Сократический метод",
    desc: "Развивает мышление через вопросы",
    prompt: `I want you to act using the Socratic method. I will state a belief or opinion, and you will question my reasoning with one thoughtful question at a time to help me examine it more deeply. Do not give your own opinions or answers — only ask questions, one at a time, and respond to what I say. My statement is: "[your belief]"`,
  },
  {
    id: "studyplanlib", group: "learning", title: "План обучения навыку",
    desc: "Дорожная карта изучения с нуля",
    prompt: `Act as an expert learning coach. Create a study plan to learn [skill] in [timeframe], starting from [current level], with about [hours] per day available. Give a week-by-week breakdown, recommended free resources, hands-on projects, milestones to track progress, and common beginner pitfalls to avoid.`,
  },

  // ---------- Продуктивность ----------
  {
    id: "promptimprover", group: "productivity", title: "Улучшить мой промт",
    desc: "Превращает сырую идею в сильный промт",
    prompt: `Act as a world-class prompt engineer. I will give you a rough prompt or idea, and you will rewrite it into a clear, detailed, high-quality prompt that gets great results from an AI. Add relevant context, a role, constraints, and the desired output format. If important details are missing, ask me up to 3 questions first. My rough prompt is:\n\n"[your idea]"`,
  },
  {
    id: "excel", group: "productivity", title: "Текстовый Excel",
    desc: "ИИ ведёт себя как таблица Excel",
    prompt: `I want you to act as a text-based excel. You will only reply to me with the text-based 10-row excel sheet with row numbers and cell letters as columns (A to L). The first column header should be empty to reference the row number. I will tell you what to write into cells and you'll reply only with the result of the excel table as text, and nothing else. Do not write explanations. First, reply to me with an empty sheet.`,
  },
  {
    id: "meetingnotes", group: "productivity", title: "Резюме встречи",
    desc: "Из заметок/транскрипта — итоги и задачи",
    prompt: `Act as an executive assistant. From the meeting notes/transcript below, produce: (1) a concise summary, (2) key decisions made, (3) action items as a table with owner and deadline (use [TBD] if unknown), and (4) open questions. Be accurate and don't invent details.\n\nNotes:\n[paste notes or transcript]`,
  },
  {
    id: "decision", group: "productivity", title: "Помощь в решении",
    desc: "Взвесить варианты и принять решение",
    prompt: `Act as a sharp, unbiased decision-making advisor. I need to decide: [your decision]. Here are the options: [options] and what matters to me: [your priorities/constraints]. Lay out the key trade-offs in a pros/cons table, flag risks I might be missing, and end with a clear recommendation and why.`,
  },
  {
    id: "emailreply", group: "productivity", title: "Ответ на письмо",
    desc: "Грамотный ответ на полученное письмо",
    prompt: `Act as my communication assistant. Write a [polite/firm/friendly] reply to the email below. My goal: [what you want from the reply]. Keep it clear and professional, address their main points, and end with a clear next step. Match a [neutral/warm] tone.\n\nEmail received:\n[paste the email]`,
  },

  // ---------- Творчество ----------
  {
    id: "storyteller", group: "creative", title: "Рассказчик историй",
    desc: "Сочиняет увлекательные истории",
    prompt: `I want you to act as a storyteller. Come up with an entertaining, imaginative and captivating story that engages the audience. It can be a fairy tale, an educational story, or any other type. The topic is [topic], the audience is [who it's for], and the desired length/tone is [short and funny / epic / heartfelt]. Begin the story.`,
  },
  {
    id: "screenwriter", group: "creative", title: "Сценарист",
    desc: "Пишет сценарий для фильма/ролика",
    prompt: `I want you to act as a screenwriter. Develop an engaging and creative script for a [feature film / short / web series] based on this premise: [premise]. Create compelling characters, the setting, dialogue and a clear story arc. Start with the opening scene, formatted as a proper screenplay.`,
  },
  {
    id: "comedian", group: "creative", title: "Стендап-комик",
    desc: "Смешной монолог на тему",
    prompt: `I want you to act as a stand-up comedian. I will give you a topic and you will write a short, witty stand-up bit about it — observational humor, relatable and clever, not offensive. The topic is: [topic].`,
  },
  {
    id: "brainstorm", group: "creative", title: "Мозговой штурм идей",
    desc: "Генерирует много нестандартных идей",
    prompt: `Act as a creative brainstorming partner. Generate 15 diverse ideas for [your goal/problem]. Mix safe, bold and unconventional options. For each idea give a one-line description. After the list, pick the 3 you think are strongest and explain why.`,
  },

  // ---------- Изображения ----------
  {
    id: "mjphoto", group: "image", title: "Midjourney — фотореализм",
    desc: "Готовый промт для фотореалистичного фото",
    prompt: `[subject], [setting/background], cinematic photograph, shot on 85mm lens, soft natural lighting, shallow depth of field, ultra detailed, photorealistic, high dynamic range, professional color grading --ar 16:9 --style raw --v 6`,
  },
  {
    id: "mjlogo", group: "image", title: "Логотип — минимализм",
    desc: "Промт для чистого векторного логотипа",
    prompt: `minimalist vector logo for "[brand name]", [industry], [symbol idea], flat design, simple geometric shapes, [color] and white, on a plain white background, scalable, professional branding, high contrast --no realistic photo details --v 6`,
  },
  {
    id: "mjillustration", group: "image", title: "Иллюстрация — диджитал-арт",
    desc: "Промт для атмосферной иллюстрации",
    prompt: `[subject] in [setting], digital illustration, [mood] atmosphere, [art style e.g. studio ghibli / flat / watercolor], rich colors, detailed, beautiful lighting, intricate composition, trending on ArtStation --ar 3:2 --v 6`,
  },
  {
    id: "mjavatar", group: "image", title: "Аватар персонажа",
    desc: "Промт для портрета персонажа",
    prompt: `close-up portrait of [character description], [art style], expressive eyes, detailed face, soft studio lighting, clean background, highly detailed character design, professional --ar 1:1 --v 6`,
  },
];
