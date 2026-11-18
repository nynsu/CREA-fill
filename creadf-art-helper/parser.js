(function (root) {
  const UF_MAP = {
    'AC': 'AC', 'ACRE': 'AC',
    'AL': 'AL', 'ALAGOAS': 'AL',
    'AP': 'AP', 'AMAPA': 'AP',
    'AM': 'AM', 'AMAZONAS': 'AM',
    'BA': 'BA', 'BAHIA': 'BA',
    'CE': 'CE', 'CEARA': 'CE',
    'DF': 'DF', 'DISTRITO FEDERAL': 'DF',
    'ES': 'ES', 'ESPIRITO SANTO': 'ES',
    'GO': 'GO', 'GOIAS': 'GO',
    'MA': 'MA', 'MARANHAO': 'MA',
    'MT': 'MT', 'MATO GROSSO': 'MT',
    'MS': 'MS', 'MATO GROSSO DO SUL': 'MS',
    'MG': 'MG', 'MINAS GERAIS': 'MG',
    'PA': 'PA', 'PARA': 'PA',
    'PB': 'PB', 'PARAIBA': 'PB',
    'PR': 'PR', 'PARANA': 'PR',
    'PE': 'PE', 'PERNAMBUCO': 'PE',
    'PI': 'PI', 'PIAUI': 'PI',
    'RJ': 'RJ', 'RIO DE JANEIRO': 'RJ',
    'RN': 'RN', 'RIO GRANDE DO NORTE': 'RN',
    'RS': 'RS', 'RIO GRANDE DO SUL': 'RS',
    'RO': 'RO', 'RONDONIA': 'RO',
    'RR': 'RR', 'RORAIMA': 'RR',
    'SC': 'SC', 'SANTA CATARINA': 'SC',
    'SP': 'SP', 'SAO PAULO': 'SP',
    'SE': 'SE', 'SERGIPE': 'SE',
    'TO': 'TO', 'TOCANTINS': 'TO'
  };

  function stripAccents(str) {
    return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalizeUF(raw) {
    if (!raw) return '';
    const key = stripAccents(raw).toUpperCase().replace(/[^A-Z\s]/g, '').trim();
    return UF_MAP[key] || (key.length === 2 ? key : '');
  }

  function formatCEP(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    if (digits.length !== 8) return (raw || '').trim();
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  function formatCNPJorCPF(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    if (digits.length === 14) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
    }
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }
    return (raw || '').trim();
  }

  function parsePhone(raw) {
    let digits = (raw || '').replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length >= 12) {
      digits = digits.slice(2);
    }
    if (digits.length >= 10) {
      return {
        ddd: digits.slice(0, 2),
        telefone: digits.slice(2, 11)
      };
    }
    return { ddd: '', telefone: digits.slice(0, 9) };
  }

  function parseSingleGMS(token) {
    if (!token) return null;
    const clean = token.trim().replace(/,/g, '.');
    // Match optional leading hemisphere + D M S + optional trailing hemisphere
    const dmsRe = /^([NSEWO+-])?\s*(\d{1,3})\s*[°º]\s*(\d{1,2})\s*['’′]\s*(\d{1,2}(?:\.\d+)?)\s*(?:["”″]|'')?\s*([NSEWO])?$/i;
    const m = clean.match(dmsRe);
    if (m) {
      const hemi = (m[5] || m[1] || '').toUpperCase();
      const deg = parseFloat(m[2]);
      const min = parseFloat(m[3]);
      const sec = parseFloat(m[4]);
      if (Number.isNaN(deg) || Number.isNaN(min) || Number.isNaN(sec)) return null;
      let val = deg + min / 60 + sec / 3600;
      if (hemi === 'S' || hemi === 'W' || hemi === 'O' || m[1] === '-') {
        val = -Math.abs(val);
      }
      return { value: val, hemi };
    }
    // Decimal coordinate
    const decRe = /^([+-]?\d{1,3}(?:\.\d+)?)\s*([NSEWO])?$/i;
    const dm = clean.match(decRe);
    if (dm) {
      let val = parseFloat(dm[1]);
      const hemi = (dm[2] || '').toUpperCase();
      if (Number.isNaN(val)) return null;
      if (hemi === 'S' || hemi === 'W' || hemi === 'O') {
        val = -Math.abs(val);
      }
      return { value: val, hemi };
    }
    return null;
  }

  function parseCoordinates(raw) {
    if (!raw) return { latDecimal: '', lonDecimal: '' };
    const text = raw.trim();

    // Try finding two GMS tokens anywhere in the string
    const gmsGlobal = /([NSEWO+-]?\s*\d{1,3}\s*[°º]\s*\d{1,2}\s*['’′]\s*\d{1,2}(?:[.,]\d+)?\s*(?:["”″]|'')?\s*[NSEWO]?)/gi;
    const matches = text.match(gmsGlobal);
    if (matches && matches.length >= 2) {
      const a = parseSingleGMS(matches[0]);
      const b = parseSingleGMS(matches[1]);
      if (a && b) {
        let lat = a.value;
        let lon = b.value;
        // Swap if first is explicitly E/W/O or second is N/S
        if ((a.hemi === 'E' || a.hemi === 'W' || a.hemi === 'O') || (b.hemi === 'N' || b.hemi === 'S')) {
          lat = b.value;
          lon = a.value;
        }
        return {
          latDecimal: lat.toFixed(6),
          lonDecimal: lon.toFixed(6)
        };
      }
    }

    // Try finding two decimal numbers (e.g. "-2.625833, -46.553889" or "-2,625833 / -46,553889")
    const decNormalized = text.replace(/(\d),(\d)/g, '$1.$2');
    const decMatches = decNormalized.match(/[+-]?\d{1,3}\.\d+\s*[NSEWO]?/gi);
    if (decMatches && decMatches.length >= 2) {
      const a = parseSingleGMS(decMatches[0]);
      const b = parseSingleGMS(decMatches[1]);
      if (a && b) {
        return {
          latDecimal: a.value.toFixed(6),
          lonDecimal: b.value.toFixed(6)
        };
      }
    }

    return { latDecimal: '', lonDecimal: '' };
  }

  // Matches CREA-DF utils_art_atual_tos.js -> caracteresAceitos()
  const CREA_ALLOWED_CHAR = /^[a-zA-Zà-úÀ-Ú0-9çÇ!@#$%¨&*()_+´~,.;/`'{^}<>:?¹²³£¢¬§ªº°=|/\\\-_\s]$/;

  function sanitizeArtText(str) {
    if (!str) return '';
    const replaced = str
      .replace(/[–—]/g, '-')
      .replace(/[“”"]/g, "'")
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    let out = '';
    for (const ch of replaced) {
      if (CREA_ALLOWED_CHAR.test(ch)) {
        out += ch;
      }
    }
    return out.trim();
  }

  function hasInvalidArtChars(str) {
    if (!str) return false;
    for (const ch of str) {
      if (!CREA_ALLOWED_CHAR.test(ch)) return true;
    }
    return false;
  }

  function buildObservacoes(data) {
    const parts = [];
    if (data.numeroProcesso) parts.push(`Proc. ${data.numeroProcesso}`);
    let local = data.nomeAldeia || '';
    if (data.obraCidade && data.obraUf) {
      local = local ? `${local} (${data.obraCidade}/${data.obraUf})` : `${data.obraCidade}/${data.obraUf}`;
    } else if (data.obraCidade) {
      local = local ? `${local} (${data.obraCidade})` : data.obraCidade;
    }
    if (local) parts.push(local);
    if (data.objetoProjeto) parts.push(data.objetoProjeto);

    const raw = parts.join(' - ');
    return sanitizeArtText(raw).slice(0, 300);
  }

  function splitAddressNumber(addr) {
    if (!addr) return { logradouro: '', numero: '' };
    const m = addr.match(/^(.*?)[,\s]+(?:n[º°o.]*\s*)?(\d{1,5}|s\/n)\s*$/i);
    if (m && m[1].trim().length > 3) {
      return { logradouro: m[1].trim(), numero: m[2].toUpperCase() };
    }
    return { logradouro: addr.trim(), numero: '' };
  }

  function parseSectionLines(lines) {
    const map = [];
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      // Ignore pure mention lines like "@Nícolas Araújo @Bruno Abtibol"
      if (/^(@\S+\s*)+$/.test(line)) continue;
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = stripAccents(line.slice(0, colonIdx)).toUpperCase().trim();
        const val = line.slice(colonIdx + 1).trim();
        map.push({ key, val, raw: line });
      }
    }
    return map;
  }

  function findValue(entries, patterns) {
    for (const pat of patterns) {
      for (const entry of entries) {
        if (pat.test(entry.key)) return entry.val;
      }
    }
    return '';
  }

  function parseArtMessage(rawText) {
    const text = (rawText || '').replace(/\r\n/g, '\n');
    const lines = text.split('\n');

    // Locate section boundaries
    let contratanteStart = -1;
    let obraStart = -1;
    lines.forEach((line, idx) => {
      const norm = stripAccents(line).toUpperCase().trim();
      if (
        contratanteStart === -1 &&
        /(?:INFORMACOES|DADOS)\s+(?:DO\s+)?CONTRATANTE/.test(norm)
      ) {
        contratanteStart = idx;
      }
      if (
        obraStart === -1 &&
        /(?:INFORMACOES|DADOS)\s+(?:DA\s+|DE\s+)?(?:OBRA|ALDEIA)|^(?:INFORMA[CÇ]OES\s+)?OBRA\s*\(\s*ALDEIA\s*\)|^LOCAL\s+(?:DA\s+)?OBRA\b/.test(norm)
      ) {
        obraStart = idx;
      }
    });

    let contratanteLines = lines;
    let obraLines = lines;
    if (contratanteStart !== -1 && obraStart !== -1) {
      if (obraStart > contratanteStart) {
        contratanteLines = lines.slice(contratanteStart, obraStart);
        obraLines = lines.slice(obraStart);
      } else {
        obraLines = lines.slice(obraStart, contratanteStart);
        contratanteLines = lines.slice(contratanteStart);
      }
    } else if (obraStart !== -1) {
      contratanteLines = lines.slice(0, obraStart);
      obraLines = lines.slice(obraStart);
    } else if (contratanteStart !== -1) {
      contratanteLines = lines.slice(contratanteStart);
      obraLines = [];
    }

    const cEntries = parseSectionLines(contratanteLines);
    const oEntries = parseSectionLines(obraLines);
    const allEntries = parseSectionLines(lines);

    // Contractor fields
    const contratanteNome = findValue(cEntries, [
      /CONTRATANTE/,
      /RAZAO\s+SOCIAL/,
      /^NOME$/
    ]);
    const cnpjRaw = findValue(cEntries, [/CPF\s*\/\s*CNPJ/, /CNPJ/, /CPF/]) || findValue(allEntries, [/CPF\s*\/\s*CNPJ/, /CNPJ/]);
    const email = findValue(cEntries, [/E-?MAIL/]) || findValue(allEntries, [/E-?MAIL/]);
    const phoneRaw = findValue(cEntries, [/TELEFONE/, /FONE/, /CELULAR/]);
    const phone = parsePhone(phoneRaw);

    const cCepRaw = findValue(cEntries, [/^CEP\b/]);
    const cCepMatch = cCepRaw.match(/\d{5}-?\d{3}/);
    const contratanteCep = cCepMatch ? formatCEP(cCepMatch[0]) : '';

    const cEndRaw = findValue(cEntries, [/^ENDERECO\b/, /^LOGRADOURO\b/]);
    const cEndSplit = splitAddressNumber(cEndRaw);
    const cNumeroExplicit = findValue(cEntries, [/^NUMERO\b/, /^N[º°]\b/]);
    const contratanteNumero = cNumeroExplicit || cEndSplit.numero;
    const contratanteBairro = findValue(cEntries, [/^BAIRRO\b/]);
    const contratanteCidade = findValue(cEntries, [/^CIDADE\b/, /^MUNICIPIO\b/]);
    const contratanteUf = normalizeUF(findValue(cEntries, [/^UF\b/, /^ESTADO\b/]));
    let contratanteComplemento = findValue(cEntries, [/^COMPLEMENTO\b/]);
    let aldeiaFromContratante = '';
    if (/\bALDEIA\b/i.test(contratanteComplemento)) {
      aldeiaFromContratante = contratanteComplemento;
      contratanteComplemento = '';
    }

    // Obra fields
    const numeroProcesso = findValue(oEntries, [/PROCESSO/, /CONTRATO/]) || findValue(allEntries, [/PROCESSO/]);

    const oCepLine = findValue(oEntries, [/^CEP\b/]);
    const oCepMatch = oCepLine.match(/\d{5}-?\d{3}/);
    const obraCep = oCepMatch ? formatCEP(oCepMatch[0]) : '';

    // Parse "( Município de Paragominas/Pará)" or "Paragominas/PA"
    let obraCidade = findValue(oEntries, [/^CIDADE\b/, /^MUNICIPIO\b/]);
    let obraUf = normalizeUF(findValue(oEntries, [/^UF\b/, /^ESTADO\b/]));
    if (!obraCidade || !obraUf) {
      const munMatch = oCepLine.match(/([^/()\n]+?)\s*\/\s*([^/()\n]+)/i);
      if (munMatch) {
        if (!obraCidade) {
          obraCidade = munMatch[1].trim().replace(/^(?:munic[ií]pio|cidade)\s+(?:de\s+)?/i, '').trim();
        }
        if (!obraUf) obraUf = normalizeUF(munMatch[2].trim());
      }
    }

    const nomeAldeia =
      findValue(oEntries, [/NOME\s+(DA\s+)?ALDEIA/, /^ALDEIA\b/, /^LOGRADOURO\b/, /^ENDERECO\b/, /^LOCAL\b/]) ||
      aldeiaFromContratante;
    const obraNumero = findValue(oEntries, [/^NUMERO\b/]);
    const obraBairro = findValue(oEntries, [/^BAIRRO\b/]);
    const obraComplemento = findValue(oEntries, [/^COMPLEMENTO\b/]);

    const coordRaw = findValue(oEntries, [/LATITUDE/, /COORDENADA/, /LAT\s*\/\s*LON/]) || findValue(allEntries, [/LATITUDE/, /COORDENADA/]);
    const coords = parseCoordinates(coordRaw);

    const objetoProjeto = findValue(oEntries, [/OBJETO(\s+DO\s+PROJETO)?/, /DESCRICAO\s+(DO\s+)?SERVICO/]) || findValue(allEntries, [/OBJETO/]);

    const areaRaw = findValue(oEntries, [/^AREA\b/, /METRAGEM/, /M2\b/, /M²\b/]);
    const areaMatch = areaRaw.match(/(\d+(?:[.,]\d+)?)/);
    const atividadeQuantidade = areaMatch ? areaMatch[1] : '';

    const result = {
      contratanteNome: sanitizeArtText(contratanteNome).slice(0, 60),
      cnpj: formatCNPJorCPF(cnpjRaw),
      email: email.trim().toLowerCase().slice(0, 50),
      ddd: phone.ddd.slice(0, 2),
      telefone: phone.telefone.slice(0, 9),
      contratanteCep,
      contratanteEndereco: sanitizeArtText(cEndSplit.logradouro).slice(0, 50),
      contratanteNumero: sanitizeArtText(contratanteNumero).slice(0, 5) || 'S/N',
      contratanteComplemento: sanitizeArtText(contratanteComplemento).slice(0, 80),
      contratanteBairro: sanitizeArtText(contratanteBairro).slice(0, 72),
      contratanteCidade: sanitizeArtText(contratanteCidade).slice(0, 50),
      contratanteUf,
      numeroProcesso: sanitizeArtText(numeroProcesso).slice(0, 30),
      obraCep,
      obraCidade: sanitizeArtText(obraCidade).slice(0, 50),
      obraUf,
      nomeAldeia: sanitizeArtText(nomeAldeia).slice(0, 50),
      obraNumero: sanitizeArtText(obraNumero).slice(0, 5) || 'S/N',
      obraBairro: sanitizeArtText(obraBairro).slice(0, 72) || 'ZONA RURAL',
      obraComplemento: sanitizeArtText(obraComplemento).slice(0, 80),
      latitude: coords.latDecimal,
      longitude: coords.lonDecimal,
      objetoProjeto: sanitizeArtText(objetoProjeto),
      atividadeQuantidade,
      observacoes: ''
    };

    return result;
  }

  const api = {
    parseArtMessage,
    parseCoordinates,
    sanitizeArtText,
    hasInvalidArtChars,
    buildObservacoes,
    normalizeUF,
    formatCEP,
    formatCNPJorCPF
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ArtParser = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
