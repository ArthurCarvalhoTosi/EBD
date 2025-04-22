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
			headless: false,
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

		await page.type('input[name="icm_member_cpf"]', cpf);

		if (email && telefone && cidade && estado) {
			await preencherSeVazio(page, 'input[name="icm_member_email"]', email);
			await preencherSeVazio(
				page,
				'input[name="icm_member_telefone"]',
				telefone,
			);
			await preencherSeVazio(page, 'input[name="member_cidade"]', cidade);
			await preencherSeVazio(page, 'input[placeholder="UF"]', estado);
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
	const value = await page.$eval(selector, (el) => el.value);
	if (!value) {
		await page.type(selector, valor);
	}
}
