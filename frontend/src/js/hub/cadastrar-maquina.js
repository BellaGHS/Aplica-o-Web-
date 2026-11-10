const form = document.querySelector(".form-maquina");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // isso aq nao deixa enviar sem salvar

  const dados = new FormData(form); // aqui faz ler todos os campos pelo nome
  dados.append("usuarioId", localStorage.getItem("usuarioId"));

  if (!dados.get("nome_impressora") || !dados.get("estado") || !dados.get("disponibilidade")) {
    alert("Preencha o nome, o estado e a disponibilidade");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/maquinas", {
      method: "POST",
      body: dados 
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      alert(erro.erro);
      return;
    }

    window.location.href = "frontend/src/html/hub_digital/maquinas/cadastrar-maquina";
  } catch {
    alert("Não foi possível conectar à API");
  }
});