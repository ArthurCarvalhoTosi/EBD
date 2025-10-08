# 🔍 Instruções de Debug e Testes

## 📂 Localização dos Executáveis

Após executar `npm run dist:win`, o executável é gerado em:

```
D:\Projects\EBD\dist\win-unpacked\EBD Resposta Automática.exe
```

## 🚀 Como Executar

### Opção 1: Pelo Explorador de Arquivos

1. Navegue até `D:\Projects\EBD\dist\win-unpacked\`
2. Dê duplo clique em `EBD Resposta Automática.exe`

### Opção 2: Pelo PowerShell

```powershell
cd D:\Projects\EBD\dist\win-unpacked
.".\EBD Resposta Automática.exe"
```

## 🔍 Como Ver o Console/Logs

### Método 1: DevTools dentro do App (Recomendado)

Com o aplicativo aberto, pressione:

- **`Ctrl + Shift + I`** ou **`F12`**

Isso abrirá o DevTools do Chrome onde você pode ver:

- ✅ Console logs (erros JavaScript)
- ✅ Network (requisições ao backend)
- ✅ Elements (inspecionar HTML/CSS)
- ✅ Application (localStorage, cookies, etc)

### Método 2: Abrir DevTools Automaticamente

Edite o arquivo `main.js` na linha 54 e descomente:

```javascript
// mainWindow.webContents.openDevTools();
```

Remova o `//` para ficar:

```javascript
mainWindow.webContents.openDevTools();
```

Depois, gere o build novamente:

```bash
npm run dist:win
```

### Método 3: Ver Logs do Backend

Os logs do backend (servidor Express) aparecem no console do DevTools (Ctrl+Shift+I).

Procure por mensagens como:

- `Servidor backend rodando em http://localhost:4000`
- `Erro ao enviar:` (em caso de erro)
- `Preenchendo [campo] com [valor]`

## 🧪 Testando a Aplicação

### Checklist de Testes

1. **✅ Interface Carrega**

   - O formulário aparece corretamente?
   - Não há tela branca?

2. **✅ Campos Funcionam**

   - Todos os campos estão editáveis?
   - Validações funcionam?

3. **✅ Backend Responde**

   - Abra DevTools (F12)
   - Vá para aba Network
   - Envie o formulário
   - Verifique se aparece uma requisição POST para `http://localhost:4000/enviar-resposta`

4. **✅ Puppeteer Funciona**
   - Ao enviar o formulário, o navegador do Puppeteer abre?
   - Os campos são preenchidos corretamente?
   - O formulário é enviado com sucesso?

### Possíveis Problemas

#### ❌ Tela Branca

- **Causa:** Frontend não foi buildado corretamente
- **Solução:**
  ```bash
  npm run build:frontend
  npm run dist:win
  ```

#### ❌ Erro "Backend não responde"

- **Causa:** Backend não iniciou na porta 4000
- **Verificar:** Abra DevTools (F12) e veja erros no console
- **Solução:** Certifique-se que a porta 4000 não está em uso

#### ❌ Erro "Puppeteer não encontrado"

- **Causa:** Puppeteer não foi empacotado corretamente
- **Verificar:** O arquivo `package.json` deve ter `asarUnpack` configurado
- **Solução:**
  ```bash
  npm install
  npm run dist:win
  ```

#### ❌ Erro "CPF inválido"

- **Causa:** Site pode ter mudado a estrutura
- **Debug:**
  1. Mude `headless: true` para `headless: false` no `main.js` (linha 77)
  2. Reconstrua o app
  3. Veja o navegador abrindo e o que está acontecendo

## 🔧 Logs Detalhados do Puppeteer

Para ver o navegador do Puppeteer em ação (não invisível), edite `main.js` linha 77:

```javascript
// DE:
headless: true,

// PARA:
headless: false,
```

Depois reconstrua:

```bash
npm run dist:win
```

Agora você verá o navegador abrindo e todas as ações acontecendo!

## 📝 Logs do Sistema

Os logs do Electron ficam em:

- **Windows:** `%APPDATA%\ebd-app\logs\`
- **Console:** Visível no DevTools (F12)

## 🔄 Rebuild Rápido

Se fizer mudanças no código, use:

```bash
# Build completo (frontend + backend + executável)
npm run dist:win

# Apenas build do frontend (se só mudou React)
npm run build:frontend

# Teste em modo desenvolvimento (sem gerar executável)
npm run dev
```

## 📌 Atalhos Úteis

| Atalho             | Ação                 |
| ------------------ | -------------------- |
| `Ctrl + Shift + I` | Abrir DevTools       |
| `Ctrl + R`         | Recarregar aplicação |
| `Ctrl + Q`         | Fechar aplicação     |
| `F12`              | Abrir DevTools       |
| `Ctrl + Shift + C` | Inspecionar elemento |

## 🎯 Dicas Finais

1. **Sempre teste no modo dev antes de gerar o build:**

   ```bash
   npm run dev
   ```

2. **Se algo não funcionar no build mas funciona em dev:**

   - Verifique se os arquivos estão sendo empacotados corretamente
   - Veja a configuração `build.files` no `package.json`

3. **Use o DevTools (F12) para tudo!**

   - É a melhor ferramenta para debug
   - Console mostra todos os erros
   - Network mostra todas as requisições

4. **Quer ver o Puppeteer trabalhando?**
   - Mude `headless: false` no `main.js`
   - Você verá tudo acontecendo em tempo real!
