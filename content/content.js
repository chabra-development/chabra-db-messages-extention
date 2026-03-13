/**
 * Content script — https://chabra.desk.blip.ai/
 *
 * Três pontos de injeção:
 *
 * 1. PAINEL DE DETALHES (.drawer)
 *    Painel completo: adicionar, remover, autocomplete de tags.
 *
 * 2. HEADER DA CONVERSA (.pane-chat-header.w-100)
 *    Chips somente-leitura no topo da conversa aberta.
 *
 * 3. CARDS DO SIDEBAR (.w-100.ss-container.tabs-list-content)
 *    Chips somente-leitura em cada card de atendimento na lista lateral.
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

const PANEL_ID      = "chabra-tags-panel";
const DRAWER_SEL    = ".drawer";
const HEADER_SEL    = ".pane-chat-header.w-100";
const HEADER_TAG_ID = "chabra-header-tags";

// Âncoras tentadas em ordem para o painel de detalhes
const DETAIL_ANCHORS = [
  ".responsive-wrapper",
  ".profile-info",
  ".contact-info",
  ".drawer-content",
];

// Sidebar — atendimentos ativos
const SIDEBAR_CARD_SEL  = ".w-100.ss-container.tabs-list-content .pa2";
const CHAT_LIST_SEL     = ".chat-list";
const SIDEBAR_DONE_ATTR = "data-ct-done";

// Sidebar — fila de espera
const WAITING_CARD_SEL  = ".chat-list-item.ticket-list-item";
const WAITING_DONE_ATTR = "data-ct-waiting-done";

// ─── Estado global ────────────────────────────────────────────────────────────

let currentIdentity = null;
let currentTags     = [];
let drawerObserver  = null;
let _writing        = false;

const tagsCache = new Map(); // identity → Tag[]

// ─── Bootstrap ────────────────────────────────────────────────────────────────

init();

function init() {
  let debounceTimer = null;

  // Debounce: aguarda 150ms sem mutações antes de processar,
  // evitando o freeze causado por rafagas de mutações do Blip Desk.
  new MutationObserver((mutations) => {
    if (_writing) return;
    const hasNodes = mutations.some(m => m.addedNodes.length || m.removedNodes.length);
    if (!hasNodes) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      attachDrawer();
      attachHeader();
      processSidebarCards();
      processWaitingCards();
    }, 150);
  }).observe(document.body, { childList: true, subtree: true });

  attachDrawer();
  attachHeader();
  processSidebarCards();
  processWaitingCards();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PAINEL DE DETALHES
// ═══════════════════════════════════════════════════════════════════════════════

function attachDrawer() {
  const drawer = document.querySelector(DRAWER_SEL);
  if (!drawer) return;

  if (!drawerObserver) {
    drawerObserver = new MutationObserver(() => {
      if (!_writing) tryMountDetail(drawer);
    });
    drawerObserver.observe(drawer, { childList: true, subtree: true });
  }

  tryMountDetail(drawer);
}

function tryMountDetail(drawer) {
  const identity = extractIdentity(drawer);

  if (!identity) {
    if (currentIdentity) {
      removeDetailPanel();
      currentIdentity = null;
      currentTags = [];
      // Limpar header ao fechar conversa
      const header = document.querySelector(HEADER_SEL);
      if (header) {
        document.getElementById(HEADER_TAG_ID)?.remove();
        delete header.dataset.ctIdentity;
      }
    }
    return;
  }

  if (identity === currentIdentity && document.getElementById(PANEL_ID)) return;

  currentIdentity = identity;
  currentTags = [];
  mountDetailPanel(drawer, identity);
}

function mountDetailPanel(drawer, identity) {
  _writing = true;
  removeDetailPanel();

  // Tentar âncoras conhecidas; fallback: prepend no próprio drawer
  let anchor = null;
  for (const sel of DETAIL_ANCHORS) {
    const el = drawer.querySelector(sel);
    if (el) { anchor = el; break; }
  }

  const panel = buildDetailPanel(identity);

  if (anchor) {
    anchor.insertAdjacentElement("beforebegin", panel);
  } else {
    drawer.prepend(panel);
  }

  _writing = false;
  loadDetailTags(identity);
}

function removeDetailPanel() {
  document.getElementById(PANEL_ID)?.remove();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HEADER DA CONVERSA
// ═══════════════════════════════════════════════════════════════════════════════

function attachHeader() {
  const header = document.querySelector(HEADER_SEL);
  if (!header) return;

  const headerIdentity = header.dataset.ctIdentity;

  if (!currentIdentity) {
    document.getElementById(HEADER_TAG_ID)?.remove();
    delete header.dataset.ctIdentity;
    return;
  }

  if (headerIdentity === currentIdentity) return;

  // Identidade nova: renderiza do cache (se existir) ou aguarda loadDetailTags
  renderHeaderTags(header, currentIdentity);

  // Se o cache já existe (conversa visitada antes) mas o painel ainda não carregou
  if (tagsCache.has(currentIdentity) && !document.getElementById(PANEL_ID)) {
    const drawer = document.querySelector(DRAWER_SEL);
    if (drawer) mountDetailPanel(drawer, currentIdentity);
  }
}

function renderHeaderTags(header, identity) {
  document.getElementById(HEADER_TAG_ID)?.remove();

  const tags = tagsCache.get(identity) || [];

  // Só renderiza se houver tags
  if (!tags.length) return;

  const wrap = document.createElement("div");
  wrap.id = HEADER_TAG_ID;
  wrap.className = "ct-header-tags";

  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "ct-header-chip";
    if (tag.color) chip.style.setProperty("--chip-color", tag.color);
    chip.textContent = tag.name;
    wrap.appendChild(chip);
  });

  header.appendChild(wrap);
  header.dataset.ctIdentity = identity;
}

// ── HTML do painel de detalhes ────────────────────────────────────────────────

function buildDetailPanel(identity) {
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.dataset.identity = identity;

  panel.innerHTML = `
    <div class="ct-header">
      <span class="ct-title">Tags</span>
      <button class="ct-collapse-btn" aria-label="Minimizar">−</button>
    </div>
    <div class="ct-body">
      <div class="ct-chips" id="ct-chips"></div>
      <div class="ct-autocomplete-wrap">
        <input
          class="ct-input"
          id="ct-input"
          type="text"
          placeholder="Buscar ou criar tag..."
          maxlength="50"
          autocomplete="off"
        />
        <ul class="ct-dropdown" id="ct-dropdown" hidden></ul>
      </div>
      <div class="ct-error" id="ct-error" hidden></div>
    </div>
  `;

  panel.querySelector(".ct-collapse-btn").addEventListener("click", () => {
    const body = panel.querySelector(".ct-body");
    const btn  = panel.querySelector(".ct-collapse-btn");
    body.hidden = !body.hidden;
    btn.textContent = body.hidden ? "+" : "−";
  });

  const input           = panel.querySelector("#ct-input");
  const dropdown        = panel.querySelector("#ct-dropdown");
  const autocompleteWrap = panel.querySelector(".ct-autocomplete-wrap");
  let debounce          = null;

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    const q = input.value.trim();
    if (!q) { hideDropdown(dropdown); return; }
    debounce = setTimeout(() => fetchSuggestions(q, dropdown, input, identity), 250);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { hideDropdown(dropdown); input.value = ""; return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const active = dropdown.querySelector(".ct-option.active");
      if (active) { active.click(); return; }
      const name = input.value.trim().toLowerCase();
      if (name) { hideDropdown(dropdown); input.value = ""; showColorPicker(autocompleteWrap, name, identity); }
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      navigateDropdown(dropdown, e.key === "ArrowDown" ? 1 : -1);
      e.preventDefault();
    }
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target)) hideDropdown(dropdown);
  });

  return panel;
}

// ── Chips do painel de detalhes ───────────────────────────────────────────────

function renderDetailChips(tags) {
  const container = document.getElementById("ct-chips");
  if (!container) return;

  if (!tags.length) {
    container.innerHTML = `<span class="ct-empty">Nenhuma tag</span>`;
    return;
  }

  container.innerHTML = "";
  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "ct-chip";
    chip.dataset.tagId = tag.id;
    if (tag.color) chip.style.setProperty("--chip-color", tag.color);

    chip.innerHTML = `
      <span class="ct-chip-label">${escapeHtml(tag.name)}</span>
      <button class="ct-chip-remove" aria-label="Remover">×</button>
    `;
    chip.querySelector(".ct-chip-remove").addEventListener("click", () =>
      removeTag(currentIdentity, tag.id)
    );
    container.appendChild(chip);
  });
}

// ── CRUD do painel de detalhes ────────────────────────────────────────────────

async function loadDetailTags(identity) {
  setDetailError(null);
  const chips = document.getElementById("ct-chips");
  if (chips) chips.innerHTML = `<span class="ct-loading">Carregando...</span>`;

  const { ok, data, error } = await api("GET_CONTACT_TAGS", { contactIdentity: identity });
  if (!ok) { setDetailError(error); if (chips) chips.innerHTML = ""; return; }

  currentTags = Array.isArray(data) ? data : [];
  tagsCache.set(identity, currentTags);
  renderDetailChips(currentTags);

  // Atualizar header e sidebar com as tags recém-carregadas
  const header = document.querySelector(HEADER_SEL);
  if (header) renderHeaderTags(header, identity);
  refreshSidebarCard(identity);
}

async function addTag(identity, tag) {
  setDetailError(null);
  if (currentTags.some((t) => t.id === tag.id)) return;

  const { ok, error } = await api("SET_CONTACT_TAGS", {
    contactIdentity: identity,
    tagIds: [...currentTags.map((t) => t.id), tag.id],
  });
  if (!ok) { setDetailError(error); return; }

  tagsCache.delete(identity);
  await loadDetailTags(identity);
}

async function createAndAdd(identity, name, color) {
  setDetailError(null);

  const searchRes = await api("SEARCH_TAGS", { query: name });
  const existing  = searchRes.ok
    ? (searchRes.data ?? []).find((t) => t.name.toLowerCase() === name)
    : null;

  if (existing) { await addTag(identity, existing); return; }

  const createRes = await api("CREATE_TAG", { name, ...(color ? { color } : {}) });
  if (!createRes.ok) { setDetailError(createRes.error); return; }

  const created = Array.isArray(createRes.data)
    ? createRes.data.find((t) => t.name.toLowerCase() === name)
    : createRes.data;

  if (!created?.id) { setDetailError("Erro ao criar tag."); return; }

  // Garantir cor no objeto local mesmo que o servidor retorne sem ela
  if (color) created.color = color;

  await addTag(identity, created);
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

function showColorPicker(wrap, name, identity) {
  wrap.querySelector(".ct-color-picker")?.remove();

  let selectedColor = "";

  const picker = document.createElement("div");
  picker.className = "ct-color-picker";

  const label = document.createElement("span");
  label.className = "ct-color-label";
  label.textContent = `Cor para "${name}":`;

  const swatches = document.createElement("div");
  swatches.className = "ct-swatches";

  const noneBtn = document.createElement("button");
  noneBtn.className = "ct-swatch ct-swatch--none ct-swatch--active";
  noneBtn.title = "Sem cor";
  noneBtn.textContent = "∅";
  noneBtn.addEventListener("click", () => {
    selectedColor = "";
    swatches.querySelectorAll(".ct-swatch").forEach((s) => s.classList.remove("ct-swatch--active"));
    noneBtn.classList.add("ct-swatch--active");
  });
  swatches.appendChild(noneBtn);

  PRESET_COLORS.forEach((color) => {
    const btn = document.createElement("button");
    btn.className = "ct-swatch";
    btn.style.background = color;
    btn.title = color;
    btn.addEventListener("click", () => {
      selectedColor = color;
      swatches.querySelectorAll(".ct-swatch").forEach((s) => s.classList.remove("ct-swatch--active"));
      btn.classList.add("ct-swatch--active");
    });
    swatches.appendChild(btn);
  });

  const actions = document.createElement("div");
  actions.className = "ct-color-actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "ct-color-cancel";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", () => picker.remove());

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "ct-color-confirm";
  confirmBtn.textContent = "Criar tag";
  confirmBtn.addEventListener("click", () => {
    picker.remove();
    createAndAdd(identity, name, selectedColor || undefined);
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);

  picker.appendChild(label);
  picker.appendChild(swatches);
  picker.appendChild(actions);
  wrap.appendChild(picker);
}

async function removeTag(identity, tagId) {
  setDetailError(null);

  const { ok, error } = await api("SET_CONTACT_TAGS", {
    contactIdentity: identity,
    tagIds: currentTags.map((t) => t.id).filter((id) => id !== tagId),
  });
  if (!ok) { setDetailError(error); return; }

  tagsCache.delete(identity);
  await loadDetailTags(identity);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SIDEBAR DE ATENDIMENTOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lê os tickets do array Vue em .chat-list e retorna
 * [ { identity, pinned }, ... ] na mesma ordem dos cards renderizados.
 */
function getVueTickets() {
  const vue = document.querySelector(CHAT_LIST_SEL)?.__vue__;
  if (!vue) return [];

  const pinned    = vue.filteredPinnedTickets    || [];
  const notPinned = vue.filteredNotPinnedTickets || [];

  return [...pinned, ...notPinned].map((t) => {
    const phone  = t?.customerAccount?.phoneNumber;
    const domain = t?.customerDomain || "wa.gw.msging.net";
    const digits = phone ? normalizePhone(phone.replace(/\D/g, "")) : null;
    return digits ? `${digits}@${domain}` : null;
  });
}

/**
 * Varre todos os cards do sidebar no documento e injeta tags nos não processados.
 * Usa dados Vue (.chat-list) como fonte primária de identity.
 */
function processSidebarCards() {
  const allCards = [...document.querySelectorAll(SIDEBAR_CARD_SEL)];
  if (!allCards.length) return;

  const vueIdentities = getVueTickets();

  allCards.forEach((card, index) => {
    const identity = vueIdentities[index] || extractIdentity(card);

    // Se a identidade do card mudou (nova conversa na mesma posição), resetar
    const prevIdentity = card.dataset.ctIdentity;
    if (prevIdentity && prevIdentity !== identity) {
      card.removeAttribute(SIDEBAR_DONE_ATTR);
      card.querySelector(".ct-sidebar-tags")?.remove();
    }

    if (card.getAttribute(SIDEBAR_DONE_ATTR)) return;

    if (!identity) {
      card.setAttribute(SIDEBAR_DONE_ATTR, "1");
      return;
    }

    card.setAttribute(SIDEBAR_DONE_ATTR, "1");
    card.dataset.ctIdentity = identity;
    injectSidebarTags(card, identity);
  });
}

/**
 * Varre os cards da fila "Aguardando Atendimento" e injeta tags nos não processados.
 * Usa exclusivamente extractIdentity() (sem Vue) pois a instância Vue dessa lista
 * ainda não foi mapeada.
 */
function processWaitingCards() {
  const cards = [...document.querySelectorAll(WAITING_CARD_SEL)];
  if (!cards.length) return;

  cards.forEach((card) => {
    const identity = extractIdentity(card);

    const prev = card.dataset.ctIdentity;
    if (prev && prev !== identity) {
      card.removeAttribute(WAITING_DONE_ATTR);
      card.querySelector(".ct-sidebar-tags")?.remove();
    }

    if (card.getAttribute(WAITING_DONE_ATTR)) return;

    if (!identity) {
      card.setAttribute(WAITING_DONE_ATTR, "1");
      return;
    }

    card.setAttribute(WAITING_DONE_ATTR, "1");
    card.dataset.ctIdentity = identity;
    injectSidebarTags(card, identity);
  });
}

async function injectSidebarTags(card, identity) {
  let tags = tagsCache.get(identity);

  if (!tags) {
    const { ok, data } = await api("GET_CONTACT_TAGS", { contactIdentity: identity });
    if (!ok) return;
    tags = Array.isArray(data) ? data : [];
    tagsCache.set(identity, tags);
  }

  if (!tags.length) return;

  renderSidebarChips(card, identity, tags);
}

function renderSidebarChips(card, identity, tags) {
  // Remover container anterior se existir
  card.querySelector(".ct-sidebar-tags")?.remove();

  const wrap = document.createElement("div");
  wrap.className = "ct-sidebar-tags";
  wrap.dataset.identity = identity;

  tags.slice(0, 3).forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "ct-sidebar-chip";
    if (tag.color) chip.style.setProperty("--chip-color", tag.color);
    chip.textContent = tag.name;
    wrap.appendChild(chip);
  });

  // Se houver mais de 3 tags, mostrar contador
  if (tags.length > 3) {
    const more = document.createElement("span");
    more.className = "ct-sidebar-chip ct-sidebar-chip--more";
    more.textContent = `+${tags.length - 3}`;
    wrap.appendChild(more);
  }

  // Inserir após a linha do nome (entre nome e preview da mensagem)
  const contentCol = card.querySelector("section.ticket-content > div.flex-column");
  const nameRow    = contentCol?.firstElementChild;
  if (nameRow) {
    nameRow.insertAdjacentElement("afterend", wrap);
  } else {
    card.appendChild(wrap); // fallback caso a estrutura mude
  }
}

/**
 * Após add/remove no painel de detalhes, atualiza o card correspondente
 * no sidebar se ele estiver visível.
 */
function refreshSidebarCard(identity) {
  // Lista de atendimentos ativos
  const vueIdentities = getVueTickets();
  const activeCards = [...document.querySelectorAll(SIDEBAR_CARD_SEL)];

  const index = vueIdentities.indexOf(identity);
  if (index !== -1 && activeCards[index]) {
    activeCards[index].removeAttribute(SIDEBAR_DONE_ATTR);
    injectSidebarTags(activeCards[index], identity);
  }

  // Fila de espera
  document.querySelectorAll(WAITING_CARD_SEL).forEach((card) => {
    if (card.dataset.ctIdentity === identity) {
      card.removeAttribute(WAITING_DONE_ATTR);
      injectSidebarTags(card, identity);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITÁRIOS COMPARTILHADOS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Extração de identity Blip ─────────────────────────────────────────────────

/**
 * Tenta extrair a identity Blip de um elemento DOM.
 *
 * Estratégias em cascata:
 * 1. Atributo data-* com a identity completa
 * 2. Texto/atributo com padrão completo: xxx@yyy.msging.net
 * 3. Número de telefone → monta identity: {digits}@wa.gw.msging.net
 *    (formato usado: "5521974828985@wa.gw.msging.net")
 */
function extractIdentity(el) {
  // 1. Atributos data-*
  const dataAttrs = [
    "data-identity",
    "data-contact-identity",
    "data-node-identity",
    "data-contact-id",
  ];
  for (const attr of dataAttrs) {
    const val = el.querySelector?.(`[${attr}]`)?.getAttribute(attr)
             || el.getAttribute?.(attr);
    if (val?.trim()) return val.trim();
  }

  // 2. Padrão específico @wa.gw.msging.net em texto ou atributos src/href
  // (ignora @tunnel.msging.net e outros subdomínios que não correspondem ao banco)
  const waPattern = /[\w.+%-]+@wa\.gw\.msging\.net/i;

  // textContent não força reflow (ao contrário de innerText)
  const textMatch = (el.textContent || "").match(waPattern);
  if (textMatch) return textMatch[0];

  for (const child of el.querySelectorAll?.("[src],[href]") ?? []) {
    const m = (child.getAttribute("src") || child.getAttribute("href") || "").match(waPattern);
    if (m) return m[0];
  }

  // 3. Número de telefone → {digits}@wa.gw.msging.net
  const phone = extractPhone(el);
  if (phone) return `${phone}@wa.gw.msging.net`;

  return null;
}

/**
 * Extrai e normaliza um número de telefone do elemento.
 * Retorna somente dígitos, com código de país (55 para BR).
 * Exemplos de entrada aceitos:
 *   "+55 21 97482-8985"  → "5521974828985"
 *   "(21) 97482-8985"    → "5521974828985"
 *   "5521974828985"      → "5521974828985"
 */
function extractPhone(el) {
  // a. Atributo href="tel:..."
  for (const a of el.querySelectorAll?.("a[href^='tel:']") ?? []) {
    const digits = a.getAttribute("href").replace(/\D/g, "");
    const normalized = normalizePhone(digits);
    if (normalized) return normalized;
  }

  // b. Atributos data-phone / data-number / data-phone-number
  const phoneAttrs = ["data-phone", "data-number", "data-phone-number", "data-contact-phone"];
  for (const attr of phoneAttrs) {
    const raw = el.querySelector?.(`[${attr}]`)?.getAttribute(attr)
             || el.getAttribute?.(attr);
    if (raw) {
      const normalized = normalizePhone(raw.replace(/\D/g, ""));
      if (normalized) return normalized;
    }
  }

  // c. Texto — padrões telefônicos brasileiros
  //    +55 XX XXXXX-XXXX | (XX) XXXXX-XXXX | 55XXXXXXXXXXX
  const text = el.textContent || "";
  const phoneRegex = /(?:\+?55[\s.-]?)?(?:\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/g;
  for (const match of text.matchAll(phoneRegex)) {
    const normalized = normalizePhone(match[0].replace(/\D/g, ""));
    if (normalized) return normalized;
  }

  return null;
}

/**
 * Recebe uma string de dígitos e retorna o número normalizado para
 * o formato esperado pelo banco (sem +, sem espaços, com código 55).
 * Retorna null se não tiver comprimento válido.
 */
function normalizePhone(digits) {
  if (!digits) return null;

  // Já começa com 55 e tem 12–13 dígitos (55 + DDD + número 8 ou 9 dígitos)
  if (/^55\d{10,11}$/.test(digits)) return digits;

  // Começa com + ou sem código de país (10–11 dígitos: DDD + número)
  if (/^\d{10,11}$/.test(digits)) return `55${digits}`;

  return null;
}

// ── Autocomplete ──────────────────────────────────────────────────────────────

async function fetchSuggestions(query, dropdown, input, identity) {
  const { ok, data } = await api("SEARCH_TAGS", { query });
  if (!ok) return;

  const suggestions = (data ?? []).filter(
    (t) => !currentTags.some((ct) => ct.id === t.id)
  );
  const exactMatch = suggestions.some(
    (t) => t.name.toLowerCase() === query.toLowerCase()
  );

  showDropdown(dropdown, suggestions, !exactMatch ? query : null, input, identity);
}

function showDropdown(dropdown, tags, createLabel, input, identity) {
  dropdown.innerHTML = "";

  tags.forEach((tag) => {
    dropdown.appendChild(buildOption(tag.name, tag.color, false, () => {
      hideDropdown(dropdown);
      input.value = "";
      addTag(identity, tag);
    }));
  });

  if (createLabel) {
    dropdown.appendChild(buildOption(`Criar "${createLabel}"`, null, true, () => {
      hideDropdown(dropdown);
      input.value = "";
      showColorPicker(input.closest(".ct-autocomplete-wrap"), createLabel.toLowerCase(), identity);
    }));
  }

  dropdown.hidden = dropdown.children.length === 0;
}

function buildOption(label, color, isCreate, onClick) {
  const li = document.createElement("li");
  li.className = `ct-option${isCreate ? " ct-option--create" : ""}`;

  if (color) {
    const dot = document.createElement("span");
    dot.className = "ct-dot";
    dot.style.background = color;
    li.appendChild(dot);
  }

  li.appendChild(document.createTextNode(label));
  li.addEventListener("mouseenter", () => dropdown_setActive(li.parentElement, li));
  li.addEventListener("click", onClick);
  return li;
}

function hideDropdown(dropdown) {
  dropdown.hidden = true;
  dropdown.innerHTML = "";
}

function navigateDropdown(dropdown, dir) {
  const options = [...dropdown.querySelectorAll(".ct-option")];
  if (!options.length) return;
  const idx  = options.indexOf(dropdown.querySelector(".ct-option.active"));
  const next = options[Math.max(0, Math.min(options.length - 1, idx + dir))];
  dropdown_setActive(dropdown, next);
}

function dropdown_setActive(dropdown, el) {
  dropdown.querySelectorAll(".ct-option.active").forEach((o) => o.classList.remove("active"));
  el?.classList.add("active");
}

// ── API ───────────────────────────────────────────────────────────────────────

function api(action, args = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: "TAGS_REQUEST", payload: { action, ...args } },
      (res) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(res);
        }
      }
    );
  });
}

// ── Erros (painel de detalhes) ────────────────────────────────────────────────

function setDetailError(msg) {
  const el = document.getElementById("ct-error");
  if (!el) return;
  el.textContent = msg || "";
  el.hidden = !msg;
}

// ── Responder ao popup ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CURRENT_CONTACT") {
    sendResponse({ contactIdentity: currentIdentity });
  }
});

// ── Escape HTML ───────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
