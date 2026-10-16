const URL_API = "http://127.0.0.1:8000/api/avisos";

const formulario = document.querySelector("#form-aviso");
const lista = document.querySelector("#lista-avisos");
const mensagemSistema = document.querySelector("#mensagem-sistema");
const estadoApi = document.querySelector("#estado-api");
const botaoAtualizar = document.querySelector("#botao-atualizar");


async function lerResposta(resposta) {
  const dados = await resposta.json();

  if (!resposta.ok) {
    const detalhe = Array.isArray(dados.detail)
      ? dados.detail.map((erro) => erro.msg).join("; ")
      : dados.detail;
    throw new Error(detalhe || "A API não concluiu a operação.");
  }

  return dados;
}


function criarCartao(aviso) {
  const artigo = document.createElement("article");
  artigo.className = aviso.prioridade;
  artigo.innerHTML = `
    <h3>${aviso.titulo}</h3>
    <p>${aviso.mensagem}</p>
    <small>
      ${aviso.autor} · ${aviso.prioridade} · ${aviso.publicado_em}
    </small>
  `;
  return artigo;
}


async function carregarAvisos() {
  try {
    const resposta = await fetch(URL_API);
    const avisos = await lerResposta(resposta);

    lista.replaceChildren();
    avisos.forEach((aviso) => lista.appendChild(criarCartao(aviso)));
    estadoApi.textContent = "API online";
  } catch (erro) {
    estadoApi.textContent = "API indisponível";
    mensagemSistema.textContent = `Erro: ${erro.message}`;
    mensagemSistema.className = "erro";
  }
}


formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const aviso = {
    titulo: document.querySelector("#titulo").value.trim(),
    autor: document.querySelector("#autor").value.trim(),
    prioridade: document.querySelector("#prioridade").value,
    mensagem: document.querySelector("#mensagem-aviso").value.trim(),
  };

  try {
    const resposta = await fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aviso),
    });

    await lerResposta(resposta);
    mensagemSistema.textContent = "Aviso publicado com sucesso.";
    mensagemSistema.className = "sucesso";
    formulario.reset();
    await carregarAvisos();
  } catch (erro) {
    mensagemSistema.textContent = `Erro: ${erro.message}`;
    mensagemSistema.className = "erro";
  }
});


botaoAtualizar.addEventListener("click", carregarAvisos);
carregarAvisos();
