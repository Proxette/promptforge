/* =========================================================================
   PromptForge — логика интерфейса
   ========================================================================= */
(function () {
  "use strict";

  const CHECK = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const HISTORY_KEY = "pf_history";
  const FAV_KEY = "pf_favorites";
  const THEME_KEY = "pf_theme";
  const DETAILS = [
    { id: "short", label: "Кратко" },
    { id: "normal", label: "Норма" },
    { id: "max", label: "Максимум" },
  ];

  const stage = document.getElementById("stage");
  const stepsNav = document.getElementById("steps");

  const state = { step: 0, category: null, type: null, values: {}, lang: "en", detail: "normal" };

  // ---------------- утилиты ----------------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function go(step) { state.step = step; render(); }
  function findCategory(id) { return CATEGORIES.find((c) => c.id === id); }
  function findType(cat, id) { return cat ? cat.types.find((t) => t.id === id) : null; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function resolveValues() {
    const out = {};
    state.type.groups.forEach((g) =>
      g.fields.forEach((f) => {
        if (f.type === "toggles") {
          const sel = state.values[f.id] || [];
          out[f.id] = f.items.filter((it) => sel.includes(it.id));
        } else out[f.id] = state.values[f.id] || "";
      })
    );
    return out;
  }

  function buildPrompt() {
    setLang(state.lang);
    let p = state.type.build(resolveValues());
    p += enrichPrompt(state.category.id, state.detail);
    const custom = (state.values.__custom || "").trim();
    if (custom) p += "\n\n## " + (state.lang === "ru" ? "Дополнительно" : "Additional notes") + "\n" + custom;
    return p;
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
  }
  function download(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function openInChat(target, text) {
    const prompt = text != null ? text : buildPrompt();
    await copyText(prompt);
    const enc = encodeURIComponent(prompt);
    const urls = {
      chatgpt: "https://chatgpt.com/?q=" + enc,
      claude: "https://claude.ai/new?q=" + enc,
      gemini: "https://gemini.google.com/app",
    };
    window.open(urls[target] || urls.chatgpt, "_blank", "noopener");
    toast(target === "gemini" ? "Промт скопирован — вставьте в чат" : "Открываю чат (промт также скопирован)");
  }

  // ---------------- индикатор шагов ----------------
  function renderSteps() {
    stepsNav.querySelectorAll(".step").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === state.step);
      btn.classList.toggle("is-done", i < state.step);
      const reachable = i === 0 || (i === 1 && state.category) || (i === 2 && state.type) || (i === 3 && state.type);
      btn.disabled = i > state.step && !reachable;
      btn.querySelector("i").textContent = i < state.step ? "✓" : i + 1;
      btn.onclick = () => { if (i <= state.step || reachable) go(i); };
    });
  }

  // ---------------- ШАГ 0: главная (категории + глобальный поиск + недавнее) ----------------
  function renderCategory() {
    const panel = el(`
      <div class="panel">
        <div class="panel__head">
          <div class="panel__title">Что создаём?</div>
          <div class="panel__hint">Выберите категорию или найдите тип поиском.</div>
        </div>
        <div class="search"><span class="search__ic">${iconSvg("search")}</span><input type="text" placeholder="Поиск по всем типам: сайт, логотип, резюме, n8n…" /></div>
        <div class="search-results" hidden></div>
        <div class="home-default">
          <div class="cards"></div>
          <div class="recent" hidden></div>
        </div>
      </div>`);

    const grid = panel.querySelector(".cards");
    CATEGORIES.forEach((cat, i) => {
      const card = el(`
        <button class="card ${state.category === cat ? "is-selected" : ""}" style="--d:${i * 35}ms">
          <span class="card__ic">${iconSvg(cat.icon)}</span>
          <div class="card__name">${cat.label}</div>
          <div class="card__desc">${cat.desc}</div>
        </button>`);
      card.onclick = () => {
        if (state.category !== cat) { state.category = cat; state.type = null; state.values = {}; }
        go(1);
      };
      grid.appendChild(card);
    });

    // недавнее
    const recent = panel.querySelector(".recent");
    const hist = load(HISTORY_KEY).slice(0, 5);
    if (hist.length) {
      recent.hidden = false;
      recent.appendChild(el(`<div class="recent__label">Недавнее</div>`));
      const row = el(`<div class="recent__chips"></div>`);
      hist.forEach((item) => {
        const chip = el(`<button class="chip">${esc(item.typeLabel)}</button>`);
        chip.onclick = () => openSnapshot(item);
        row.appendChild(chip);
      });
      recent.appendChild(row);
    }

    // глобальный поиск по всем типам
    const input = panel.querySelector(".search input");
    const results = panel.querySelector(".search-results");
    const home = panel.querySelector(".home-default");
    const index = [];
    CATEGORIES.forEach((cat) => cat.types.forEach((tp) => index.push({ cat, tp, text: (tp.label + " " + tp.desc + " " + cat.label).toLowerCase() })));

    input.oninput = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.hidden = true; home.hidden = false; return; }
      home.hidden = true; results.hidden = false; results.innerHTML = "";
      const found = index.filter((x) => x.text.includes(q));
      if (!found.length) { results.appendChild(el(`<div class="empty-note">Ничего не найдено</div>`)); return; }
      const cg = el(`<div class="cards"></div>`);
      found.slice(0, 24).forEach((x) => {
        const card = el(`
          <button class="card" style="--d:0ms">
            <span class="card__ic">${iconSvg(x.tp.icon)}</span>
            <div class="card__name">${x.tp.label}</div>
            <div class="card__desc">${x.cat.label} · ${x.tp.desc}</div>
          </button>`);
        card.onclick = () => {
          state.category = x.cat; state.type = x.tp; state.values = {};
          go(2);
        };
        cg.appendChild(card);
      });
      results.appendChild(cg);
    };

    stage.appendChild(panel);
  }

  // ---------------- ШАГ 1: тип (с поиском) ----------------
  function renderType() {
    const cat = state.category;
    const panel = el(`
      <div class="panel">
        <div class="panel__head">
          <div class="panel__title"><span class="title-ic">${iconSvg(cat.icon)}</span> ${cat.label} → выберите тип</div>
          <div class="panel__hint">У каждого типа своя заготовка промта.</div>
        </div>
        <div class="search"><span class="search__ic">${iconSvg("search")}</span><input type="text" placeholder="Поиск по типам…" /></div>
        <div class="cards"></div>
        <div class="empty-note" hidden>Ничего не найдено</div>
        <div class="panel__foot"><button class="btn btn--ghost" data-back>← Назад</button><span></span></div>
      </div>`);
    const grid = panel.querySelector(".cards");
    cat.types.forEach((tp, i) => {
      const card = el(`
        <button class="card ${state.type === tp ? "is-selected" : ""}" style="--d:${i * 30}ms" data-search="${esc((tp.label + " " + tp.desc).toLowerCase())}">
          <span class="card__ic">${iconSvg(tp.icon)}</span>
          <div class="card__name">${tp.label}</div>
          <div class="card__desc">${tp.desc}</div>
        </button>`);
      card.onclick = () => { if (state.type !== tp) { state.type = tp; state.values = {}; } go(2); };
      grid.appendChild(card);
    });
    const input = panel.querySelector(".search input");
    const note = panel.querySelector(".empty-note");
    input.oninput = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      grid.querySelectorAll(".card").forEach((c) => {
        const ok = !q || c.dataset.search.includes(q);
        c.style.display = ok ? "" : "none"; if (ok) visible++;
      });
      note.hidden = visible > 0;
    };
    panel.querySelector("[data-back]").onclick = () => go(0);
    stage.appendChild(panel);
  }

  // ---------------- ШАГ 2: настройки + живой предпросмотр ----------------
  function renderSettings() {
    const tp = state.type;
    const panel = el(`
      <div class="panel">
        <div class="panel__head">
          <div class="panel__title"><span class="title-ic">${iconSvg(tp.icon)}</span> ${tp.label} — настройки</div>
          <div class="panel__hint">Отметьте нужное — промт справа обновляется в реальном времени.</div>
        </div>
        <div class="settings-wrap">
          <div class="settings-main">
            <div class="groups"></div>
            <div class="panel__foot">
              <button class="btn btn--ghost" data-back>← Назад</button>
              <button class="btn btn--primary" data-next>Готово →</button>
            </div>
          </div>
          <aside class="preview">
            <div class="preview__head">
              <span class="preview__title">Предпросмотр</span>
              <div class="lang-switch sm">
                <button data-plang="en" class="${state.lang === "en" ? "is-on" : ""}">EN</button>
                <button data-plang="ru" class="${state.lang === "ru" ? "is-on" : ""}">RU</button>
              </div>
            </div>
            <div class="detail-switch"></div>
            <div class="preview__body" data-prev></div>
            <button class="btn btn--sm btn--primary preview__copy" data-pcopy>Копировать</button>
          </aside>
        </div>
      </div>`);

    const groups = panel.querySelector(".groups");
    const prevBody = panel.querySelector("[data-prev]");
    const update = () => { prevBody.textContent = buildPrompt(); };

    tp.groups.forEach((group) => {
      const gEl = el(`<div class="group"><div class="group__label">${group.label}</div></div>`);
      group.fields.forEach((field) => gEl.appendChild(renderField(field, update)));
      groups.appendChild(gEl);
    });
    const customG = el(`<div class="group"><div class="group__label">Своими словами</div></div>`);
    customG.appendChild(renderField({
      id: "__custom", type: "textarea",
      label: "Любые детали и пожелания, которых нет выше (попадут в промт как есть)",
      placeholder: "например: добавь блок с таймером акции, обязательно тёплые тона…",
    }, update));
    groups.appendChild(customG);

    // уровень детализации
    const ds = panel.querySelector(".detail-switch");
    DETAILS.forEach((d) => {
      const b = el(`<button class="${state.detail === d.id ? "is-on" : ""}">${d.label}</button>`);
      b.onclick = () => {
        state.detail = d.id;
        ds.querySelectorAll("button").forEach((x) => x.classList.remove("is-on"));
        b.classList.add("is-on"); update();
      };
      ds.appendChild(b);
    });

    panel.querySelectorAll("[data-plang]").forEach((b) => (b.onclick = () => {
      state.lang = b.dataset.plang;
      panel.querySelectorAll("[data-plang]").forEach((x) => x.classList.toggle("is-on", x.dataset.plang === state.lang));
      update();
    }));
    panel.querySelector("[data-pcopy]").onclick = async (e) => {
      await copyText(buildPrompt()); toast("Промт скопирован");
      e.currentTarget.textContent = "✓ Скопировано";
      setTimeout(() => (e.currentTarget.textContent = "Копировать"), 1500);
    };

    panel.querySelector("[data-back]").onclick = () => go(1);
    panel.querySelector("[data-next]").onclick = () => go(3);

    update();
    stage.appendChild(panel);
  }

  function renderField(field, onChange) {
    const fire = () => { if (onChange) onChange(); };
    if (field.type === "toggles") {
      const wrap = el(`<div class="field"><div class="field__label">${field.label}</div><div class="toggles"></div></div>`);
      const box = wrap.querySelector(".toggles");
      const selected = state.values[field.id] || (state.values[field.id] = []);
      field.items.forEach((item) => {
        const t = el(`
          <div class="toggle ${selected.includes(item.id) ? "is-on" : ""}">
            <div class="toggle__box">${CHECK}</div>
            <div class="toggle__text"><div class="toggle__name">${item.name}</div></div>
          </div>`);
        t.onclick = () => {
          const idx = selected.indexOf(item.id);
          if (idx >= 0) selected.splice(idx, 1); else selected.push(item.id);
          t.classList.toggle("is-on"); fire();
        };
        box.appendChild(t);
      });
      return wrap;
    }
    if (field.type === "segment") {
      const wrap = el(`<div class="field"><div class="field__label">${field.label}</div><div class="segment"></div></div>`);
      const seg = wrap.querySelector(".segment");
      field.options.forEach((opt) => {
        const b = el(`<button class="${state.values[field.id] === opt ? "is-on" : ""}">${opt}</button>`);
        b.onclick = () => {
          if (state.values[field.id] === opt) { state.values[field.id] = ""; b.classList.remove("is-on"); }
          else {
            state.values[field.id] = opt;
            seg.querySelectorAll("button").forEach((x) => x.classList.remove("is-on"));
            b.classList.add("is-on");
          }
          fire();
        };
        seg.appendChild(b);
      });
      return wrap;
    }
    if (field.type === "select") {
      const wrap = el(`<div class="field"><label class="field__label">${field.label}</label></div>`);
      const sel = el(`<select></select>`);
      sel.appendChild(el(`<option value="">— выбрать —</option>`));
      field.options.forEach((opt) => sel.appendChild(el(`<option ${state.values[field.id] === opt ? "selected" : ""}>${opt}</option>`)));
      sel.onchange = () => { state.values[field.id] = sel.value; fire(); };
      wrap.appendChild(sel); return wrap;
    }
    if (field.type === "textarea") {
      const wrap = el(`<div class="field"><label class="field__label">${field.label}</label></div>`);
      const ta = el(`<textarea placeholder="${esc(field.placeholder || "")}"></textarea>`);
      ta.value = state.values[field.id] || "";
      ta.oninput = () => { state.values[field.id] = ta.value; fire(); };
      wrap.appendChild(ta); return wrap;
    }
    const wrap = el(`<div class="field"><label class="field__label">${field.label}</label></div>`);
    const inp = el(`<input type="text" placeholder="${esc(field.placeholder || "")}" />`);
    inp.value = state.values[field.id] || "";
    inp.oninput = () => { state.values[field.id] = inp.value; fire(); };
    wrap.appendChild(inp); return wrap;
  }

  // ---------------- ШАГ 3: результат ----------------
  function renderResult() {
    const tp = state.type;
    const panel = el(`
      <div class="panel">
        <div class="panel__head">
          <div class="panel__title">Готовый промт</div>
          <div class="panel__hint">${state.category.label} · ${tp.label}</div>
        </div>
        <div class="result-bar">
          <div class="result-bar__left">
            <div class="lang-switch">
              <button data-lang="en" class="${state.lang === "en" ? "is-on" : ""}">EN</button>
              <button data-lang="ru" class="${state.lang === "ru" ? "is-on" : ""}">RU</button>
            </div>
            <div class="detail-switch" data-detail></div>
          </div>
          <div class="result-bar__right">
            <span class="meta"></span>
            <button class="btn btn--primary" data-copy>Копировать</button>
          </div>
        </div>
        <div class="result" data-prompt></div>
        <div class="actions">
          <div class="actions__group">
            <span class="actions__label">Открыть в чате</span>
            <button class="btn btn--sm" data-open="chatgpt">ChatGPT</button>
            <button class="btn btn--sm" data-open="claude">Claude</button>
            <button class="btn btn--sm" data-open="gemini">Gemini</button>
          </div>
          <div class="actions__group">
            <span class="actions__label">Сохранить</span>
            <button class="btn btn--sm" data-dl="txt">${iconSvg("download")} .txt</button>
            <button class="btn btn--sm" data-dl="md">${iconSvg("download")} .md</button>
            <button class="btn btn--sm" data-share>${iconSvg("share")} Ссылка</button>
            <button class="btn btn--sm" data-fav>${iconSvg("star")} В шаблоны</button>
          </div>
        </div>
        <div class="panel__foot">
          <button class="btn btn--ghost" data-back>← Изменить настройки</button>
          <button class="btn" data-restart>↻ Начать заново</button>
        </div>
      </div>`);

    const paint = () => {
      const prompt = buildPrompt();
      panel.querySelector("[data-prompt]").textContent = prompt;
      panel.querySelector(".meta").textContent = prompt.length + " симв.";
      panel.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("is-on", b.dataset.lang === state.lang));
      return prompt;
    };

    const ds = panel.querySelector("[data-detail]");
    DETAILS.forEach((d) => {
      const b = el(`<button class="${state.detail === d.id ? "is-on" : ""}">${d.label}</button>`);
      b.onclick = () => {
        state.detail = d.id;
        ds.querySelectorAll("button").forEach((x) => x.classList.remove("is-on"));
        b.classList.add("is-on"); paint();
      };
      ds.appendChild(b);
    });

    paint();
    saveToHistory(buildPrompt());

    panel.querySelectorAll("[data-lang]").forEach((b) => (b.onclick = () => { state.lang = b.dataset.lang; paint(); }));
    panel.querySelector("[data-copy]").onclick = async (e) => {
      await copyText(buildPrompt()); toast("Промт скопирован");
      e.currentTarget.textContent = "✓ Скопировано";
      setTimeout(() => (e.currentTarget.textContent = "Копировать"), 1600);
    };
    panel.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => openInChat(b.dataset.open)));
    panel.querySelector('[data-dl="txt"]').onclick = () => download(`prompt-${tp.id}.txt`, buildPrompt());
    panel.querySelector('[data-dl="md"]').onclick = () => download(`prompt-${tp.id}.md`, buildPrompt());
    panel.querySelector("[data-share]").onclick = async () => {
      const enc = encodeState();
      await copyText(location.origin + location.pathname + "#p=" + enc);
      try { history.replaceState(null, "", "#p=" + enc); } catch {}
      toast("Ссылка скопирована");
    };
    panel.querySelector("[data-fav]").onclick = () => saveFavorite();
    panel.querySelector("[data-back]").onclick = () => go(2);
    panel.querySelector("[data-restart]").onclick = () => {
      state.category = null; state.type = null; state.values = {};
      try { history.replaceState(null, "", location.pathname); } catch {}
      go(0);
    };
    stage.appendChild(panel);
  }

  // ---------------- share: кодирование состояния ----------------
  function encodeState() {
    const data = { c: state.category.id, t: state.type.id, v: state.values, l: state.lang, d: state.detail };
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(data)))));
  }
  function decodeState(str) {
    try { return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(str))))); } catch { return null; }
  }
  function restoreFromHash() {
    const m = location.hash.match(/p=([^&]+)/);
    if (!m) return false;
    const data = decodeState(m[1]);
    if (!data) return false;
    const cat = findCategory(data.c); const tp = findType(cat, data.t);
    if (!cat || !tp) return false;
    state.category = cat; state.type = tp; state.values = data.v || {};
    state.lang = data.l || "en"; state.detail = data.d || "normal"; state.step = 3;
    return true;
  }

  // ---------------- хранилища ----------------
  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
  function save(key, list) { try { localStorage.setItem(key, JSON.stringify(list.slice(0, 60))); } catch {} }
  function snapshot(prompt) {
    return {
      id: Date.now(), ts: new Date().toISOString(),
      cat: state.category.id, type: state.type.id,
      catLabel: state.category.label, typeLabel: state.type.label,
      lang: state.lang, detail: state.detail,
      values: JSON.parse(JSON.stringify(state.values)),
      prompt: prompt || buildPrompt(),
    };
  }
  function saveToHistory(prompt) {
    const list = load(HISTORY_KEY);
    if (list[0] && list[0].prompt === prompt) return;
    list.unshift(snapshot(prompt)); save(HISTORY_KEY, list);
  }
  function saveFavorite() {
    const name = window.prompt("Название шаблона:", state.category.label + " · " + state.type.label);
    if (name === null) return;
    const list = load(FAV_KEY); const item = snapshot();
    item.name = name.trim() || (state.category.label + " · " + state.type.label);
    list.unshift(item); save(FAV_KEY, list); toast("Сохранено в шаблоны");
  }
  function openSnapshot(item) {
    const cat = findCategory(item.cat); const tp = findType(cat, item.type);
    if (!cat || !tp) return;
    state.category = cat; state.type = tp;
    state.values = JSON.parse(JSON.stringify(item.values || {}));
    state.lang = item.lang || "en"; state.detail = item.detail || "normal";
    closeModal(); go(3);
  }

  // ---------------- модалка (история + шаблоны) ----------------
  const modal = document.getElementById("historyModal");
  const listEl = document.getElementById("historyList");
  let currentTab = "history";

  function openModal(tab) {
    currentTab = tab || "history";
    modal.querySelectorAll(".modal__tab").forEach((t) => t.classList.toggle("is-on", t.dataset.tab === currentTab));
    renderList();
    modal.hidden = false; requestAnimationFrame(() => modal.classList.add("is-open"));
  }
  function closeModal() { modal.classList.remove("is-open"); setTimeout(() => (modal.hidden = true), 280); }

  function renderList() {
    const key = currentTab === "favorites" ? FAV_KEY : HISTORY_KEY;
    const list = load(key); listEl.innerHTML = "";
    if (!list.length) {
      listEl.appendChild(el(`<div class="history-empty">${currentTab === "favorites" ? "Шаблонов пока нет. Сохраните конфигурацию кнопкой «В шаблоны»." : "Пока пусто. Созданные промты появятся здесь."}</div>`));
      return;
    }
    list.forEach((item) => {
      const when = new Date(item.ts).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      const title = item.name ? item.name : item.catLabel + " · " + item.typeLabel;
      const sub = item.name ? item.catLabel + " · " + item.typeLabel : when + " · " + (item.lang || "en").toUpperCase();
      const row = el(`
        <div class="history-item">
          <div class="history-item__top">
            <span class="history-item__tag">${esc(title)}</span>
            <span class="history-item__time">${esc(sub)}</span>
          </div>
          <div class="history-item__preview">${esc((item.prompt || "").replace(/[#*]/g, "").slice(0, 120))}…</div>
          <div class="history-item__actions">
            <button class="btn btn--sm" data-open>Открыть</button>
            <button class="btn btn--sm" data-copy>Копировать</button>
            <button class="btn btn--sm btn--ghost" data-del>Удалить</button>
          </div>
        </div>`);
      row.querySelector("[data-open]").onclick = () => openSnapshot(item);
      row.querySelector("[data-copy]").onclick = async () => { await copyText(item.prompt || ""); toast("Скопировано"); };
      row.querySelector("[data-del]").onclick = () => { save(key, load(key).filter((x) => x.id !== item.id)); renderList(); };
      listEl.appendChild(row);
    });
  }

  // ---------------- библиотека готовых промтов ----------------
  const libModal = document.getElementById("libraryModal");
  const libList = document.getElementById("libraryList");
  const libSearch = document.getElementById("librarySearch");
  let libGroup = "all";

  function openLibrary() {
    libGroup = "all"; libSearch.value = "";
    renderLibGroups(); renderLibList();
    libModal.hidden = false; requestAnimationFrame(() => libModal.classList.add("is-open"));
  }
  function closeLibrary() { libModal.classList.remove("is-open"); setTimeout(() => (libModal.hidden = true), 280); }

  function renderLibGroups() {
    const box = document.getElementById("libraryGroups"); box.innerHTML = "";
    const all = el(`<button class="chip ${libGroup === "all" ? "is-on" : ""}">Все</button>`);
    all.onclick = () => { libGroup = "all"; renderLibGroups(); renderLibList(); };
    box.appendChild(all);
    LIBRARY_GROUPS.forEach((g) => {
      const c = el(`<button class="chip ${libGroup === g.id ? "is-on" : ""}">${g.label}</button>`);
      c.onclick = () => { libGroup = g.id; renderLibGroups(); renderLibList(); };
      box.appendChild(c);
    });
  }
  function renderLibList() {
    const q = libSearch.value.trim().toLowerCase();
    libList.innerHTML = "";
    let items = LIBRARY.filter((it) => (libGroup === "all" || it.group === libGroup));
    if (q) items = items.filter((it) => (it.title + " " + it.desc + " " + it.prompt).toLowerCase().includes(q));
    if (!items.length) { libList.appendChild(el(`<div class="history-empty">Ничего не найдено</div>`)); return; }
    items.forEach((it) => {
      const row = el(`
        <div class="history-item">
          <div class="history-item__top">
            <span class="history-item__tag">${esc(it.title)}</span>
          </div>
          <div class="history-item__desc">${esc(it.desc)}</div>
          <div class="history-item__preview">${esc(it.prompt.replace(/\s+/g, " ").slice(0, 130))}…</div>
          <div class="history-item__actions">
            <button class="btn btn--sm btn--primary" data-copy>Копировать</button>
            <button class="btn btn--sm" data-gpt>ChatGPT</button>
            <button class="btn btn--sm" data-claude>Claude</button>
          </div>
        </div>`);
      row.querySelector("[data-copy]").onclick = async () => { await copyText(it.prompt); toast("Промт скопирован"); };
      row.querySelector("[data-gpt]").onclick = () => openInChat("chatgpt", it.prompt);
      row.querySelector("[data-claude]").onclick = () => openInChat("claude", it.prompt);
      libList.appendChild(row);
    });
  }

  // ---------------- тема ----------------
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.getElementById("themeColor");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#15171f" : "#eef1f7");
    const ic = document.getElementById("themeIcon");
    if (ic) ic.innerHTML = iconSvg(theme === "dark" ? "sun" : "moon");
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }
  function toggleTheme() {
    applyTheme((document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark");
  }

  // ---------------- тост ----------------
  let toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = el(`<div class="toast"></div>`); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-show");
    clearTimeout(toast._t); toast._t = setTimeout(() => toastEl.classList.remove("is-show"), 1900);
  }

  // ---------------- рендер ----------------
  function render() {
    stage.innerHTML = "";
    renderSteps();
    if (state.step === 0) renderCategory();
    else if (state.step === 1) renderType();
    else if (state.step === 2) renderSettings();
    else if (state.step === 3) renderResult();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------- инициализация ----------------
  document.getElementById("brandMark").innerHTML = iconSvg("spark");
  document.getElementById("historyIcon").innerHTML = iconSvg("clock");
  document.getElementById("libraryIcon").innerHTML = iconSvg("books");
  document.getElementById("libSearchIcon").innerHTML = iconSvg("search");

  document.getElementById("historyBtn").onclick = () => openModal("history");
  document.getElementById("libraryBtn").onclick = openLibrary;
  document.getElementById("themeBtn").onclick = toggleTheme;
  document.getElementById("listClear").onclick = () => { save(currentTab === "favorites" ? FAV_KEY : HISTORY_KEY, []); renderList(); };
  modal.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeModal));
  modal.querySelectorAll(".modal__tab").forEach((t) => (t.onclick = () => openModal(t.dataset.tab)));
  libModal.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeLibrary));
  libSearch.oninput = renderLibList;

  // тема из памяти или системная
  let theme = "light";
  try { theme = localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch {}
  applyTheme(theme);

  // PWA (только при отдаче по http/https; на file:// недоступно)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  restoreFromHash();
  render();
})();
