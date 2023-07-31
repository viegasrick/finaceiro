// Função para adicionar uma nova transação
function adicionarTransacao() {
  const data = document.getElementById("data").value;
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;

  if (!data || !descricao || isNaN(valor) || valor === 0) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const transacao = { data, descricao, valor, tipo };
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
  transacoes.push(transacao);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  limparCampos();
  atualizarTabela();
  atualizarSaldo();
}

// Função para limpar os campos do formulário após adicionar uma transação
function limparCampos() {
  document.getElementById("data").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("tipo").value = "receita";
}

// Função para excluir uma transação
function excluirTransacao(index) {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizarTabela();
  atualizarSaldo();
}

// Função para atualizar a tabela de transações
function atualizarTabela() {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
  const tableBody = document.querySelector(".transactions-table tbody");
  tableBody.innerHTML = "";

  if (transacoes.length === 0) {
    document
      .querySelector(".no-transactions-message")
      .classList.remove("hidden");
  } else {
    document.querySelector(".no-transactions-message").classList.add("hidden");
  }

  transacoes.forEach((transacao, index) => {
    const row = tableBody.insertRow();
    const tipoClass = transacao.tipo === "receita" ? "receita" : "despesa";

    // Verificar se transacao.valor não é null antes de chamar toFixed()
    const valor = transacao.valor !== null ? transacao.valor.toFixed(2) : "N/A";

    row.innerHTML = `
      <td>${transacao.data}</td>
      <td>${transacao.descricao}</td>
      <td class="${tipoClass}">${valor}</td>
      <td>${
        transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)
      }</td>
      <td><button class="edit-button" onclick="editarTransacao(${index})">Editar</button></td>
      <td><button class="delete-button" onclick="excluirTransacao(${index})">Excluir</button></td>
    `;
  });
}

// Função para editar uma transação
function editarTransacao(index) {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
  const transacao = transacoes[index];

  if (!transacao) {
    alert("Transação não encontrada.");
    return;
  }

  // Preencher o formulário com os valores da transação a ser editada
  document.getElementById("data").value = transacao.data;
  document.getElementById("descricao").value = transacao.descricao;
  document.getElementById("valor").value = transacao.valor;
  document.getElementById("tipo").value = transacao.tipo;

  // Remover a transação do array
  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  // Atualizar a tabela e saldo sem a transação editada
  atualizarTabela();
  atualizarSaldo();
}

// Função para calcular e atualizar o saldo
function atualizarSaldo() {
  const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
  let saldo = 0;
  transacoes.forEach((transacao) => {
    if (transacao.tipo === "receita") {
      saldo += transacao.valor;
    } else {
      saldo -= transacao.valor;
    }
  });

  const saldoElement = document.getElementById("saldo");
  saldoElement.textContent = saldo.toFixed(2);
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  atualizarTabela();
  atualizarSaldo();
});
