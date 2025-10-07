const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Criando versão portable da aplicação...');

// Verificar se a pasta da aplicação existe
const appDir = 'dist/EBD-Resposta-Automatica-win32-x64';
if (!fs.existsSync(appDir)) {
  console.error('❌ Pasta da aplicação não encontrada! Execute primeiro: npm run package:win');
  process.exit(1);
}

// Criar arquivo README para a distribuição
const readmeContent = `# EBD Resposta Automática

## 📋 Como usar:

1. **Executar a aplicação**: Clique duas vezes no arquivo "EBD-Resposta-Automatica.exe"

2. **Primeira execução**: A aplicação pode demorar alguns segundos para carregar na primeira vez

3. **Interface**: A aplicação abrirá uma janela com a interface para preenchimento dos dados

## ⚠️ Requisitos:

- **Sistema**: Windows 7 ou superior (64 bits)
- **Internet**: Conexão ativa para acessar o site da EBD
- **Memória**: Mínimo 4GB RAM recomendado

## 🛡️ Segurança:

- Esta aplicação usa tecnologia de automação web (Puppeteer)
- Alguns antivírus podem gerar alertas falsos
- A aplicação é segura e não coleta dados pessoais

## 📞 Suporte:

Se encontrar problemas, verifique:
1. Se possui conexão com a internet
2. Se o site da EBD está funcionando normalmente
3. Se não há outros programas bloqueando as portas 3000 e 4000

## 📂 Arquivos:

- **EBD-Resposta-Automatica.exe**: Arquivo principal da aplicação
- **resources/**: Pasta com recursos necessários
- **locales/**: Pasta com arquivos de idioma
- **Outros arquivos .dll e .pak**: Bibliotecas necessárias para funcionamento

⚠️ **IMPORTANTE**: Mantenha todos os arquivos juntos na mesma pasta!
`;

// Salvar README na pasta da aplicação
fs.writeFileSync(path.join(appDir, 'LEIA-ME.txt'), readmeContent);

// Criar arquivo de versão
const versionInfo = `EBD Resposta Automática v1.0.0
Compilado em: ${new Date().toLocaleString('pt-BR')}
Plataforma: Windows 64-bits

Para mais informações, leia o arquivo LEIA-ME.txt
`;

fs.writeFileSync(path.join(appDir, 'versao.txt'), versionInfo);

console.log('✅ Arquivos de documentação criados!');
console.log('📁 Aplicação pronta em: dist/EBD-Resposta-Automatica-win32-x64/');
console.log('');
console.log('📋 Instruções para distribuição:');
console.log('1. Comprima toda a pasta "EBD-Resposta-Automatica-win32-x64" em um arquivo ZIP');
console.log('2. Distribua o arquivo ZIP');
console.log('3. O usuário deve extrair o ZIP e executar "EBD-Resposta-Automatica.exe"');
console.log('');
console.log('🎉 Aplicação criada com sucesso!');