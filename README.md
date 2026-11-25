# PREENCHEDOR AUTOMÁTICO DE ART SUPER PODEROSO CASEIRO

Extensão de navegador (**Chrome / Edge — Manifest V3**) com **Painel Lateral (Side Panel)** para extrair dados de mensagens de texto (WhatsApp/Teams com dados de DSEI e Aldeias), converter coordenadas GMS para decimal e preencher automaticamente o formulário de ART do **CREA-DF**.

---

## ✨ Funcionalidades

- **Extração inteligente de mensagens (`parser.js`):**
  - Separa automaticamente as seções de **Contratante** e **Obra/Aldeia** (evitando vazamento de dados da aldeia para o endereço do contratante).
  - Converte coordenadas **GMS → Decimal** (`02°37'33"S 46°33'14"W` → `-2.625833`, `-46.553889`) com link direto para conferência no Google Maps.
  - Formata CPF/CNPJ, CEP e telefone, além de aplicar `"S/N"` e `"ZONA RURAL"` como padrão quando não informados.
  - Mantém um **histórico recente das últimas 5 mensagens** coladas.
- **Preenchimento automático das 5 abas (`content.js`):**
  - **Aba 1 — Dados Iniciais:** Forma de Registro e Participação Técnica.
  - **Aba 2 — Contrato/Contratante:** Preenche dados do contratante, dispara a consulta automática de **CEP** no portal do CREA-DF e sobrescreve apenas os campos informados no texto extraído; preenche **Data do contrato** (hoje), **Data Fim** (+1 ano) e **Valor** (`1.000,00`), mantendo **Contrato** e **Complemento** limpos.
  - **Aba 3 — Obra/Serviço:** Repete o contratante como proprietário (opcional), define **Finalidade** (padrão `Saúde`), datas de início/fim (+1 ano), coordenadas, CEP da obra e nome da aldeia.
  - **Aba 4 — Atividades Técnicas e Observações:** Lança automaticamente múltiplas atividades a partir de **presets salvos** (incluindo captura da página, dropdown de presets, sobrescrita de unidade para `unidade - un` ou `metros quadrados - m2` e exportação/importação JSON). O campo **Observações** é 100% opcional e possui botão dedicado **Lançar**.
  - **Aba 5 — Declarações:** Arbitragem e Acessibilidade configuráveis (padrão `Não Concordo` / `Não`).
- **Painel Lateral (`sidepanel.html` / `sidepanel.js`):**
  - Cards recolhíveis com badges de resumo rápido, destaque visual para `m²` sem área preenchida, bloqueio contra clique duplo e indicador de progresso em tempo real.

---

## 🚀 Como instalar (Chrome ou Edge)

1. Baixe o arquivo `creadf-art-helper-v1.2.0.zip` na página de [Releases](https://github.com/nynsu/CREA-fill/releases) e extraia a pasta `creadf-art-helper` (ou clone este repositório).
2. Abra `chrome://extensions` (ou `edge://extensions`).
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** (*Load unpacked*) e selecione a pasta `creadf-art-helper`.
5. Abra a tela de cadastro de ART do CREA-DF (`https://art.creadf.org.br/...`), clique no ícone da extensão para abrir o painel lateral e cole a mensagem recebida.

---

## 📁 Estrutura do Projeto

```text
CREA-fill/
├── creadf-art-helper/        # Pasta da extensão (Manifest V3)
│   ├── manifest.json
│   ├── background.js
│   ├── parser.js
│   ├── content.js
│   ├── sidepanel.html
│   ├── sidepanel.css
│   ├── sidepanel.js
│   └── icons/
├── referencia_html/          # (opcional, local) páginas salvas para referência
└── RESUMO.md                 # Resumo técnico rápido
```
