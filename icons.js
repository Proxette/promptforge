/* =========================================================================
   PromptForge — набор линейных иконок (вместо эмодзи).
   Все 24x24, обводка currentColor — наследуют цвет палитры.
   iconSvg(name) -> строка <svg>; неизвестное имя -> точка.
   ========================================================================= */
const ICON_PATHS = {
  // бренд
  spark: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>',

  // категории
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-9 9"/>',
  text: '<path d="M5 5h14M5 5v2M5 5h7M9 5v14M7 19h4"/><path d="M14 11h6M17 11v8M15 19h4"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
  audio: '<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',

  // код: типы
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 4 3 3 0 0 0 6 0V4a2 2 0 0 0-4 0"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  game: '<rect x="3" y="8" width="18" height="9" rx="4"/><path d="M8 12h2M9 11v2M15 12h.01M17 14h.01"/>',
  puzzle: '<path d="M10 4a2 2 0 0 1 4 0v2h2a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2h-2a2 2 0 0 0-4 0H8a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8a2 2 0 0 1 2-2h2z"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  database: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',

  // изображение: типы
  brush: '<path d="M4 20c2 0 3-1 3-3 0-1.2-.8-2-2-2s-2 .8-2 2c0 1-.5 2-1 3zM7 15l9-9 3 3-9 9"/><path d="M14 4l3 3"/>',
  camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2h5L16 7"/><circle cx="12" cy="13" r="3.5"/>',
  badge: '<path d="M12 3l2.5 2 3.5-.5.5 3.5 2 2.5-2 2.5-.5 3.5-3.5-.5L12 21l-2.5-2-3.5.5-.5-3.5L3.5 14 5.5 11l-.5-3.5 3.5.5z"/>',
  mask: '<path d="M4 6c0 8 3 12 8 12s8-4 8-12c-3-1-5-1.5-8-1.5S7 5 4 6z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/>',

  // текст: типы
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  megaphone: '<path d="M4 10v4l11 4V6zM4 12h-1M15 9a3 3 0 0 1 0 6M7 14v4h3v-3"/>',
  tag: '<path d="M3 12l8-8 9 1 1 9-8 8z"/><circle cx="15" cy="9" r="1.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',

  // видео: типы
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>',
  clapper: '<path d="M4 9l1-4 16 3-1 4zM4 9l3-1 4 1 4-1 4 1M4 9v10h16V9"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z"/>',

  // аудио: типы
  note: '<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',

  // код: доп. типы
  flow: '<circle cx="5" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><rect x="15" y="9" width="6" height="6" rx="1.5"/><path d="M7.5 6H12a3 3 0 0 1 3 3M7.5 18H12a3 3 0 0 0 3-3"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',

  // текст: доп. типы
  slides: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M9 20h6"/>',
  resume: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="9" r="2.2"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/>',

  // ассистент
  assistant: '<rect x="3" y="5" width="18" height="13" rx="3"/><path d="M8 18l-2 3v-3M9 10h.01M15 10h.01M9.5 14a3 3 0 0 0 5 0"/>',
  persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M2 9l2-1M22 9l-2-1"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/>',

  // новые категории
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  book: '<path d="M4 4h11a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z"/><path d="M17 6h3v12h-3"/><path d="M8 8h6M8 11h6"/>',

  // новые типы
  discord: '<path d="M7 7a14 14 0 0 1 10 0M7 17a14 14 0 0 0 10 0M7 7C4.5 9 4 14 5 18l2-1M17 7c2.5 2 3 7 2 11l-2-1"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10 9l5 3-5 3z"/>',
  sticker: '<path d="M4 4h11l5 5v11H4z"/><path d="M14 4v6h6"/><path d="M8 14a3 3 0 0 0 5 0"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10c1 1 1.5 1.5 1.5 3h5c0-1.5.5-2 1.5-3a6 6 0 0 0-4-10z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4 2c0 1.5-1.5 1.8-1.5 3M12 17h.01"/>',

  // общие
  pen: '<path d="M14 4l6 6L8 22H2v-6z"/><path d="M12 6l6 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V4h12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star: '<path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.8 6.1 21l1.2-6.5L2.5 9.9 9.1 9z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon: '<path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/>',
  books: '<path d="M5 4h5v16H5zM10 4h5v16h-5z"/><path d="M15 5l4 1-3 15-4-1"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="M8.2 11l6.6-3.6M8.2 13l6.6 3.6"/>',
  download: '<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
};

function iconSvg(name) {
  const inner = ICON_PATHS[name] || '<circle cx="12" cy="12" r="3"/>';
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
