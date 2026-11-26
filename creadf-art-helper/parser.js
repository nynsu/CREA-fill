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

  function extractCEP(raw) {
    const m = (raw || '').match(/\d{2}\.?\d{3}-?\d{3}/);
    return m ? formatCEP(m[0]) : '';
  }

  function formatNomeAldeia(raw) {
    let val = sanitizeArtText(raw);
    if (!val) return '';
    if (!/\baldeia\b/i.test(val)) {
      val = `ALDEIA ${val}`;
    }
    return val.toUpperCase().slice(0, 50);
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
    if (!addr) return { logradouro: '', numero: '', bairro: '' };
    let clean = addr.trim();
    let bairro = '';

    const bairroMatch = clean.match(/[,;\-\s]+bairro\s*[:\-]?\s*([^,;\n]+?)\.?\s*$/i);
    if (bairroMatch) {
      bairro = bairroMatch[1].trim();
      clean = clean.slice(0, bairroMatch.index).trim();
    }

    // Match explicit "nº 96" / "n° 96" / "n. 96" anywhere (even if followed by complement)
    const explicitNum = clean.match(/^(.*?)[,\s\-]+n[º°o.]+\s*(\d{1,5}|s\/n)\b(.*)$/i);
    if (explicitNum && explicitNum[1].trim().length > 3) {
      const rest = explicitNum[3].replace(/^[,\s\-]+/, '').trim();
      const logradouro = rest ? `${explicitNum[1].trim()}, ${rest}` : explicitNum[1].trim();
      return { logradouro, numero: explicitNum[2].toUpperCase(), bairro };
    }

    // Fallback: trailing number without "nº"
    const m = clean.match(/^(.*?)[,\s]+(\d{1,5}|s\/n)\s*$/i);
    if (m && m[1].trim().length > 3) {
      return { logradouro: m[1].trim(), numero: m[2].toUpperCase(), bairro };
    }
    return { logradouro: clean, numero: '', bairro };
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

  const OBRA_HEADER_RE = /(?:INFORMACOES|DADOS)\s+(?:DA\s+|DE\s+)?(?:OBRA|ALDEIA)|^(?:INFORMACOES\s+)?OBRA(?:\s*\(\s*ALDEIA\s*\)|\s*\d+)?\b|^LOCAL\s+(?:DA\s+)?OBRA\b|^ALDEIA\s*\d+\b/;
  const OBRA_NAME_KEY_RE = /^(?:NOME\s+(?:DA\s+)?ALDEIA|ALDEIA|LOGRADOURO|ENDERECO|LOCAL)\b/;

  function parseSingleObraEntries(entries, fallbackAldeia = '') {
    const oCepLine = findValue(entries, [/^CEP\b/]);
    const obraCep = extractCEP(oCepLine);

    let obraCidade = findValue(entries, [/^CIDADE\b/, /^MUNICIPIO\b/]);
    let obraUf = normalizeUF(findValue(entries, [/^UF\b/, /^ESTADO\b/]));
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
      findValue(entries, [/NOME\s+(DA\s+)?ALDEIA/, /^ALDEIA\b/, /^LOGRADOURO\b/, /^ENDERECO\b/, /^LOCAL\b/]) ||
      fallbackAldeia;
    const obraNumero = findValue(entries, [/^NUMERO\b/]);
    const obraBairro = findValue(entries, [/^BAIRRO\b/]);
    const obraComplemento = findValue(entries, [/^COMPLEMENTO\b/]);

    const coordRaw = findValue(entries, [/LATITUDE/, /COORDENADA/, /LAT\s*\/\s*LON/]);
    const coords = parseCoordinates(coordRaw);

    return {
      obraCep,
      obraCidade: sanitizeArtText(obraCidade).slice(0, 50),
      obraUf,
      nomeAldeia: formatNomeAldeia(nomeAldeia),
      obraNumero: sanitizeArtText(obraNumero).slice(0, 5) || 'S/N',
      obraBairro: sanitizeArtText(obraBairro).slice(0, 72) || 'ZONA RURAL',
      obraComplemento: sanitizeArtText(obraComplemento).slice(0, 80),
      latitude: coords.latDecimal,
      longitude: coords.lonDecimal
    };
  }

  function splitObraEntryBlocks(obraLines) {
    const blocks = [];
    let current = [];
    let hasName = false;
    let hasCep = false;

    const flush = () => {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
        hasName = false;
        hasCep = false;
      }
    };

    for (const rawLine of obraLines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (/^(@\S+\s*)+$/.test(line)) continue;

      const norm = stripAccents(line).toUpperCase().trim();
      if (OBRA_HEADER_RE.test(norm) && line.indexOf(':') === -1) {
        if (hasName || hasCep) flush();
        continue;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = stripAccents(line.slice(0, colonIdx)).toUpperCase().trim();
        const val = line.slice(colonIdx + 1).trim();

        if (/^(?:\d+|[A-Z])[º°o.]*\s*(?:ENDERECO|ALDEIA)\b/.test(key) && !val) {
          if (hasName || hasCep) flush();
          continue;
        }

        if (OBRA_NAME_KEY_RE.test(key) && hasName) {
          flush();
        } else if (/^CEP\b/.test(key) && hasCep && hasName) {
          flush();
        }

        if (OBRA_NAME_KEY_RE.test(key) && val) hasName = true;
        if (/^CEP\b/.test(key) && extractCEP(val)) hasCep = true;

        current.push({ key, val, raw: line });
      }
    }
    flush();
    return blocks;
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
    const contratanteCep = extractCEP(cCepRaw);

    const cEndRaw = findValue(cEntries, [/^ENDERECO\b/, /^LOGRADOURO\b/]);
    const cEndSplit = splitAddressNumber(cEndRaw);
    const cNumeroExplicit = findValue(cEntries, [/^NUMERO\b/, /^N[º°]\b/]);
    const contratanteNumero = cNumeroExplicit || cEndSplit.numero;
    const contratanteBairro = findValue(cEntries, [/^BAIRRO\b/]) || cEndSplit.bairro;
    const contratanteCidade = findValue(cEntries, [/^CIDADE\b/, /^MUNICIPIO\b/]);
    const contratanteUf = normalizeUF(findValue(cEntries, [/^UF\b/, /^ESTADO\b/]));
    let contratanteComplemento = findValue(cEntries, [/^COMPLEMENTO\b/]);
    let aldeiaFromContratante = '';
    if (/\bALDEIA\b/i.test(contratanteComplemento)) {
      aldeiaFromContratante = contratanteComplemento;
      contratanteComplemento = '';
    }

    // Obra fields (supports 1 or multiple addresses in the same message)
    const numeroProcesso = findValue(oEntries, [/PROCESSO/, /CONTRATO/]) || findValue(allEntries, [/PROCESSO/]);

    const obraBlocks = splitObraEntryBlocks(obraLines);
    const obras = obraBlocks.length > 0
      ? obraBlocks.map((block, idx) => parseSingleObraEntries(block, idx === 0 ? aldeiaFromContratante : ''))
      : [parseSingleObraEntries(oEntries, aldeiaFromContratante)];

    const firstObra = obras[0];
    for (let i = 1; i < obras.length; i++) {
      if (!obras[i].obraCep && firstObra.obraCep) {
        obras[i].obraCep = firstObra.obraCep;
        if (!obras[i].obraCidade) obras[i].obraCidade = firstObra.obraCidade;
        if (!obras[i].obraUf) obras[i].obraUf = firstObra.obraUf;
      }
    }

    const coordFallback = parseCoordinates(findValue(allEntries, [/LATITUDE/, /COORDENADA/]));
    if (!firstObra.latitude && coordFallback.latDecimal) {
      firstObra.latitude = coordFallback.latDecimal;
      firstObra.longitude = coordFallback.lonDecimal;
    }

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
      obraCep: firstObra.obraCep,
      obraCidade: firstObra.obraCidade,
      obraUf: firstObra.obraUf,
      nomeAldeia: firstObra.nomeAldeia,
      obraNumero: firstObra.obraNumero,
      obraBairro: firstObra.obraBairro,
      obraComplemento: firstObra.obraComplemento,
      latitude: firstObra.latitude,
      longitude: firstObra.longitude,
      obras,
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
