import React from "react";
import "./App.css";
import FormularioEBD from "./components/FormularioEBD";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Sistema de Envio de Respostas EBD</h1>
			</header>
			<main>
				<FormularioEBD />
			</main>
			<footer>
				<p>
					© {new Date().getFullYear()} - Desenvolvido por Arthur Carvalho Tosi
				</p>
			</footer>
		</div>
	);
}

export default App;
