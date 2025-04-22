# Sistema de Envio de Respostas EBD

Aplicação React para automatizar o envio de respostas da Escola Bíblica Dominical (EBD) para múltiplos CPFs.

## Funcionalidades

- Interface para inserção de lista de CPFs (separados por linha, vírgula ou ponto-e-vírgula)
- Campo para digitar a resposta a ser enviada
- Campos opcionais para e-mail, telefone, cidade e estado
- Monitoramento do progresso de envio em tempo real
- Visualização de resultados para cada CPF

## Requisitos para executar

- Node.js (v14.0.0 ou superior)
- NPM (v6.0.0 ou superior)

## Como instalar

1. Clone o repositório

```
git clone [URL_DO_REPOSITORIO]
cd ebd-resposta-automatica
```

2. Instale as dependências

```
npm install
```

3. Inicie a aplicação

```
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Como utilizar

1. Insira a lista de CPFs (um por linha ou separados por vírgula)
2. Digite a resposta completa a ser enviada
3. Opcionalmente, preencha os campos de e-mail, telefone, cidade e estado
4. Clique em "Enviar Respostas"
5. Acompanhe o progresso e resultados na tela

## Notas importantes

- Esta aplicação utiliza Puppeteer para automatizar um navegador Chrome
- Pode ser necessário ajustar seletores CSS caso o site da EBD sofra alterações
- Para questões de segurança, não armazenamos dados localmente
