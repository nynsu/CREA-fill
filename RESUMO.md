# CREA-DF ART Helper — Resumo do Projeto

Extensão de navegador (Chrome / Edge — Manifest V3) com **Painel Lateral (Side Panel)** para extrair dados de mensagens de texto (ex.: WhatsApp/Teams com dados de DSEI e Aldeias), converter coordenadas GMS para decimal e preencher automaticamente o formulário de ART do **CREA-DF** (`https://art.creadf.org.br/art1025/cadastros/form_cadastro_tosbs.php`).

---

## Estrutura da Pasta
Leve a pasta `creadf-art-helper/` inteira para o PC do serviço:

- `creadf-art-helper/manifest.json` — Configuração MV3 (`activeTab`, `scripting`, `storage`, `sidePanel`, host `https://art.creadf.org.br/*`).
- `creadf-art-helper/background.js` — Abre o painel lateral ao clicar no ícone da extensão.
- `creadf-art-helper/parser.js` — Faz o *parse* da mensagem colada, converte coordenadas GMS (`02°37'33"S 46°33'14"W` → `-2.625833`, `-46.553889`), formata CNPJ/CEP/telefone e sanitiza o texto de **Observações** segundo a regex `caracteresAceitos()` do CREA-DF.
- `creadf-art-helper/content.js` — Preenche as 5 abas do formulário (contornando `onpaste="return false"` em `LATITUDE2`, `LONGITUDE2`, `COMPLEMENTO` e `OBSERVACOES`), aguarda a consulta de CEP da obra (`CEP[10]`) antes de aplicar o nome da aldeia, e captura/reaplica **Atividade Técnica Favorita**.
- `creadf-art-helper/sidepanel.html`, `sidepanel.css`, `sidepanel.js` — Interface em painel lateral escuro com edição prévia, link de conferência no Google Maps, padrões salvos em `chrome.storage.local` e botões de preenchimento completo ou por etapa.
- `creadf-art-helper/icons/` — Ícones `icon16.png`, `icon48.png`, `icon128.png`.
- `referencia_html/` — Páginas salvas do portal do CREA-DF (`1.html`..`5.html` e `*_files`) para referência caso precise ajustar seletores ou mapear novos campos.

---

## Como instalar no PC do serviço (Chrome ou Edge)
1. Copie a pasta `creadf-art-helper` para um local fixo no PC do serviço.
2. Abra `chrome://extensions` (ou `edge://extensions`).
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta `creadf-art-helper`.
5. Abra a tela de cadastro de ART no portal do CREA-DF, clique no ícone da extensão e cole a mensagem recebida.

---

## O que já está mapeado e funcionando
- **1. Dados Iniciais:** `FORMA_DE_REGISTRO`, `PARTICIPACAO_TECNICA`, `RADIO_ART_AIN` (`art_ain_nao` / `art_ain_sim`).
- **2. Contrato/Contratante:** `TIPO_DE_CONTRATANTE[1]`, `CPF_CNPJ[1]` (com opção de disparar a consulta do cadastro salvo no CREA-DF), `NOME[1]`, `E_MAIL[1]`, `DDD[1]`, `TELEFONE[1]`, `NUMERO_DO_CONTRATO[1]` (nº do processo), `ACAO_INSTITUCIONAL[1]`, `CEP[1]`, `DESCRICAO_DO_LOGRADOURO[1]`, `NUMERO[1]`, `COMPLEMENTO[1]`, `BAIRRO[1]`, `CIDADE[1]`, `UF[1]`.
- **3. Obra/Serviço:** opção de repetir dados do contratante como proprietário (`[2]`) sem disparar `alert`, `CODIGO_DA_FINALIDADE`, `LATITUDE2`, `LONGITUDE2`, `CEP[10]` (aguardando `PesquisaCep`), `DESCRICAO_DO_LOGRADOURO[10]` (nome da aldeia), `NUMERO[10]`, `BAIRRO[10]`, `COMPLEMENTO[10]`, `CIDADE[10]`, `UF[10]`.
- **4. Atividades Técnicas:** marca `aceiteObs` e preenche `OBSERVACOES` (até 300 caracteres, validado contra caracteres inválidos); inclui **Capturar da página** e **Aplicar Favorita** para a cascata de `<select>` AJAX da atividade.
- **5. Declarações:** `CODIGO_CLAUSULA_COMPROMISSORIA1`/`2` e `ACESSIBILIDADE1`/`2`.

## O que permanece manual no formulário
- **Datas** (`DATA_CELEBRACAO_CONTRATO`, `DATA_FIM_CONTRATO`, `DATA_PREVISTA_DE_INICIO2`, `DATA_PREVISTA_DE_CONCLUSAO2`).
- **Valor do contrato** (`VALOR_DO_CONTRATO[1]`).
- **Quantidade / Lançar Atividade** (após aplicar a atividade favorita ou selecionar manualmente).
