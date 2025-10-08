# EBD Resposta Automática

Aplicação desktop Electron para automatizar o envio de respostas da Escola Bíblica Dominical (EBD) da Igreja Cristã Maranata para múltiplos CPFs.

## 📋 Visão Geral

Esta aplicação permite enviar respostas automaticamente para múltiplos CPFs através de uma interface moderna e intuitiva. A aplicação integra:

- **Frontend**: Interface React moderna
- **Backend**: Servidor Express com automação via Puppeteer
- **Desktop**: Aplicação Electron executável

## ✨ Funcionalidades

- ✅ Interface para inserção de lista de CPFs (separados por linha, vírgula ou ponto-e-vírgula)
- ✅ Campo para digitar a resposta a ser enviada
- ✅ Campos opcionais para e-mail, telefone, cidade e estado
- ✅ Monitoramento do progresso de envio em tempo real
- ✅ Visualização de resultados para cada CPF
- ✅ Automação completa com Puppeteer

## 🔧 Requisitos do Sistema

### Para Desenvolvimento:

- Node.js v14.0.0 ou superior
- npm v6.0.0 ou superior
- Windows, Linux ou macOS

### Para Usuários Finais (executável):

- Windows 7 ou superior (64 bits)
- Mínimo 4GB RAM
- Conexão com a internet

**⚠️ Importante**: O usuário final NÃO precisa instalar Node.js, npm ou outras dependências!

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

```bash
# Na raiz do projeto
npm install

# Ou instalar dependências de frontend e backend separadamente
npm run postinstall
```

### 2. Executar em Modo Desenvolvimento

```bash
npm run dev
```

Este comando irá:

- ✅ Iniciar o backend na porta 4000
- ✅ Iniciar o frontend na porta 3000
- ✅ Abrir a aplicação Electron automaticamente

## 📦 Build e Distribuição

### Build do Frontend

```bash
npm run build:frontend
```

### Build Completo

```bash
npm run build
```

Este comando irá:

- Fazer build do React (frontend)
- Copiar arquivos necessários do backend

### Gerar Executável para Windows

```bash
# Método recomendado - Gera pasta portátil
npm run package:win

# Alternativa - Tenta gerar instalador
npm run dist:win
```

#### Após `npm run package:win`:

O executável será gerado em:

```
dist/EBD-Resposta-Automatica-win32-x64/
├── EBD-Resposta-Automatica.exe    (👈 Arquivo principal)
├── LEIA-ME.txt                     (📖 Instruções)
├── versao.txt                      (📋 Versão)
└── resources/                      (📦 Recursos)
```

#### Após `npm run dist:win`:

O executável será gerado em:

```
dist/win-unpacked/EBD Resposta Automática.exe
```

### Gerar Executável para Linux

```bash
npm run package:linux
# ou
npm run dist:linux
```

## 📂 Estrutura do Projeto

```
EBD/
├── build/                  # Frontend buildado (React)
├── dist/                   # Executáveis gerados
│   ├── win-unpacked/       # Versão desempacotada (Windows)
│   └── *.exe               # Instalador (se gerado)
├── BackEnd/                # Backend (Express + Puppeteer)
│   ├── index.js            # Servidor backend
│   └── package.json
├── FrontEnd/               # Frontend (React)
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   │       └── FormularioEBD.jsx
│   └── package.json
├── scripts/                # Scripts de build
│   ├── copy-backend.js
│   ├── create-portable.js
│   └── limpar-dist.ps1
├── main.js                 # Processo principal Electron
└── package.json            # Configuração raiz
```

## 🔍 Debug e Testes

### Abrir DevTools no Executável

Com o aplicativo aberto, pressione:

- **`Ctrl + Shift + I`** ou **`F12`**

Isso abrirá o DevTools do Chrome onde você pode ver:

- ✅ Console logs (erros JavaScript)
- ✅ Network (requisições ao backend)
- ✅ Elements (inspecionar HTML/CSS)

### Ver Navegador do Puppeteer

Para ver o navegador do Puppeteer em ação (não invisível), edite `BackEnd/index.js`:

```javascript
// DE:
headless: true,

// PARA:
headless: false,
```

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
   - Verifique requisição POST para `http://localhost:4000/enviar-resposta`

4. **✅ Puppeteer Funciona**
   - Ao enviar o formulário, o navegador do Puppeteer abre?
   - Os campos são preenchidos corretamente?
   - O formulário é enviado com sucesso?

## 📤 Distribuir para Usuários Finais

### Método Recomendado (ZIP)

1. **Comprima** toda a pasta `EBD-Resposta-Automatica-win32-x64` em um arquivo ZIP
2. **Distribua** o ZIP via email, WhatsApp, Google Drive, etc.
3. **Instrua** o usuário a:
   - Extrair o ZIP em qualquer pasta
   - Executar `EBD-Resposta-Automatica.exe`
   - Ler o arquivo `LEIA-ME.txt` para instruções

### Método Alternativo (Pendrive)

1. Copie toda a pasta `EBD-Resposta-Automatica-win32-x64` para um pendrive
2. Distribua o pendrive
3. O usuário pode copiar a pasta para o computador dele

## 🛠️ Comandos Disponíveis

| Comando                  | Descrição                                      |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Executar em modo desenvolvimento               |
| `npm run build`          | Build completo do projeto                      |
| `npm run build:frontend` | Build apenas do frontend                       |
| `npm start`              | Executar aplicação Electron (após build)       |
| `npm run package:win`    | Gerar executável portátil para Windows         |
| `npm run package:linux`  | Gerar executável portátil para Linux           |
| `npm run dist:win`       | Gerar instalador para Windows (pode ter erros) |
| `npm run dist:linux`     | Gerar AppImage para Linux                      |

## ⚙️ Correções Aplicadas

### Problema 1: Backend não funcionava em modo desenvolvimento

**Solução:**

- Modificado o script `dev` no `package.json` para iniciar o backend em paralelo
- Ajustado `main.js` para não iniciar o backend quando em modo desenvolvimento

### Problema 2: Tela branca no executável gerado

**Soluções:**

1. Configurado `electron-builder` para empacotar Puppeteer corretamente com `asarUnpack`
2. Adicionada verificação de existência do arquivo build
3. Configurado Puppeteer para usar Chrome empacotado em modo produção

```json
"build": {
  "files": [
    "main.js",
    "build/**/*",
    "package.json",
    "node_modules/express/**/*",
    "node_modules/cors/**/*"
  ],
  "asarUnpack": [
    "node_modules/puppeteer/**/*",
    "node_modules/puppeteer-core/**/*"
  ]
}
```

## 🔧 Resolução de Problemas

### ❌ Tela Branca

**Causa:** Frontend não foi buildado corretamente

**Solução:**

```bash
npm run build:frontend
npm run dist:win
```

### ❌ Erro "Backend não responde"

**Causa:** Backend não iniciou na porta 4000

**Solução:**

- Abra DevTools (F12) e veja erros no console
- Certifique-se que a porta 4000 não está em uso
- Verifique se o firewall não está bloqueando

### ❌ Erro "Puppeteer não encontrado"

**Causa:** Puppeteer não foi empacotado corretamente

**Solução:**

```bash
npm install
npm run dist:win
```

### ❌ Limpar e Reconstruir Tudo

```bash
# Windows PowerShell
Remove-Item -Recurse -Force build, dist, node_modules
npm install
npm run dist:win

# Ou usar o script de limpeza
.\scripts\limpar-dist.ps1
```

## 📝 Observações Importantes

### Desenvolvimento vs Produção

| Aspecto   | Desenvolvimento                   | Produção (Executável)               |
| --------- | --------------------------------- | ----------------------------------- |
| Backend   | Roda separadamente (porta 4000)   | Iniciado internamente pelo Electron |
| Frontend  | Roda em servidor dev (porta 3000) | Carregado de arquivos buildados     |
| Puppeteer | Usa Chrome local                  | Usa Chrome empacotado               |

### Segurança e Antivírus

- Alguns antivírus podem detectar falsamente como ameaça devido ao Puppeteer
- O Puppeteer baixa uma versão do Chromium automaticamente
- A primeira execução pode demorar mais para inicializar

### Personalização

**Ícones:**

- Substitua os arquivos em `assets/` por seus próprios ícones
- Formatos: `.ico` para Windows, `.png` para Linux

**Configurações:**

- Edite `package.json` na raiz para alterar informações da aplicação
- Modifique `main.js` para ajustar comportamentos da janela

## 📌 Atalhos Úteis

| Atalho             | Ação                 |
| ------------------ | -------------------- |
| `Ctrl + Shift + I` | Abrir DevTools       |
| `F12`              | Abrir DevTools       |
| `Ctrl + R`         | Recarregar aplicação |
| `Ctrl + Q`         | Fechar aplicação     |
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
   - Mude `headless: false` no `BackEnd/index.js`
   - Você verá tudo acontecendo em tempo real!

## 📄 Licença

Este projeto é de uso interno da Igreja Cristã Maranata.

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---
