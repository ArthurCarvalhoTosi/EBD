const fs = require('fs');
const path = require('path');

// Função para copiar diretório recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Pular node_modules
      if (item === 'node_modules') {
        continue;
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Função para copiar arquivo individual
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

console.log('Copiando arquivos do backend...');

// Criar diretório backend se não existir
if (!fs.existsSync('backend')) {
  fs.mkdirSync('backend');
}

// Copiar arquivos essenciais do backend
copyFile('BackEnd/index.js', 'backend/index.js');
copyFile('BackEnd/package.json', 'backend/package.json');

console.log('Backend copiado com sucesso!');