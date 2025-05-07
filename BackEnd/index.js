const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/enviar-resposta", async (req, res) => {
	const { cpf, resposta, email, telefone, cidade, estado } = req.body;

	try {
		const browser = await puppeteer.launch({
			headless: true,
			defaultViewport: null,
			args: ["--start-maximized"],
		});
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

app.listen(4000, () => {
	console.log("Servidor rodando em http://localhost:4000");
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
