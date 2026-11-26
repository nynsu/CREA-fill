const DATA_FIELDS = [
  'contratanteNome',
  'cnpj',
  'numeroProcesso',
  'email',
  'ddd',
  'telefone',
  'contratanteCep',
  'contratanteNumero',
  'contratanteEndereco',
  'contratanteBairro',
  'contratanteCidade',
  'nomeAldeia',
  'obraCep',
  'obraNumero',
  'obraCidade',
  'obraUf',
  'obraBairro',
  'latitude',
  'longitude',
  'atividadeQuantidade',
  'observacoes'
];

const SETTING_KEYS = [
  'formaRegistro',
  'participacaoTecnica',
  'tipoContratante',
  'acaoInstitucional',
  'finalidade',
  'valorContratoPadrao',
  'atividadeUnidadeOverride',
  'clausula',
  'acessibilidade',
  'preencherDatasContratoHoje',
  'lancarAtividadesPadrao',
  'preencherObservacoes',
  'repetirProprietario'
];

const DEFAULT_SETTINGS = {
  formaRegistro: '1',
  participacaoTecnica: '1',
  tipoContratante: '3',
  acaoInstitucional: '0',
  finalidade: '21',
  valorContratoPadrao: '1000',
  atividadeUnidadeOverride: '',
  clausula: '0',
  acessibilidade: '0',
  preencherDatasContratoHoje: true,
  lancarAtividadesPadrao: true,
  preencherObservacoes: false,
  repetirProprietario: true
};

const DEFAULT_ATIVIDADES_BIM = [
  {
    CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
    CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto' },
    ID_TOS: { text: 'Eletrotécnica' },
    SUB_GRUPO_TOS: { text: 'Instalações Elétricas' },
    OBRA_SERVICO_TOS: { text: 'de instalações elétricas em baixa tensão' },
    CODIGO_DA_UNIDADE: { text: 'unidade - un' },
    QUANTIDADE: '1,0000'
  },
  {
    CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
    CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto' },
    ID_TOS: { text: 'Eletrotécnica' },
    SUB_GRUPO_TOS: { text: 'Sistemas de Proteção Contra Descargas Atmosféricas - SPDA' },
    OBRA_SERVICO_TOS: { text: 'de sistemas de proteção contra descargas atmosféricas - SPDA' },
    CODIGO_DA_UNIDADE: { text: 'unidade - un' },
    QUANTIDADE: '1,0000'
  }
];

const DEFAULT_BIM_PRESET_ID = 'default-bim-eletrica';
const DEFAULT_BIM_PRESET = {
  id: DEFAULT_BIM_PRESET_ID,
  name: 'ELE + SPDA',
  group: 'Elétrica',
  builtIn: true,
  items: DEFAULT_ATIVIDADES_BIM
};

const BUILT_IN_PRESETS = [
  DEFAULT_BIM_PRESET,
  {
    id: 'default-bim-eletrica-dados',
    name: 'ELE + SPDA + DADOS',
    group: 'Elétrica',
    builtIn: true,
    items: [
      ...DEFAULT_ATIVIDADES_BIM,
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto' },
        ID_TOS: { text: 'Telecomunicações' },
        SUB_GRUPO_TOS: { text: 'Sistemas de Telecomunicação' },
        OBRA_SERVICO_TOS: { text: 'de sistemas de telecomunicação' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      }
    ]
  },
  {
    id: 'default-bim-hidraulica-saa',
    name: '🚰 Hidráulica SAA',
    group: 'Padrão',
    builtIn: true,
    items: [
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto de Instalações' },
        ID_TOS: { text: 'Saneamento Ambiental' },
        SUB_GRUPO_TOS: { text: 'Sistema de Abastecimento de Água' },
        OBRA_SERVICO_TOS: { text: 'de sistema de abastecimento de água' },
        COMPLEMENTO_TOS: { text: 'instalações hidráulicas em sistemas de abastecimento de água' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      },
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto' },
        ID_TOS: { text: 'Construção Civil' },
        SUB_GRUPO_TOS: { text: 'Edificações' },
        OBRA_SERVICO_TOS: { text: 'de edificação' },
        COMPLEMENTO_TOS: { text: 'de alvenaria' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      }
    ]
  },
  {
    id: 'default-bim-hidraulica',
    name: '💧 Hidráulica',
    group: 'Padrão',
    builtIn: true,
    items: [
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto de Instalações' },
        ID_TOS: { text: 'Construção Civil' },
        SUB_GRUPO_TOS: { text: 'Instalações Hidrossanitárias' },
        OBRA_SERVICO_TOS: { text: 'de instalação de sistema de esgoto sanitário' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      },
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto de Instalações' },
        ID_TOS: { text: 'Construção Civil' },
        SUB_GRUPO_TOS: { text: 'Instalações Hidrossanitárias' },
        OBRA_SERVICO_TOS: { text: 'de sistema de água potável' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      },
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto de Instalações' },
        ID_TOS: { text: 'Construção Civil' },
        SUB_GRUPO_TOS: { text: 'Instalações Hidrossanitárias' },
        OBRA_SERVICO_TOS: { text: 'de sistema de redes de águas pluviais' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      }
    ]
  },
  {
    id: 'default-bim-estrutura',
    name: '🏗️ Estrutura',
    group: 'Padrão',
    builtIn: true,
    items: [
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Projeto' },
        ID_TOS: { text: 'Estruturas' },
        SUB_GRUPO_TOS: { text: 'Estruturas de Concreto e Argamassa Armada' },
        OBRA_SERVICO_TOS: { text: 'de estrutura de concreto armado' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      }
    ]
  },
  {
    id: 'default-bim-orcamento',
    name: '💰 Orçamento',
    group: 'Padrão',
    builtIn: true,
    items: [
      {
        CODIGO_NIVEL_ATUACAO_TOS: { value: '16', text: 'Elaboração em BIM' },
        CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { text: 'Elaboração de orçamento' },
        ID_TOS: { text: 'Construção Civil' },
        SUB_GRUPO_TOS: { text: 'Edificações' },
        OBRA_SERVICO_TOS: { text: 'de edificação' },
        COMPLEMENTO_TOS: { text: 'de alvenaria' },
        CODIGO_DA_UNIDADE: { text: 'unidade - un' },
        QUANTIDADE: '1,0000'
      }
    ]
  }
];

let atividadePresets = [...BUILT_IN_PRESETS];
let selectedPresetId = DEFAULT_BIM_PRESET_ID;
const OBRA_ADDRESS_FIELDS = ['nomeAldeia', 'obraCep', 'obraNumero', 'obraCidade', 'obraUf', 'obraBairro', 'latitude', 'longitude'];
let recentHistory = [];
let allObras = [];
let activeObraIndex = 0;
let isFilling = false;

function $(id) {
  return document.getElementById(id);
}

function setStatus(text, type = '') {
  const el = $('statusMsg');
  el.textContent = text;
  el.className = `status ${type}`.trim();
}

function updateObsMeta() {
  const obs = $('f_observacoes').value || '';
  $('obsCounter').textContent = `${obs.length}/300`;
  const invalid = window.ArtParser.hasInvalidArtChars(obs);
  $('obsWarning').classList.toggle('hidden', !invalid);
}

function updateMapsLink() {
  const lat = $('f_latitude').value.trim();
  const lon = $('f_longitude').value.trim();
  const link = $('mapsLink');
  if (lat && lon) {
    link.href = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lon}`)}`;
    link.classList.remove('hidden');
  } else {
    link.classList.add('hidden');
  }
}

function readFormData() {
  const data = {};
  for (const key of DATA_FIELDS) {
    const el = $(`f_${key}`);
    data[key] = el ? el.value.trim() : '';
  }
  return data;
}

function updateQuantityHighlight() {
  const unitSel = $('s_atividadeUnidadeOverride');
  const qtdEl = $('f_atividadeQuantidade');
  if (!unitSel || !qtdEl) return;
  const needsQty = (unitSel.value === '40' || unitSel.value === 'metro - m') && !qtdEl.value.trim();
  qtdEl.classList.toggle('input-warn', needsQty);
}

const REQUIRED_HIGHLIGHT_FIELDS = ['cnpj', 'contratanteCep', 'nomeAldeia', 'obraCep', 'latitude', 'longitude'];

function updateRequiredHighlights(data, hasAnyData) {
  for (const key of REQUIRED_HIGHLIGHT_FIELDS) {
    const el = $(`f_${key}`);
    if (!el) continue;
    el.classList.toggle('input-warn', Boolean(hasAnyData && !data[key]));
  }
}

function armConfirmButton(btn, defaultLabel, onConfirm) {
  if (!btn) return;
  let timer = null;
  const reset = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    delete btn.dataset.confirmArmed;
    btn.textContent = defaultLabel;
    btn.classList.remove('btn-confirm');
  };
  btn.addEventListener('click', () => {
    if (btn.dataset.confirmArmed === '1') {
      reset();
      onConfirm();
      return;
    }
    btn.dataset.confirmArmed = '1';
    btn.textContent = 'Confirmar?';
    btn.classList.add('btn-confirm');
    timer = setTimeout(reset, 3000);
  });
}

function updateCardBadges() {
  const data = readFormData();
  const hasAnyData = Boolean(
    data.contratanteNome || data.cnpj || data.nomeAldeia || data.obraCep || data.latitude
  );
  updateRequiredHighlights(data, hasAnyData);

  const badgeC = $('badgeContrato');
  if (badgeC) {
    if (!hasAnyData) {
      badgeC.classList.add('hidden');
    } else if (!data.cnpj && !data.contratanteCep) {
      badgeC.textContent = '⚠ Falta CNPJ/CEP';
      badgeC.className = 'badge badge-warn';
    } else {
      badgeC.textContent = data.contratanteNome || data.cnpj;
      badgeC.className = 'badge';
    }
  }

  const badgeO = $('badgeObra');
  if (badgeO) {
    const extraCount = Math.max(0, allObras.length - 1);
    const extraSuffix = extraCount > 0 ? ` (+${extraCount})` : '';
    const firstAldeia = (allObras[0] && allObras[0].nomeAldeia) || data.nomeAldeia;
    if (!hasAnyData) {
      badgeO.classList.add('hidden');
    } else if (!data.latitude || !data.longitude) {
      badgeO.textContent = (firstAldeia ? `${firstAldeia} · ⚠ coord.` : '⚠ Falta coord.') + extraSuffix;
      badgeO.className = 'badge badge-warn';
    } else {
      badgeO.textContent = (firstAldeia ? `${firstAldeia} · 📍` : '📍 Coord. OK') + extraSuffix;
      badgeO.className = 'badge';
    }
  }
  renderObraTabs();
}

function syncActiveObraFromForm() {
  if (!allObras[activeObraIndex]) return;
  for (const k of OBRA_ADDRESS_FIELDS) {
    const el = $(`f_${k}`);
    if (el) allObras[activeObraIndex][k] = el.value.trim();
  }
}

function loadObraIntoForm(idx) {
  const obra = allObras[idx];
  if (!obra) return;
  activeObraIndex = idx;
  for (const k of OBRA_ADDRESS_FIELDS) {
    const el = $(`f_${k}`);
    if (el && obra[k] !== undefined) {
      el.value = obra[k];
    }
  }
  updateMapsLink();
  renderObraTabs();
}

function renderObraTabs() {
  const wrap = $('obraTabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (allObras.length <= 1) {
    wrap.classList.add('hidden');
    return;
  }
  wrap.classList.remove('hidden');
  allObras.forEach((obra, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `obra-tab${idx === activeObraIndex ? ' active' : ''}`;
    btn.textContent = `${idx + 1}º Endereço`;
    if (obra.nomeAldeia) btn.title = obra.nomeAldeia;
    btn.addEventListener('click', () => {
      syncActiveObraFromForm();
      loadObraIntoForm(idx);
      persistState();
    });
    wrap.appendChild(btn);
  });
}

function renderHistorySelect() {
  const row = $('historyRow');
  const sel = $('historySelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">Histórico recente (últimas 5)...</option>';
  if (recentHistory.length === 0) {
    if (row) row.classList.add('hidden');
    return;
  }
  if (row) row.classList.remove('hidden');
  for (const item of recentHistory) {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.label;
    sel.appendChild(opt);
  }
}

function addToHistory(rawInput, parsed) {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) return;
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const title = parsed.nomeAldeia || parsed.contratanteNome || 'Mensagem';
  const label = `${dd}/${mm} ${hh}:${min} · ${title}`;

  recentHistory = recentHistory.filter((h) => h.rawInput.trim() !== trimmed);
  recentHistory.unshift({
    id: `hist-${Date.now()}`,
    label: label.slice(0, 55),
    rawInput: trimmed
  });
  if (recentHistory.length > 5) {
    recentHistory = recentHistory.slice(0, 5);
  }
  renderHistorySelect();
}

function clearStepDoneStates() {
  document.querySelectorAll('.step-btn').forEach((btn) => {
    btn.classList.remove('done');
  });
}

function writeFormData(data) {
  for (const key of DATA_FIELDS) {
    const el = $(`f_${key}`);
    if (el && data[key] !== undefined) {
      el.value = data[key];
    }
  }
  updateObsMeta();
  updateMapsLink();
  updateCardBadges();
  updateQuantityHighlight();
}

function readSettings() {
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of SETTING_KEYS) {
    const el = $(`s_${key}`);
    if (!el) continue;
    settings[key] = el.type === 'checkbox' ? el.checked : el.value;
  }
  return settings;
}

function writeSettings(settings) {
  const merged = { ...DEFAULT_SETTINGS, ...settings };
  for (const key of SETTING_KEYS) {
    const el = $(`s_${key}`);
    if (!el) continue;
    if (el.type === 'checkbox') {
      el.checked = Boolean(merged[key]);
    } else {
      el.value = merged[key] ?? '';
    }
  }
}

function getSelectedPreset() {
  return (
    atividadePresets.find((p) => p.id === selectedPresetId) ||
    atividadePresets[0] ||
    DEFAULT_BIM_PRESET
  );
}

function renderPresetSelect() {
  const sel = $('s_atividadePresetId');
  const subWrap = $('eletricaSubgroup');
  const subSel = $('s_eletricaSubpreset');
  if (!sel) return;
  sel.innerHTML = '';

  const eletricaPresets = atividadePresets.filter((p) => p.builtIn && p.group === 'Elétrica');
  const otherBuiltIns = atividadePresets.filter((p) => p.builtIn && p.group !== 'Elétrica');
  const customPresets = atividadePresets.filter((p) => !p.builtIn);

  if (eletricaPresets.length > 0) {
    const opt = document.createElement('option');
    opt.value = 'group-eletrica';
    opt.textContent = '⚡ Elétrica';
    sel.appendChild(opt);
  }

  for (const preset of otherBuiltIns) {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = `${preset.name} (${preset.items.length})`;
    sel.appendChild(opt);
  }

  if (customPresets.length > 0) {
    const userGroup = document.createElement('optgroup');
    userGroup.label = '⭐ Salvos pelo usuário';
    for (const preset of customPresets) {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = `${preset.name} (${preset.items.length})`;
      userGroup.appendChild(opt);
    }
    sel.appendChild(userGroup);
  }

  if (subSel) {
    subSel.innerHTML = '';
    for (const preset of eletricaPresets) {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = `${preset.name} (${preset.items.length})`;
      subSel.appendChild(opt);
    }
  }

  const current = getSelectedPreset();
  selectedPresetId = current.id;
  const isEletrica = Boolean(current.builtIn && current.group === 'Elétrica');
  sel.value = isEletrica ? 'group-eletrica' : selectedPresetId;

  if (subWrap && subSel) {
    subWrap.classList.toggle('hidden', !isEletrica);
    if (isEletrica) {
      subSel.value = selectedPresetId;
    }
  }

  const isCustom = !current.builtIn;
  const delBtn = $('btnDeletePreset');
  if (delBtn) {
    delBtn.classList.toggle('hidden', !isCustom);
  }
  const delAllBtn = $('btnDeleteAllPresets');
  if (delAllBtn) {
    delAllBtn.classList.toggle('hidden', !isCustom);
  }
  renderAtividadeSummary(current);
}

function renderAtividadeSummary(preset) {
  const el = $('atividadeSummary');
  if (!el) return;
  if (!preset || !Array.isArray(preset.items) || preset.items.length === 0) {
    el.textContent = 'Nenhuma atividade neste preset. Lance na aba "Atividades Técnicas" e clique em Capturar.';
    return;
  }
  el.textContent = preset.items
    .map((item, idx) => {
      const parts = [
        item.CODIGO_NIVEL_ATUACAO_TOS && item.CODIGO_NIVEL_ATUACAO_TOS.text,
        item.CODIGO_ATIVIDADE_PROFISSIONAL_TOS && item.CODIGO_ATIVIDADE_PROFISSIONAL_TOS.text,
        item.OBRA_SERVICO_TOS && item.OBRA_SERVICO_TOS.text,
        item.QUANTIDADE ? `Qtd: ${item.QUANTIDADE}` : ''
      ].filter(Boolean);
      return `${idx + 1}. ${parts.join(' → ')}`;
    })
    .join(' | ');
}

function persistState() {
  syncActiveObraFromForm();
  const state = {
    rawInput: $('rawInput').value,
    data: readFormData(),
    allObras,
    activeObraIndex,
    settings: readSettings(),
    atividadePresets,
    selectedPresetId,
    recentHistory
  };
  chrome.storage.local.set({ creadfArtState: state });
}

function parseFromInput(opts = {}) {
  const { skipHistory = false } = opts;
  const raw = $('rawInput').value;
  if (!raw.trim()) {
    setStatus('Cole uma mensagem primeiro.', 'err');
    return;
  }
  const parsed = window.ArtParser.parseArtMessage(raw);
  allObras = Array.isArray(parsed.obras) && parsed.obras.length > 0 ? parsed.obras : [];
  activeObraIndex = 0;
  writeFormData(parsed);
  if (!skipHistory) {
    addToHistory(raw, parsed);
  }
  clearStepDoneStates();
  persistState();
  const totalEnderecos = allObras.length;
  setStatus(
    totalEnderecos > 1
      ? `Dados extraídos (${totalEnderecos} endereços de obra)! Confira e clique em Preencher.`
      : 'Dados extraídos! Confira e clique em Preencher.',
    'ok'
  );
}

async function getActiveArtTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    throw new Error('Nenhuma aba ativa encontrada.');
  }
  if (!tab.url || !tab.url.startsWith('https://art.creadf.org.br/')) {
    throw new Error('Abra o site art.creadf.org.br na aba ativa.');
  }
  try {
    const pong = await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
    if (pong && pong.ok) return tab.id;
  } catch (_) {
    // Content script not yet injected on an already-open tab; inject now
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  return tab.id;
}

async function sendToPage(payload) {
  const tabId = await getActiveArtTab();
  return chrome.tabs.sendMessage(tabId, payload);
}

async function lancarAtividadeNaPagina(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: () => {
      if (typeof window.lanca_item === 'function') {
        window.lanca_item();
      }
    }
  });
}

async function pesquisarCepNaPagina(tabId, endNum) {
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    args: [endNum],
    func: (num) => {
      if (typeof window.PesquisaCep === 'function') {
        window.PesquisaCep(num, 1, window.location.hostname || 'art.creadf.org.br');
      }
    }
  });
}

async function cadastrarEnderecoObraNaPagina(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: () => {
      if (typeof window.dados_endereco_obraservico === 'function') {
        window.dados_endereco_obraservico('CADASTRAR');
      } else {
        const link = document.querySelector('a[href*="dados_endereco_obraservico"]');
        if (link) link.click();
      }
    }
  });
}

function formatQuantity4Dec(raw) {
  if (raw === undefined || raw === null) return '';
  const cleaned = String(raw).trim();
  if (!cleaned) return '';
  let num;
  if (cleaned.includes(',')) {
    num = Number(cleaned.replace(/\./g, '').replace(',', '.'));
  } else {
    num = Number(cleaned);
  }
  if (!Number.isFinite(num) || num <= 0) return '';
  return num.toFixed(4).replace('.', ',');
}

async function applyPresetAtividades(tabId, preset, onProgress) {
  const unidadeOverride = ($('s_atividadeUnidadeOverride') && $('s_atividadeUnidadeOverride').value) || '';
  const qtdRaw = ($('f_atividadeQuantidade') && $('f_atividadeQuantidade').value.trim()) || '';
  const qtdFormatted = formatQuantity4Dec(qtdRaw);

  if (unidadeOverride === '40' && !qtdFormatted) {
    updateQuantityHighlight();
    throw new Error('Informe a Quantidade / Área em m² no card 4 antes de lançar.');
  }
  if (unidadeOverride === 'metro - m' && !qtdFormatted) {
    updateQuantityHighlight();
    throw new Error('Informe a Quantidade / Metragem em m no card 4 antes de lançar.');
  }

  let count = 0;
  const items = (preset && preset.items) || [];
  for (let i = 0; i < items.length; i++) {
    if (onProgress) onProgress(i + 1, items.length);
    const item = items[i];
    const effective = { ...item };
    if (unidadeOverride === '73') {
      effective.CODIGO_DA_UNIDADE = { value: '73', text: 'unidade - un' };
      effective.QUANTIDADE = qtdFormatted || '1,0000';
    } else if (unidadeOverride === '40') {
      effective.CODIGO_DA_UNIDADE = { value: '40', text: 'metros quadrados - m2' };
      effective.QUANTIDADE = qtdFormatted;
    } else if (unidadeOverride === 'metro - m') {
      effective.CODIGO_DA_UNIDADE = { text: 'metro - m' };
      effective.QUANTIDADE = qtdFormatted;
    } else if (qtdFormatted) {
      effective.QUANTIDADE = qtdFormatted;
    }

    const actRes = await chrome.tabs.sendMessage(tabId, {
      type: 'FILL',
      step: 'apply_atividade',
      preset: effective
    });
    if (actRes && actRes.ok) {
      count += actRes.filled || 0;
      await lancarAtividadeNaPagina(tabId);
      count += 1;
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return count;
}

function setFillingState(busy, label = '') {
  isFilling = busy;
  const fillAllBtn = $('btnFillAll');
  if (fillAllBtn) {
    fillAllBtn.disabled = busy;
    fillAllBtn.textContent = busy && label ? label : 'Preencher ART Completa';
  }
  document.querySelectorAll('.step-btn').forEach((btn) => {
    btn.disabled = busy;
  });
}

async function handleFill(step) {
  if (isFilling) return;
  try {
    setFillingState(true, 'Preenchendo formulário...');
    setStatus('Preenchendo campos...');
    syncActiveObraFromForm();
    const rawData = readFormData();
    const data =
      allObras.length > 0
        ? { ...rawData, ...allObras[0] }
        : rawData;
    const settings = readSettings();
    persistState();
    const tabId = await getActiveArtTab();
    let totalFilled = 0;

    if (step !== 'atividades') {
      const res = await chrome.tabs.sendMessage(tabId, { type: 'FILL', step, data, settings });
      if (!res || !res.ok) {
        setStatus((res && res.error) || 'Não foi possível preencher.', 'err');
        return;
      }
      totalFilled += res.filled || 0;
    }

    if (step === 'all' || step === 'contrato') {
      if (data.contratanteCep) {
        setFillingState(true, 'Consultando CEP...');
        await pesquisarCepNaPagina(tabId, 1);
      }
      const endRes = await chrome.tabs.sendMessage(tabId, {
        type: 'FILL',
        step: 'override_contrato_endereco',
        data,
        settings
      });
      if (endRes && endRes.ok) {
        totalFilled += endRes.filled || 0;
      }
    }

    if ((step === 'all' || step === 'obra') && allObras.length > 1) {
      for (let i = 1; i < allObras.length; i++) {
        setFillingState(true, `Adicionando endereço ${i + 1}/${allObras.length}...`);
        const contRes = await chrome.tabs.sendMessage(tabId, { type: 'FILL', step: 'get_obra_cont' });
        const prevCont = (contRes && contRes.cont) || '';
        await cadastrarEnderecoObraNaPagina(tabId);
        await chrome.tabs.sendMessage(tabId, { type: 'FILL', step: 'wait_obra_added', prevCont });
        const extraRes = await chrome.tabs.sendMessage(tabId, {
          type: 'FILL',
          step: 'obra_extra',
          data: allObras[i],
          settings,
          containerId: `div_dados_enderecos_obraservico_${prevCont}`
        });
        if (extraRes && extraRes.ok) {
          totalFilled += extraRes.filled || 0;
        }
      }
    }

    if (
      (step === 'all' && settings.lancarAtividadesPadrao !== false) ||
      step === 'atividades'
    ) {
      setStatus('Lançando atividades técnicas...');
      totalFilled += await applyPresetAtividades(tabId, getSelectedPreset(), (idx, total) => {
        setFillingState(true, `Lançando atividade ${idx}/${total}...`);
      });
    }

    if (step === 'all') {
      document.querySelectorAll('.step-btn').forEach((btn) => btn.classList.add('done'));
    } else {
      const stepBtn = document.querySelector(`.step-btn[data-step="${step}"]`);
      if (stepBtn) stepBtn.classList.add('done');
    }

    setStatus(`Preenchido (${totalFilled} campo(s)).`, 'ok');
    if (step === 'all') {
      openReviewModal();
    }
  } catch (err) {
    setStatus(err.message || 'Erro ao comunicar com a página.', 'err');
  } finally {
    setFillingState(false);
  }
}

function openReviewModal() {
  const modal = $('reviewModal');
  if (modal) modal.classList.remove('hidden');
}

function closeReviewModal() {
  const modal = $('reviewModal');
  if (modal) modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('creadfArtState', (res) => {
    const state = res && res.creadfArtState;
    if (state) {
      if (state.rawInput) $('rawInput').value = state.rawInput;
      allObras = Array.isArray(state.allObras) ? state.allObras : [];
      activeObraIndex =
        Number.isInteger(state.activeObraIndex) && state.activeObraIndex < allObras.length
          ? state.activeObraIndex
          : 0;
      if (state.data) writeFormData(state.data);
      if (allObras[activeObraIndex]) loadObraIntoForm(activeObraIndex);
      writeSettings(state.settings || {});
      if (Array.isArray(state.atividadePresets) && state.atividadePresets.length > 0) {
        const builtInIds = new Set(BUILT_IN_PRESETS.map((p) => p.id));
        const customPresets = state.atividadePresets.filter(
          (p) => p && !p.builtIn && !builtInIds.has(p.id)
        );
        atividadePresets = [...BUILT_IN_PRESETS, ...customPresets];
      } else {
        atividadePresets = [...BUILT_IN_PRESETS];
      }
      if (state.selectedPresetId) {
        selectedPresetId = state.selectedPresetId;
      }
      if (Array.isArray(state.recentHistory)) {
        recentHistory = state.recentHistory.slice(0, 5);
      }
    } else {
      writeSettings(DEFAULT_SETTINGS);
    }
    renderPresetSelect();
    renderHistorySelect();
    updateCardBadges();
    updateQuantityHighlight();
  });

  $('historySelect').addEventListener('change', (e) => {
    const id = e.target.value;
    if (!id) return;
    const item = recentHistory.find((h) => h.id === id);
    if (item) {
      $('rawInput').value = item.rawInput;
      parseFromInput({ skipHistory: true });
    }
    e.target.value = '';
  });

  $('btnClearHistory').addEventListener('click', () => {
    recentHistory = [];
    renderHistorySelect();
    persistState();
    setStatus('Histórico limpo.');
  });

  $('btnPaste').addEventListener('click', async () => {
    let text = '';
    try {
      text = await navigator.clipboard.readText();
    } catch (_) {
      const ta = $('rawInput');
      if (ta) {
        ta.value = '';
        ta.focus();
        document.execCommand('paste');
        text = ta.value;
      }
    }
    if (!text || !text.trim()) {
      setStatus('Área de transferência vazia ou bloqueada. Cole com Ctrl+V.', 'err');
      return;
    }
    $('rawInput').value = text;
    parseFromInput();
  });

  $('btnParse').addEventListener('click', () => parseFromInput());
  $('rawInput').addEventListener('paste', () => {
    setTimeout(() => parseFromInput(), 30);
  });

  const mapsLink = $('mapsLink');
  if (mapsLink) {
    mapsLink.addEventListener('click', (e) => e.stopPropagation());
  }

  $('btnClear').addEventListener('click', () => {
    $('rawInput').value = '';
    allObras = [];
    activeObraIndex = 0;
    const empty = {};
    for (const k of DATA_FIELDS) empty[k] = '';
    writeFormData(empty);
    clearStepDoneStates();
    persistState();
    setStatus('Campos limpos.');
  });

  armConfirmButton($('btnResetAll'), 'Resetar Tudo', () => {
    $('rawInput').value = '';
    allObras = [];
    activeObraIndex = 0;
    const empty = {};
    for (const k of DATA_FIELDS) empty[k] = '';
    writeFormData(empty);
    writeSettings(DEFAULT_SETTINGS);
    selectedPresetId = DEFAULT_BIM_PRESET_ID;
    const presetNameEl = $('presetNameInput');
    if (presetNameEl) presetNameEl.value = '';
    renderPresetSelect();
    clearStepDoneStates();
    updateCardBadges();
    updateQuantityHighlight();
    persistState();
    setStatus('Tudo resetado para o padrão (presets salvos mantidos).', 'ok');
  });

  for (const key of DATA_FIELDS) {
    const el = $(`f_${key}`);
    if (!el) continue;
    el.addEventListener('input', () => {
      if (OBRA_ADDRESS_FIELDS.includes(key)) syncActiveObraFromForm();
      if (key === 'observacoes') updateObsMeta();
      if (key === 'latitude' || key === 'longitude') updateMapsLink();
      if (key === 'atividadeQuantidade') updateQuantityHighlight();
      updateCardBadges();
      persistState();
    });
  }

  for (const key of SETTING_KEYS) {
    const el = $(`s_${key}`);
    if (!el) continue;
    el.addEventListener('change', persistState);
  }

  $('btnFillAll').addEventListener('click', () => handleFill('all'));

  const closeModalBtn = $('btnCloseReviewModal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeReviewModal);
  }
  const reviewModal = $('reviewModal');
  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReviewModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeReviewModal();
  });

  $('btnLancarObs').addEventListener('click', () => {
    const obs = ($('f_observacoes') && $('f_observacoes').value.trim()) || '';
    if (!obs) {
      setStatus('Digite uma observação antes de lançar.', 'err');
      return;
    }
    handleFill('observacoes');
  });

  document.querySelectorAll('.step-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleFill(btn.dataset.step));
  });

  $('s_atividadePresetId').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'group-eletrica') {
      const subSel = $('s_eletricaSubpreset');
      selectedPresetId = (subSel && subSel.value) || DEFAULT_BIM_PRESET_ID;
    } else {
      selectedPresetId = val;
    }
    renderPresetSelect();
    persistState();
  });

  $('s_eletricaSubpreset').addEventListener('change', (e) => {
    selectedPresetId = e.target.value;
    renderPresetSelect();
    persistState();
  });

  $('s_atividadeUnidadeOverride').addEventListener('change', (e) => {
    const val = e.target.value;
    const qtdEl = $('f_atividadeQuantidade');
    if (val === '73' && qtdEl && !qtdEl.value.trim()) {
      qtdEl.value = '1,0000';
    }
    updateQuantityHighlight();
    persistState();
  });

  $('btnDeletePreset').addEventListener('click', () => {
    const current = getSelectedPreset();
    if (!current || current.builtIn) return;
    atividadePresets = atividadePresets.filter((p) => p.id !== current.id);
    selectedPresetId = DEFAULT_BIM_PRESET_ID;
    renderPresetSelect();
    persistState();
    setStatus(`Preset "${current.name}" excluído.`);
  });

  armConfirmButton($('btnDeleteAllPresets'), 'Excluir Todos', () => {
    const customCount = atividadePresets.filter((p) => !p.builtIn).length;
    if (customCount === 0) return;
    atividadePresets = atividadePresets.filter((p) => p.builtIn);
    selectedPresetId = DEFAULT_BIM_PRESET_ID;
    renderPresetSelect();
    persistState();
    setStatus(`${customCount} preset(s) salvo(s) excluído(s).`);
  });

  $('btnCaptureAtividade').addEventListener('click', async () => {
    try {
      const res = await sendToPage({ type: 'FILL', step: 'capture_atividade' });
      if (!res || !res.ok || !res.preset || !Array.isArray(res.preset.items) || res.preset.items.length === 0) {
        setStatus((res && res.error) || 'Lance ou selecione ao menos uma atividade na página antes de capturar.', 'err');
        return;
      }
      const items = res.preset.items;
      const customName = $('presetNameInput').value.trim();
      const first = items[0];
      const autoName = [
        first.CODIGO_NIVEL_ATUACAO_TOS && first.CODIGO_NIVEL_ATUACAO_TOS.text,
        first.CODIGO_ATIVIDADE_PROFISSIONAL_TOS && first.CODIGO_ATIVIDADE_PROFISSIONAL_TOS.text
      ]
        .filter(Boolean)
        .join(' · ') || 'Preset capturado';

      const newPreset = {
        id: `preset-${Date.now()}`,
        name: customName || autoName,
        builtIn: false,
        items
      };
      atividadePresets.push(newPreset);
      selectedPresetId = newPreset.id;
      $('presetNameInput').value = '';
      renderPresetSelect();
      persistState();
      setStatus(`Preset "${newPreset.name}" salvo (${items.length} atividade(s))!`, 'ok');
    } catch (err) {
      setStatus(err.message || 'Erro ao capturar atividade.', 'err');
    }
  });

  $('btnApplyAtividade').addEventListener('click', async () => {
    const preset = getSelectedPreset();
    if (!preset || !preset.items || preset.items.length === 0) {
      setStatus('Nenhum preset selecionado.', 'err');
      return;
    }
    try {
      setStatus(`Aplicando preset "${preset.name}"...`);
      const tabId = await getActiveArtTab();
      const count = await applyPresetAtividades(tabId, preset);
      setStatus(`Preset "${preset.name}" lançado (${count} ação(ões)).`, 'ok');
    } catch (err) {
      setStatus(err.message || 'Erro ao aplicar preset.', 'err');
    }
  });

  $('btnExportPresets').addEventListener('click', () => {
    const custom = atividadePresets.filter((p) => !p.builtIn);
    if (custom.length === 0) {
      setStatus('Capture ao menos um preset personalizado antes de exportar.', 'err');
      return;
    }
    const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'creadf-presets.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`${custom.length} preset(s) exportado(s)!`, 'ok');
  });

  $('btnImportPresets').addEventListener('click', () => {
    $('importPresetsFile').click();
  });

  $('importPresetsFile').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'));
        if (!Array.isArray(parsed)) throw new Error('Formato inválido.');
        let added = 0;
        for (const p of parsed) {
          if (!p || !p.name || !Array.isArray(p.items) || p.items.length === 0) continue;
          atividadePresets.push({
            id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: String(p.name).slice(0, 50),
            builtIn: false,
            items: p.items
          });
          added++;
        }
        if (added === 0) {
          setStatus('Nenhum preset válido encontrado no arquivo.', 'err');
          return;
        }
        selectedPresetId = atividadePresets[atividadePresets.length - 1].id;
        renderPresetSelect();
        persistState();
        setStatus(`${added} preset(s) importado(s)!`, 'ok');
      } catch (err) {
        setStatus('Erro ao importar JSON de presets.', 'err');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  });
});
