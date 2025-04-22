// frontend/src/services/api.js
export async function enviarResposta(data) {
	const response = await fetch("http://localhost:4000/enviar-resposta", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	const json = await response.json();
	return json;
}
