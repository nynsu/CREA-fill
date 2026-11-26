# Política de Privacidade — CREA-DF ART

Esta extensão (**CREA-DF ART**) é uma ferramenta auxiliar local para extração de dados de mensagens e preenchimento do formulário de ART no portal do CREA-DF (`https://art.creadf.org.br/*`).

## 1. Coleta e Compartilhamento de Dados
- **Nenhum dado é coletado, transmitido ou compartilhado** com servidores externos, desenvolvedores ou terceiros.
- Todo o processamento de texto, conversão de coordenadas e preenchimento de campos ocorre **100% localmente** no navegador do usuário.

## 2. Armazenamento Local
- A extensão utiliza exclusivamente a API `chrome.storage.local` para salvar no próprio dispositivo do usuário:
  - Preferências de preenchimento;
  - Presets de atividades técnicas criados ou importados;
  - Histórico recente local (últimas 5 mensagens coladas, que pode ser apagado a qualquer momento pelo botão **Limpar Histórico** ou **Resetar Tudo**).

## 3. Permissões Utilizadas
- **`sidePanel`**: exibe a interface da extensão no painel lateral do navegador.
- **`activeTab` e `scripting`**: interage com a aba ativa apenas quando o usuário aciona o preenchimento ou captura de atividades na página `https://art.creadf.org.br/*`.
- **`storage`**: salva localmente preferências, presets e histórico recente.
- **`clipboardRead`**: lê a área de transferência **somente** quando o usuário clica explicitamente no botão **Colar** para extrair os dados da mensagem.
- **Acesso ao host `https://art.creadf.org.br/*`**: necessário exclusivamente para preencher os campos do formulário de ART no portal oficial do CREA-DF.

## 4. Contato
Dúvidas ou solicitações podem ser abertas na página de Issues do repositório:
https://github.com/nynsu/CREA-fill/issues
