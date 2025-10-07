# EBD Resposta Automática - Guia de Distribuição

## 📋 Visão Geral
Esta aplicação permite automatizar o envio de respostas para o site da EBD da Igreja Cristã Maranata.

## 🚀 Como Compilar e Distribuir

### 1. Preparação do Ambiente
```bash
# Instalar dependências
npm install

# Instalar dependências do frontend e backend
npm run postinstall
```

### 2. Desenvolvimento
Para testar durante o desenvolvimento:
```bash
npm run dev
```
Este comando irá:
- Iniciar o backend na porta 4000
- Iniciar o frontend na porta 3000
- Abrir a aplicação Electron

### 3. Build da Aplicação
```bash
# Build completo
npm run build
```
Este comando irá:
- Fazer build do React (frontend)
- Copiar arquivos necessários do backend

### 4. Gerar Executável para Distribuição

#### Windows (Recomendado):
```bash
npm run package:win
```
Gerará uma pasta `EBD-Resposta-Automatica-win32-x64` em `dist/` com o executável e todos os arquivos necessários.

#### Linux:
```bash
npm run package:linux
```
Gerará uma pasta similar para Linux.

#### Alternativamente (pode ter problemas de privilégio):
```bash
npm run dist:win   # Para Windows com instalador
npm run dist:linux # Para Linux com AppImage
```

## 📁 Estrutura de Arquivos Gerados

Após executar `npm run package:win`, você encontrará na pasta `dist/`:
- **Windows**: Pasta `EBD-Resposta-Automatica-win32-x64/` contendo:
  - `EBD-Resposta-Automatica.exe` (arquivo principal)
  - `LEIA-ME.txt` (instruções para o usuário)
  - `versao.txt` (informações da versão)
  - Demais arquivos necessários (.dll, .pak, etc.)

Após executar `npm run dist:win` (alternativamente):
- **Windows**: `EBD Resposta Automática Setup 1.0.0.exe` (se funcionar)
- **Linux**: `EBD Resposta Automática-1.0.0.AppImage`

## 📦 Distribuição

### Para Usuários Finais:

#### Método Recomendado (usando package:win):
1. **Comprima** toda a pasta `EBD-Resposta-Automatica-win32-x64` em um arquivo ZIP
2. **Distribua** o arquivo ZIP
3. **Instrua** o usuário a:
   - Extrair o ZIP em qualquer pasta
   - Executar `EBD-Resposta-Automatica.exe`
   - Ler o arquivo `LEIA-ME.txt` para instruções

#### Método Alternativo (se conseguir gerar instalador):
1. Envie apenas o arquivo executável (.exe ou .AppImage)
2. No Windows, basta executar o instalador
3. No Linux, dar permissão de execução: `chmod +x arquivo.AppImage` e executar

**Importante**: O usuário não precisa instalar Node.js, npm ou outras dependências!

### Requisitos do Sistema:
- **Windows**: Windows 7 ou superior
- **Linux**: Distribuições modernas com suporte a AppImage
- **Memória**: Mínimo 4GB RAM (recomendado para Puppeteer)
- **Internet**: Conexão ativa (necessária para acessar o site da EBD)

## ⚠️ Observações Importantes

1. **Puppeteer**: A aplicação usa Puppeteer para automação web, que baixa uma versão do Chromium automaticamente
2. **Antivírus**: Alguns antivírus podem detectar falsamente como ameaça devido ao Puppeteer
3. **Primeiro Uso**: A primeira execução pode demorar mais para inicializar
4. **Permissões**: Certifique-se de que o usuário tem permissões para executar aplicações

## 🛠️ Personalização

### Ícones:
- Substitua os arquivos em `assets/` por seus próprios ícones
- Formatos: `.ico` para Windows, `.png` para Linux

### Configurações:
- Edite `package.json` na raiz para alterar informações da aplicação
- Modifique `main.js` para ajustar comportamentos da janela

## 🔧 Resolução de Problemas

### Erro de Compilação:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
rm -rf FrontEnd/node_modules FrontEnd/package-lock.json
rm -rf BackEnd/node_modules BackEnd/package-lock.json
npm install
```

### Problema com Puppeteer:
- Certifique-se de que há espaço suficiente em disco
- Verifique se não há bloqueio de firewall/antivírus

### Aplicação não inicia:
- Verifique se as portas 3000 e 4000 estão disponíveis
- Execute em modo desenvolvedor para ver logs: `npm run dev`