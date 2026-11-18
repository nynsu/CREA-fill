(() => {
  if (window.__creadfArtHelperLoaded) return;
  window.__creadfArtHelperLoaded = true;

  function byId(id) {
    return document.getElementById(id);
  }

  function setFieldValue(id, value, opts = {}) {
    const el = byId(id);
    if (!el || value === undefined || value === null || value === '') return false;
    const { forceEnable = false, dispatchInput = true, dispatchChange = false } = opts;

    const wasDisabled = el.disabled;
    const wasReadOnly = el.readOnly;
    if (forceEnable) {
      el.disabled = false;
      el.readOnly = false;
    }

    if (el.tagName === 'SELECT') {
      const target = String(value).trim();
      let matched = false;
      for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].value === target) {
          el.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const lower = target.toLowerCase();
        for (let i = 0; i < el.options.length; i++) {
          if (el.options[i].text.trim().toLowerCase() === lower) {
            el.selectedIndex = i;
            matched = true;
            break;
          }
        }
      }
      if (!matched) return false;
    } else {
      const maxLen = el.maxLength > 0 ? el.maxLength : 0;
      const strVal = maxLen > 0 ? String(value).slice(0, maxLen) : String(value);
      el.value = strVal;
    }

    if (dispatchInput) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (dispatchChange) {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (forceEnable && wasDisabled) {
      // Keep enabled only if we had to force-enable a non-UF field; UF[10] is enabled by habilita_form() on submit
      if (!id.startsWith('UF[')) el.disabled = wasDisabled;
    }
    if (forceEnable && wasReadOnly && !id.startsWith('DESCRICAO_DO_LOGRADOURO') && !id.startsWith('CIDADE')) {
      el.readOnly = wasReadOnly;
    }

    return true;
  }

  function waitForCondition(checkFn, timeoutMs = 2500, intervalMs = 150) {
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (checkFn() || Date.now() - start >= timeoutMs) {
          clearInterval(timer);
          resolve(checkFn());
        }
      }, intervalMs);
    });
  }

  function fillIniciais(settings) {
    let count = 0;
    if (setFieldValue('FORMA_DE_REGISTRO', settings.formaRegistro || '1', { dispatchChange: true })) count++;
    if (setFieldValue('PARTICIPACAO_TECNICA', settings.participacaoTecnica || '1', { dispatchChange: true })) count++;
    const ainId = settings.artAin === '1' ? 'art_ain_sim' : 'art_ain_nao';
    const ainEl = byId(ainId);
    if (ainEl) {
      ainEl.click();
      count++;
    }
    return count;
  }

  function formatDateBR(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function addOneYear(date) {
    const next = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    if (next.getMonth() !== date.getMonth()) {
      // Clamp Feb 29 -> Feb 28 in non-leap years
      return new Date(date.getFullYear() + 1, date.getMonth() + 1, 0);
    }
    return next;
  }

  function formatCurrencyBR(raw) {
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

    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  async function fillContrato(data, settings) {
    let count = 0;
    if (setFieldValue('TIPO_DE_CONTRATANTE[1]', settings.tipoContratante || '3')) count++;
    if (setFieldValue('NOME[1]', data.contratanteNome)) count++;
    if (setFieldValue('E_MAIL[1]', data.email)) count++;
    if (setFieldValue('DDD[1]', data.ddd)) count++;
    if (setFieldValue('TELEFONE[1]', data.telefone)) count++;

    if (settings.preencherDatasContratoHoje !== false) {
      const hoje = new Date();
      const fim = addOneYear(hoje);
      if (setFieldValue('DATA_CELEBRACAO_CONTRATO', formatDateBR(hoje), { dispatchChange: true })) count++;
      if (setFieldValue('DATA_FIM_CONTRATO', formatDateBR(fim), { dispatchChange: true })) count++;
    }

    const valorPadrao = formatCurrencyBR(
      settings.valorContratoPadrao !== undefined && settings.valorContratoPadrao !== ''
        ? settings.valorContratoPadrao
        : '1000'
    );
    if (valorPadrao) {
      if (setFieldValue('VALOR_DO_CONTRATO[1]', valorPadrao, { dispatchInput: true, dispatchChange: true })) count++;
    }

    if (settings.acaoInstitucional !== undefined && settings.acaoInstitucional !== '') {
      if (setFieldValue('ACAO_INSTITUCIONAL[1]', settings.acaoInstitucional, { dispatchChange: true })) count++;
    }

    if (data.contratanteCep) {
      if (setFieldValue('CEP[1]', data.contratanteCep, { dispatchInput: true })) count++;
    }

    if (data.cnpj) {
      if (setFieldValue('CPF_CNPJ[1]', data.cnpj, { dispatchInput: true, dispatchChange: false })) count++;
    }

    return count;
  }

  async function overrideContratoEndereco(data, settings) {
    let count = 0;

    if (data.contratanteCep) {
      await waitForCondition(() => {
        const l = byId('DESCRICAO_DO_LOGRADOURO[1]');
        const c = byId('CIDADE[1]');
        const u = byId('UF[1]');
        return ((l && l.value.trim()) || (c && c.value.trim())) && u && u.value;
      }, 4000, 150);
    }

    if (setFieldValue('DESCRICAO_DO_LOGRADOURO[1]', data.contratanteEndereco, { forceEnable: true })) count++;

    const numC = data.contratanteNumero || settings.contratanteNumeroPadrao || 'S/N';
    if (setFieldValue('NUMERO[1]', numC)) count++;
    if (data.contratanteComplemento) {
      if (setFieldValue('COMPLEMENTO[1]', data.contratanteComplemento)) count++;
    } else {
      const comp1 = byId('COMPLEMENTO[1]');
      if (comp1 && comp1.value) {
        comp1.value = '';
        comp1.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    if (setFieldValue('BAIRRO[1]', data.contratanteBairro, { forceEnable: true })) count++;
    if (setFieldValue('CIDADE[1]', data.contratanteCidade, { forceEnable: true })) count++;
    if (setFieldValue('UF[1]', data.contratanteUf, { forceEnable: true })) count++;

    return count;
  }

  async function fillObra(data, settings) {
    let count = 0;

    if (settings.repetirProprietario) {
      const cnpj = (byId('CPF_CNPJ[1]') && byId('CPF_CNPJ[1]').value) || data.cnpj;
      const nome = (byId('NOME[1]') && byId('NOME[1]').value) || data.contratanteNome;
      const email = (byId('E_MAIL[1]') && byId('E_MAIL[1]').value) || data.email;
      const ddd = (byId('DDD[1]') && byId('DDD[1]').value) || data.ddd;
      const tel = (byId('TELEFONE[1]') && byId('TELEFONE[1]').value) || data.telefone;

      if (setFieldValue('CPF_CNPJ[2]', cnpj)) count++;
      if (setFieldValue('NOME[2]', nome)) count++;
      if (setFieldValue('E_MAIL[2]', email)) count++;
      if (setFieldValue('DDD[2]', ddd)) count++;
      if (setFieldValue('TELEFONE[2]', tel)) count++;
    }

    if (settings.finalidade) {
      if (setFieldValue('CODIGO_DA_FINALIDADE', settings.finalidade)) count++;
    }

    if (settings.preencherDatasContratoHoje !== false) {
      const hoje = new Date();
      const fim = addOneYear(hoje);
      if (setFieldValue('DATA_PREVISTA_DE_INICIO2', formatDateBR(hoje), { dispatchChange: true })) count++;
      if (setFieldValue('DATA_PREVISTA_DE_CONCLUSAO2', formatDateBR(fim), { dispatchChange: true })) count++;
    }

    if (setFieldValue('LATITUDE2', data.latitude)) count++;
    if (setFieldValue('LONGITUDE2', data.longitude)) count++;

    if (data.obraCep) {
      if (setFieldValue('CEP[10]', data.obraCep, { dispatchInput: true })) count++;

      // Trigger CREA-DF CEP lookup and wait briefly for CIDADE[10]/UF[10] to populate
      const cep10 = byId('CEP[10]');
      if (cep10) {
        const prevCidade = (byId('CIDADE[10]') && byId('CIDADE[10]').value) || '';
        cep10.dispatchEvent(new Event('blur', { bubbles: true }));
        await waitForCondition(() => {
          const c = byId('CIDADE[10]');
          const u = byId('UF[10]');
          return c && c.value && c.value !== prevCidade && u && u.value;
        }, 1800, 150);
      }
    }

    // Apply Aldeia address AFTER PesquisaCep finishes so it isn't overwritten
    if (data.nomeAldeia) {
      if (setFieldValue('DESCRICAO_DO_LOGRADOURO[10]', data.nomeAldeia, { forceEnable: true })) count++;
    }

    const obraNum = data.obraNumero || settings.obraNumeroPadrao || 'S/N';
    if (setFieldValue('NUMERO[10]', obraNum)) count++;

    const currentBairro = (byId('BAIRRO[10]') && byId('BAIRRO[10]').value.trim()) || '';
    const obraBairro = data.obraBairro || currentBairro || settings.obraBairroPadrao || 'ZONA RURAL';
    if (setFieldValue('BAIRRO[10]', obraBairro, { forceEnable: true })) count++;

    if (data.obraComplemento) {
      if (setFieldValue('COMPLEMENTO[10]', data.obraComplemento)) count++;
    }

    const cidadeEl = byId('CIDADE[10]');
    if ((!cidadeEl || !cidadeEl.value.trim()) && data.obraCidade) {
      if (setFieldValue('CIDADE[10]', data.obraCidade, { forceEnable: true })) count++;
    }

    const ufEl = byId('UF[10]');
    if ((!ufEl || !ufEl.value) && data.obraUf) {
      if (setFieldValue('UF[10]', data.obraUf, { forceEnable: true })) count++;
    }

    return count;
  }

  function fillObservacoes(data) {
    if (!data || !data.observacoes || !String(data.observacoes).trim()) {
      return 0;
    }
    let count = 0;
    const aceite = byId('aceiteObs');
    if (aceite && !aceite.checked) {
      aceite.checked = true;
      aceite.dispatchEvent(new Event('change', { bubbles: true }));
      count++;
    }
    if (setFieldValue('OBSERVACOES', data.observacoes, { forceEnable: true, dispatchInput: true, dispatchChange: true })) {
      const obsEl = byId('OBSERVACOES');
      if (obsEl) obsEl.dispatchEvent(new Event('blur', { bubbles: true }));
      count++;
    }
    return count;
  }

  function fillDeclaracoes(settings) {
    let count = 0;
    const clausulaId = settings.clausula === '0' ? 'CODIGO_CLAUSULA_COMPROMISSORIA2' : 'CODIGO_CLAUSULA_COMPROMISSORIA1';
    const clausulaEl = byId(clausulaId);
    if (clausulaEl) {
      clausulaEl.click();
      count++;
    }

    const acessId = settings.acessibilidade === '0' ? 'ACESSIBILIDADE2' : 'ACESSIBILIDADE1';
    const acessEl = byId(acessId);
    if (acessEl) {
      acessEl.click();
      count++;
    }
    return count;
  }

  function getSelectText(id) {
    const el = byId(id);
    if (!el || el.selectedIndex < 0) return { value: '', text: '' };
    const opt = el.options[el.selectedIndex];
    return { value: opt ? opt.value : '', text: opt ? opt.text.trim() : '' };
  }

  function captureAtividade() {
    const lista = byId('lista_atividades');
    if (lista && lista.options && lista.options.length > 0) {
      const unpad = (s) => {
        const n = parseInt(s, 10);
        return Number.isFinite(n) && n > 0 ? String(n) : '';
      };
      const items = [];
      for (let i = 0; i < lista.options.length; i++) {
        const opt = lista.options[i];
        const rawValParts = (opt.value || '').split('-');
        const textParts = (opt.text || '').split(' » ').map((s) => s.trim());
        const qtdUni = textParts[6] || '';
        const qtdMatch = qtdUni.match(/^([\d.,]+)\s+(.*)$/);
        items.push({
          CODIGO_NIVEL_ATUACAO_TOS: { value: unpad(rawValParts[0]), text: textParts[0] || '' },
          CODIGO_ATIVIDADE_PROFISSIONAL_TOS: { value: unpad(rawValParts[1]), text: textParts[1] || '' },
          ID_TOS: { value: unpad(rawValParts[2]), text: textParts[2] || '' },
          SUB_GRUPO_TOS: { value: unpad(rawValParts[3]), text: textParts[3] || '' },
          OBRA_SERVICO_TOS: { value: unpad(rawValParts[4]), text: textParts[4] || '' },
          COMPLEMENTO_TOS: { value: unpad(rawValParts[5]), text: textParts[5] || '' },
          CODIGO_DA_UNIDADE: { value: unpad(rawValParts[7]), text: qtdMatch ? qtdMatch[2].trim() : '' },
          QUANTIDADE: qtdMatch ? qtdMatch[1].trim() : '1,0000'
        });
      }
      return { items };
    }

    const fields = [
      'CODIGO_NIVEL_ATUACAO_TOS',
      'CODIGO_ATIVIDADE_PROFISSIONAL_TOS',
      'ID_TOS',
      'SUB_GRUPO_TOS',
      'OBRA_SERVICO_TOS',
      'COMPLEMENTO_TOS',
      'CODIGO_DA_UNIDADE'
    ];
    const single = {};
    for (const id of fields) {
      single[id] = getSelectText(id);
    }
    const qtdEl = byId('QUANTIDADE');
    single.QUANTIDADE = qtdEl ? qtdEl.value : '';

    if (!single.CODIGO_NIVEL_ATUACAO_TOS || !single.CODIGO_NIVEL_ATUACAO_TOS.value) {
      return { items: [] };
    }
    return { items: [single] };
  }

  async function applyAtividade(preset) {
    if (!preset) return 0;
    const cascade = [
      'CODIGO_NIVEL_ATUACAO_TOS',
      'CODIGO_ATIVIDADE_PROFISSIONAL_TOS',
      'ID_TOS',
      'SUB_GRUPO_TOS',
      'OBRA_SERVICO_TOS',
      'COMPLEMENTO_TOS'
    ];
    let count = 0;
    for (let i = 0; i < cascade.length; i++) {
      const id = cascade[i];
      const item = preset[id];
      if (!item || (!item.value && !item.text)) continue;

      const targetVal = item.value ? String(item.value).trim() : '';
      const targetText = item.text ? String(item.text).trim().toLowerCase() : '';

      await waitForCondition(() => {
        const el = byId(id);
        return (
          el &&
          el.options.length > 0 &&
          Array.from(el.options).some(
            (o) =>
              (targetVal && o.value === targetVal) ||
              (targetText && o.text.trim().toLowerCase() === targetText)
          )
        );
      }, 4000, 150);

      const ok = setFieldValue(id, item.value || item.text, { dispatchChange: true });
      if (ok) count++;
    }

    if (preset.CODIGO_DA_UNIDADE && (preset.CODIGO_DA_UNIDADE.value || preset.CODIGO_DA_UNIDADE.text)) {
      if (setFieldValue('CODIGO_DA_UNIDADE', preset.CODIGO_DA_UNIDADE.value || preset.CODIGO_DA_UNIDADE.text)) count++;
    }
    if (preset.QUANTIDADE) {
      if (setFieldValue('QUANTIDADE', preset.QUANTIDADE, { dispatchInput: true })) count++;
    }

    return count;
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || !msg.type) return;

    if (msg.type === 'PING') {
      sendResponse({ ok: true, isArtForm: Boolean(byId('doc')) });
      return;
    }

    if (!byId('doc')) {
      sendResponse({ ok: false, error: 'Abra a página de cadastro de ART do CREA-DF primeiro.' });
      return;
    }

    (async () => {
      try {
        const { step, data, settings, preset } = msg;
        let filled = 0;
        if (step === 'all') {
          filled += fillIniciais(settings || {});
          filled += await fillContrato(data || {}, settings || {});
          filled += await fillObra(data || {}, settings || {});
          if (settings && settings.preencherObservacoes) {
            filled += fillObservacoes(data || {});
          }
          filled += fillDeclaracoes(settings || {});
        } else if (step === 'iniciais') {
          filled += fillIniciais(settings || {});
        } else if (step === 'contrato') {
          filled += await fillContrato(data || {}, settings || {});
        } else if (step === 'override_contrato_endereco') {
          filled += await overrideContratoEndereco(data || {}, settings || {});
        } else if (step === 'obra') {
          filled += await fillObra(data || {}, settings || {});
        } else if (step === 'observacoes') {
          filled += fillObservacoes(data || {});
        } else if (step === 'declaracoes') {
          filled += fillDeclaracoes(settings || {});
        } else if (step === 'capture_atividade') {
          const captured = captureAtividade();
          sendResponse({ ok: true, preset: captured });
          return;
        } else if (step === 'apply_atividade') {
          filled += await applyAtividade(preset);
        }
        sendResponse({ ok: true, filled });
      } catch (err) {
        sendResponse({ ok: false, error: err && err.message ? err.message : String(err) });
      }
    })();

    return true;
  });
})();
