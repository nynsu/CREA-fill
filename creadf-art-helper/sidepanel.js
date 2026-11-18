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
  name: 'BIM Elétrica + SPDA (Padrão)',
  builtIn: true,
  items: DEFAULT_ATIVIDADES_BIM
};

let atividadePresets = [DEFAULT_BIM_PRESET];
let selectedPresetId = DEFAULT_BIM_PRESET_ID;
let recentHistory = [];
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
  const needsArea = unitSel.value === '40' && !qtdEl.value.trim();
  qtdEl.classList.toggle('input-warn', needsArea);
}

function updateCardBadges() {
  const data = readFormData();
  const hasAnyData = Boolean(
    data.contratanteNome || data.cnpj || data.nomeAldeia || data.obraCep || data.latitude
  );

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
    if (!hasAnyData) {
      badgeO.classList.add('hidden');
    } else if (!data.latitude || !data.longitude) {
      badgeO.textContent = data.nomeAldeia ? `${data.nomeAldeia} · ⚠ coord.` : '⚠ Falta coord.';
      badgeO.className = 'badge badge-warn';
    } else {
      badgeO.textContent = data.nomeAldeia ? `${data.nomeAldeia} · 📍` : '📍 Coord. OK';
      badgeO.className = 'badge';
    }
  }
}

function renderHistorySelect() {
  const sel = $('historySelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">Histórico recente (últimas 5)...</option>';
  if (recentHistory.length === 0) {
    sel.classList.add('hidden');
    return;
  }
  sel.classList.remove('hidden');
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
  if (!sel) return;
  sel.innerHTML = '';
  for (const preset of atividadePresets) {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = `${preset.name} (${preset.items.length})`;
    sel.appendChild(opt);
  }
  const current = getSelectedPreset();
  selectedPresetId = current.id;
  sel.value = selectedPresetId;

  const delBtn = $('btnDeletePreset');
  if (delBtn) {
    delBtn.disabled = Boolean(current.builtIn);
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
  const state = {
    rawInput: $('rawInput').value,
    data: readFormData(),
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
  writeFormData(parsed);
  if (!skipHistory) {
    addToHistory(raw, parsed);
  }
  clearStepDoneStates();
  persistState();
  setStatus('Dados extraídos! Confira e clique em Preencher.', 'ok');
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
    const data = readFormData();
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
  } catch (err) {
    setStatus(err.message || 'Erro ao comunicar com a página.', 'err');
  } finally {
    setFillingState(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('creadfArtState', (res) => {
    const state = res && res.creadfArtState;
    if (state) {
      if (state.rawInput) $('rawInput').value = state.rawInput;
      if (state.data) writeFormData(state.data);
      writeSettings(state.settings || {});
      if (Array.isArray(state.atividadePresets) && state.atividadePresets.length > 0) {
        const hasBuiltIn = state.atividadePresets.some((p) => p.id === DEFAULT_BIM_PRESET_ID);
        atividadePresets = hasBuiltIn
          ? state.atividadePresets
          : [DEFAULT_BIM_PRESET, ...state.atividadePresets];
      } else {
        atividadePresets = [DEFAULT_BIM_PRESET];
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
    const empty = {};
    for (const k of DATA_FIELDS) empty[k] = '';
    writeFormData(empty);
    clearStepDoneStates();
    persistState();
    setStatus('Campos limpos.');
  });

  for (const key of DATA_FIELDS) {
    const el = $(`f_${key}`);
    if (!el) continue;
    el.addEventListener('input', () => {
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
