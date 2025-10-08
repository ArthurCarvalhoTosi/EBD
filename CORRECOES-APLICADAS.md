# Correções Aplicadas ao Projeto EBD

## Problemas Identificados e Soluções

### 1. ❌ Problema: BackEnd não funcionava em modo desenvolvimento

**Causa:** O script `npm run dev` não iniciava o servidor backend separadamente, mas o `main.js` também não o iniciava em modo dev.

**Solução aplicada:**

- Modificado o script `dev` no `package.json` para iniciar o backend em paralelo:
  ```json
  "dev": "concurrently \"cd BackEnd && node index.js\" \"cd FrontEnd && npm start\" \"wait-on http://localhost:3000 && wait-on http://localhost:4000 && set NODE_ENV=development && electron .\""
  ```
- Ajustado `main.js` para **não** iniciar o backend quando em modo desenvolvimento:
  ```javascript
  if (!isDev) {
    await startBackend();
  }
  ```

### 2. ❌ Problema: Tela branca no executável gerado

**Causas:**

1. Puppeteer não estava sendo empacotado corretamente
2. Faltava verificação de existência do arquivo build
3. Configuração incorreta do electron-builder

**Soluções aplicadas:**

#### a) Configuração do electron-builder (`package.json`)

```json
"build": {
  "files": [
    "main.js",
    "build/**/*",
    "package.json",
    "!node_modules/**/*",
    "node_modules/express/**/*",
    "node_modules/cors/**/*"
  ],
  "asarUnpack": [
    "node_modules/puppeteer/**/*",
    "node_modules/puppeteer-core/**/*"
  ]
}
```

- ✅ Puppeteer agora é extraído do asar para funcionar corretamente
- ✅ Apenas dependências necessárias são incluídas (express, cors)

#### b) Verificação de arquivo no `main.js`

```javascript
if (fs.existsSync(buildPath)) {
  mainWindow.loadFile(buildPath).catch((err) => {
    console.error("Erro ao carregar o arquivo:", err);
    dialog.showErrorBox("Erro", "Não foi possível carregar a interface.");
  });
} else {
  console.error("Arquivo não encontrado:", buildPath);
  dialog.showErrorBox(
    "Erro",
    "Arquivo de interface não encontrado: " + buildPath
  );
}
```

#### c) Configuração do Puppeteer para modo empacotado

```javascript
let puppeteerConfig = {
  headless: true,
  defaultViewport: null,
  args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
};

if (isPacked) {
  const puppeteerPath = path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    "node_modules",
    "puppeteer"
  );
  // Configuração para usar Chrome empacotado
}
```

## Como Testar as Correções

### 1. Teste em Modo Desenvolvimento

```bash
# Na raiz do projeto
npm run dev
```

**Esperado:**

- ✅ Backend inicia na porta 4000
- ✅ Frontend inicia na porta 3000
- ✅ Electron abre com a aplicação funcionando
- ✅ Formulário consegue enviar dados

### 2. Gerar Executável

```bash
# Limpar builds anteriores (opcional)
rmdir /s /q build
rmdir /s /q dist

# Gerar o executável
npm run dist:win
```

**Esperado:**

- ✅ Build do frontend é gerado em `build/`
- ✅ Executável gerado em `dist/`
- ✅ Ao abrir o executável, a interface carrega corretamente
- ✅ Backend funciona dentro do executável

### 3. Testar o Executável

1. Navegue até `dist/win-unpacked/`
2. Execute `EBD Resposta Automática.exe`
3. Verifique:
   - ✅ Interface carrega sem tela branca
   - ✅ Formulário aparece corretamente
   - ✅ É possível enviar respostas
   - ✅ Puppeteer consegue acessar o site

## Arquivos Modificados

1. ✏️ `package.json` - Scripts e configuração do electron-builder
2. ✏️ `main.js` - Lógica de inicialização e configuração do Puppeteer

## Observações Importantes

### Desenvolvimento

- O backend roda separadamente em `http://localhost:4000`
- O frontend roda em `http://localhost:3000`
- O Electron conecta-se ao frontend via URL

### Produção (Executável)

- Backend é iniciado internamente pelo Electron
- Frontend é carregado dos arquivos buildados em `build/`
- Puppeteer usa o Chrome empacotado no executável

## Próximos Passos (se necessário)

1. **Se o executável ainda tiver problemas:**

   - Verifique os logs do console ao executar
   - Use `npm run dist` para gerar com mais detalhes
   - Verifique se o Chromium do Puppeteer está sendo empacotado

2. **Para reduzir o tamanho do executável:**

   - Considere usar `puppeteer-core` + Chrome externo
   - Remova dependências não utilizadas

3. **Para melhorar o processo de build:**
   - Configure CI/CD para builds automatizados
   - Adicione testes automatizados

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build completo + executável portátil
npm run dist:win

# Apenas build do frontend
npm run build:frontend

# Limpar e reconstruir tudo
rmdir /s /q build dist node_modules
npm install
npm run dist:win
```

## Estrutura de Pastas Após Build

```
EBD/
├── build/                  # Frontend buildado (React)
├── dist/                   # Executáveis gerados
│   ├── win-unpacked/       # Versão desempacotada (teste)
│   └── *.exe               # Executável portátil
├── BackEnd/                # Código do backend (dev)
├── FrontEnd/               # Código do frontend (dev)
└── main.js                 # Processo principal do Electron
```
