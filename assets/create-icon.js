// Script para criar um ícone simples para a aplicação
// Execute este script para gerar os ícones necessários

const fs = require('fs');
const path = require('path');

// Criar um ícone SVG simples
const iconSVG = `
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#1890ff" rx="20"/>
  <text x="128" y="140" font-family="Arial, sans-serif" font-size="80" fill="white" text-anchor="middle" font-weight="bold">EBD</text>
  <text x="128" y="180" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Resposta</text>
  <text x="128" y="205" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Automática</text>
</svg>
`;

// Salvar o SVG
fs.writeFileSync(path.join(__dirname, 'icon.svg'), iconSVG);

console.log('Ícone SVG criado em assets/icon.svg');
console.log('Para melhor qualidade, recomenda-se criar ícones .ico (Windows) e .png (Linux) usando ferramentas online ou design software.');
console.log('Você pode converter o SVG para outros formatos em: https://convertio.co/pt/svg-ico/');