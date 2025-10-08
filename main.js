const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

let mainWindow;
let backendProcess;
let backendServer;

// Função para criar a janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Opcional: ícone da aplicação
    show: false // Não mostrar até estar pronto
  });

  // Remover menu da aplicação (opcional)
  mainWindow.setMenuBarVisibility(false);

  // Verificar se estamos em desenvolvimento ou produção
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Em desenvolvimento, usar o servidor de desenvolvimento do React
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, usar os arquivos buildados
    const buildPath = path.join(__dirname, 'build', 'index.html');
    console.log('Tentando carregar:', buildPath);
    
    // Verificar se o arquivo existe
    if (fs.existsSync(buildPath)) {
      mainWindow.loadFile(buildPath).catch(err => {
        console.error('Erro ao carregar o arquivo:', err);
        dialog.showErrorBox('Erro', 'Não foi possível carregar a interface. Verifique se o build foi feito corretamente.');
      });
    } else {
      console.error('Arquivo não encontrado:', buildPath);
      dialog.showErrorBox('Erro', 'Arquivo de interface não encontrado: ' + buildPath);
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Função para iniciar o servidor backend
function startBackend() {
  return new Promise((resolve, reject) => {
    try {
      // Importar e iniciar o servidor Express diretamente
      const backendApp = express();
      backendApp.use(cors());
      backendApp.use(express.json());

      // Importar a lógica do backend
      // Configurar o caminho do Puppeteer para funcionar com asar
      const puppeteer = require('puppeteer');
      const isPacked = app.isPackaged;
      
      let puppeteerConfig = {
        headless: true,
        defaultViewport: null,
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
      };
      
      // Se estiver empacotado, configurar o caminho do Chrome
      if (isPacked) {
        // Puppeteer instalado via npm já vem com o Chrome, mas quando empacotado
        // precisa ser extraído do asar
        const puppeteerPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'puppeteer');
        try {
          const browserFetcher = puppeteer.createBrowserFetcher({ path: puppeteerPath });
          // Usar o Chrome que vem com o Puppeteer
        } catch (e) {
          console.warn('Erro ao configurar Puppeteer:', e);
        }
      }

      backendApp.post("/enviar-resposta", async (req, res) => {
        const { cpf, resposta, email, telefone, cidade, estado } = req.body;

        try {
          const browser = await puppeteer.launch(puppeteerConfig);
          const page = await browser.newPage();

          await page.goto(
            "https://www.igrejacristamaranata.org.br/ebd/participacoes/",
            {
              waitUntil: "networkidle2",
            },
          );

          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 5000)),
          );

          let tentativas = 0;
          let cpfValido = false;
          
          while (tentativas < 2 && !cpfValido) {
            // Limpar o campo CPF se for a segunda tentativa
            if (tentativas > 0) {
              await page.$eval('input[name="icm_member_cpf"]', el => el.value = '');
              await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
            }
            
            // Preencher o CPF
            await page.type('input[name="icm_member_cpf"]', cpf);
            await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2000)));
            
            // Verificar se alguma mensagem de erro apareceu
            const mensagemErro = await page.evaluate(() => {
              const elemento = document.querySelector('.response-message');
              return elemento ? elemento.textContent.trim() : '';
            });
            
            // Verificar se é uma das mensagens de erro conhecidas
            if (mensagemErro.includes("Seu CPF não consta no cadastro de membros") || 
              mensagemErro.includes("Digite um CPF válido")) {
              tentativas++;
            } else {
              cpfValido = true;
            }
          }
          
          // Se após as tentativas o CPF ainda não é válido, retornar erro
          if (!cpfValido) {
            await browser.close();
            return res.json({ 
              sucesso: false, 
              erro: "CPF inválido ou não cadastrado após tentativas" 
            });
          }

          // Verificar se precisamos preencher os campos opcionais apenas se o CPF for válido
          if (email && telefone && cidade && estado) {
            // Verificar mensagem de erro para decidir se preenche dados adicionais
            const mensagemExibida = await page.evaluate(() => {
              const elemento = document.querySelector('.response-message');
              return elemento ? elemento.textContent.trim() : '';
            });
            
            // Preencher os campos opcionais apenas se não tiver mensagem de erro e os campos estiverem vazios
            if (!mensagemExibida.includes("Seu CPF não consta no cadastro de membros")
              || !mensagemExibida.includes("Digite um CPF válido")) {
              await preencherSeVazio(page, 'input[name="icm_member_email"]', email);
              await preencherSeVazio(
                page,
                'input[name="icm_member_telefone"]',
                telefone,
              );
              await preencherSeVazio(page, 'input[name="member_cidade"]', cidade);
              await preencherSeVazio(page, 'input[placeholder="UF"]', estado);
            }
          }		

          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 2000)),
          );
          await page.click('input[name="icm_member_categoria"][value="2"]');
          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 1000)),
          );
          const campoTextSelector = 'div[data-placeholder="Digite sua mensagem"]';
          await page.waitForSelector(campoTextSelector);
          const linhas = resposta.split("\n");

          for (const linha of linhas) {
            if (linha.length > 0) {
              const texto = /^\d/.test(linha) ? `\u200B${linha}` : linha;
              await page.type(campoTextSelector, texto);
              await page.keyboard.press("Enter");
              await page.evaluate(
                () => new Promise((resolve) => setTimeout(resolve, 300)),
              );
            }
          }

          await page.click(".form-check-input");
          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 1000)),
          );
          await page.click(".btn-submit");
          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 3000)),
          );

          // Verificar se o modal de erro apareceu
          const modalErro = await page.evaluate(() => {
            const modal = document.querySelector('.swal-modal');
            if (modal) {
              const titulo = modal.querySelector('.swal-title');
              const texto = modal.querySelector('.swal-text');
              return {
                existe: true,
                titulo: titulo ? titulo.textContent : '',
                texto: texto ? texto.textContent : ''
              };
            }
            return { existe: false };
          });

          if (modalErro.existe && modalErro.titulo === 'Erro!') {
            await browser.close();
            return res.json({ 
              sucesso: false, 
              erro: "Erro ao enviar formulário: " + (modalErro.texto || "Existem erros no formulário")
            });
          }

          await browser.close();
          res.json({ sucesso: true });
        } catch (err) {
          console.error("Erro ao enviar:", err);
          res.status(500).json({ sucesso: false, erro: err.message });
        }
      });

      async function preencherSeVazio(page, selector, valor) {
        try {
          // Verificar se o elemento existe
          const elementoExiste = await page.$(selector);
          if (!elementoExiste) {
            console.log(`Elemento ${selector} não encontrado`);
            return;
          }
          
          // Verificar o valor do elemento de forma mais confiável
          const value = await page.evaluate(selector => {
            const elemento = document.querySelector(selector);
            // Verifica se o elemento existe e se ele tem um valor não vazio
            return elemento ? (elemento.value || '').trim() : '';
          }, selector);
          
          // Preencher apenas se o campo estiver realmente vazio
          if (!value) {
            console.log(`Preenchendo ${selector} com ${valor}`);
            await page.type(selector, valor);
          } else {
            console.log(`Campo ${selector} já tem valor: ${value}`);
          }
        } catch (error) {
          console.error(`Erro ao preencher ${selector}:`, error);
        }
      }

      backendServer = backendApp.listen(4000, () => {
        console.log("Servidor backend rodando em http://localhost:4000");
        resolve();
      });

    } catch (error) {
      reject(error);
    }
  });
}

// Eventos do aplicativo
app.whenReady().then(async () => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Iniciar o backend apenas em produção (em dev ele é iniciado separadamente)
    if (!isDev) {
      await startBackend();
      // Aguardar um pouco para o backend iniciar completamente
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Criar a janela principal
    createWindow();

  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    dialog.showErrorBox('Erro', 'Falha ao iniciar a aplicação: ' + error.message);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Fechar servidor backend
  if (backendServer) {
    backendServer.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Fechar servidor backend
  if (backendServer) {
    backendServer.close();
  }
});