// Senhas
const senhaAcesso = "170594";
const senhaAdmin = "Schulze7273";

// Cartas por tema (armazenadas no localStorage)
function getCartas() {
  return JSON.parse(localStorage.getItem("cartasPorTema") || "[]");
}
function setCartas(cartas) {
  localStorage.setItem("cartasPorTema", JSON.stringify(cartas));
}

// Telas
function showLogin() {
  hideAll();
  document.getElementById("login-section").classList.remove("hidden");
}
function showAdminLogin() {
  hideAll();
  document.getElementById("admin-login-section").classList.remove("hidden");
}
function voltarLanding() {
  hideAll();
  document.getElementById("landing").classList.remove("hidden");
}
function hideAll() {
  document.querySelectorAll(".centered").forEach(e => e.classList.add("hidden"));
  document.getElementById("responder-btn").classList.add("hidden");
}

// Login do namorado
function login() {
  const senha = document.getElementById("senha-login").value;
  if (senha === senhaAcesso) {
    hideAll();
    mostrarTemas();
    document.getElementById("temas-section").classList.remove("hidden");
    document.getElementById("responder-btn").classList.remove("hidden");
    document.getElementById("login-msg").textContent = "";
  } else {
    document.getElementById("login-msg").textContent = "Senha incorreta!";
  }
}

// Logout
function logout() {
  hideAll();
  document.getElementById("landing").classList.remove("hidden");
}

// Temas e cartas
function mostrarTemas() {
  const list = document.getElementById("temas-list");
  list.innerHTML = "";
  const cartasPorTema = getCartas();
  if (!cartasPorTema.length) {
    list.innerHTML = "<p>Nenhuma carta cadastrada ainda.</p>";
    return;
  }
  cartasPorTema.forEach((carta, idx) => {
    const btn = document.createElement("button");
    btn.className = "tema-btn";
    btn.innerHTML = `${carta.emoji || ""} ${carta.tema}`;
    btn.onclick = () => mostrarCarta(idx);
    list.appendChild(btn);
  });
}

// Envelope virtual
function mostrarCarta(idx) {
  hideAll();
  document.getElementById("carta-section").classList.remove("hidden");
  document.getElementById("envelope").classList.remove("aberto");
  document.getElementById("carta-content").classList.add("hidden");
  document.getElementById("envelope").setAttribute("data-idx", idx);
}

function abrirEnvelope() {
  const envelope = document.getElementById("envelope");
  const idx = envelope.getAttribute("data-idx");
  envelope.classList.add("aberto");
  setTimeout(() => {
    mostrarConteudoCarta(idx);
  }, 600);
}

function mostrarConteudoCarta(idx) {
  const carta = getCartas()[idx];
  document.getElementById("carta-titulo").textContent = carta.titulo;
  document.getElementById("carta-texto").textContent = carta.texto;
  const extraDiv = document.getElementById("carta-extra");
  extraDiv.innerHTML = "";
  if (carta.extra && carta.extra.url) {
    let textoLink = "";
    switch (carta.extra.tipo) {
      case "musica": textoLink = "Ouça nossa música especial 🎶"; break;
      case "video": textoLink = "Veja nosso vídeo especial 🎥"; break;
      case "galeria": textoLink = "Veja nossa galeria secreta de fotos 📸"; break;
      case "link": textoLink = "Surpresa especial 🔗"; break;
      default: textoLink = "Surpresa especial";
    }
    extraDiv.innerHTML = `<a href="${carta.extra.url}" target="_blank">${textoLink}</a>`;
  }
  document.getElementById("carta-content").classList.remove("hidden");
}

function voltarTemas() {
  hideAll();
  mostrarTemas();
  document.getElementById("temas-section").classList.remove("hidden");
  document.getElementById("responder-btn").classList.remove("hidden");
}

// Resposta
function showResposta() {
  hideAll();
  document.getElementById("resposta-section").classList.remove("hidden");
}

// Formulário de resposta (Formspree: substitua pelo seu endpoint!)
document.getElementById("resposta-form").addEventListener("submit", function(e){
  e.preventDefault();
  const nome = document.getElementById("nome-remetente").value;
  const msg = document.getElementById("mensagem-resposta").value;
  fetch("https://formspree.io/f/mwpnedbg", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: JSON.stringify({ nome, mensagem: msg })
  })
  .then(response => {
    if (response.ok) {
      document.getElementById("resposta-msg").textContent = "Mensagem enviada! ❤️";
      document.getElementById("resposta-form").reset();
    } else {
      document.getElementById("resposta-msg").textContent = "Erro ao enviar mensagem.";
    }
  })
  .catch(() => {
    document.getElementById("resposta-msg").textContent = "Erro de conexão.";
  });
});

// Admin: login
function adminLogin() {
  const senha = document.getElementById("senha-admin").value;
  if (senha === senhaAdmin) {
    hideAll();
    document.getElementById("admin-section").classList.remove("hidden");
    renderAdminCartas();
    document.getElementById("admin-login-msg").textContent = "";
  } else {
    document.getElementById("admin-login-msg").textContent = "Senha administrativa incorreta!";
  }
}

// Admin: logout
function adminLogout() {
  hideAll();
  document.getElementById("landing").classList.remove("hidden");
}

// Admin: adicionar carta
document.getElementById("admin-form").addEventListener("submit", function(e){
  e.preventDefault();
  const tema = document.getElementById("tema-carta").value;
  const emoji = document.getElementById("emoji-carta").value;
  const titulo = document.getElementById("titulo-carta").value;
  const texto = document.getElementById("texto-carta").value;
  const extraTipo = document.getElementById("extra-tipo").value;
  const extraUrl = document.getElementById("extra-url").value;

  const cartasPorTema = getCartas();
  cartasPorTema.push({
    tema,
    emoji,
    titulo,
    texto,
    extra: extraTipo && extraUrl ? { tipo: extraTipo, url: extraUrl } : null
  });
  setCartas(cartasPorTema);
  renderAdminCartas();
  document.getElementById("admin-form").reset();
  document.getElementById("admin-msg").textContent = "Carta adicionada com sucesso!";
  setTimeout(()=>document.getElementById("admin-msg").textContent="", 2000);
});

// Admin: listar e remover cartas
function renderAdminCartas() {
  const cartasPorTema = getCartas();
  const list = document.getElementById("admin-cartas-list");
  list.innerHTML = "";
  if (!cartasPorTema.length) {
    list.innerHTML = "<p>Nenhuma carta cadastrada.</p>";
    return;
  }
  cartasPorTema.forEach((carta, idx) => {
    const div = document.createElement("div");
    div.className = "admin-carta-block";
    div.innerHTML = `<span><strong>${carta.emoji || ""} ${carta.tema}</strong> - ${carta.titulo}</span>
      <button onclick="removerCarta(${idx})">Remover</button>`;
    list.appendChild(div);
  });
}

function removerCarta(idx) {
  const cartasPorTema = getCartas();
  cartasPorTema.splice(idx, 1);
  setCartas(cartasPorTema);
  renderAdminCartas();
}
