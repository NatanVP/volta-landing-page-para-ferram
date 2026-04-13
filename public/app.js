(function () {
  'use strict';

  const form = document.getElementById('form-waitlist');
  const inputEmail = document.getElementById('input-email');
  const btnSubmit = document.getElementById('btn-submit');
  const mensagemEl = document.getElementById('mensagem-form');
  const contadorEl = document.getElementById('contador-waitlist');

  function exibirMensagem(texto, tipo) {
    mensagemEl.textContent = texto;
    mensagemEl.className = 'hero__mensagem';
    if (tipo === 'sucesso') mensagemEl.classList.add('hero__mensagem--sucesso');
    if (tipo === 'erro') mensagemEl.classList.add('hero__mensagem--erro');
    if (tipo === 'aviso') mensagemEl.classList.add('hero__mensagem--aviso');
  }

  function limparMensagem() {
    mensagemEl.textContent = '';
    mensagemEl.className = 'hero__mensagem';
  }

  async function carregarContador() {
    try {
      const resposta = await fetch('/api/waitlist/total');
      if (!resposta.ok) return;
      const dados = await resposta.json();
      const total = dados.total;
      if (typeof total === 'number') {
        contadorEl.textContent = total.toLocaleString('pt-BR') + ' pessoas já estão na fila';
      }
    } catch (_) {
      // silencioso — contador é secundário
    }
  }

  async function registrarNaWaitlist(email) {
    const resposta = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'hero' }),
    });

    if (resposta.ok) {
      exibirMensagem('Você está na fila! Avisaremos no lançamento.', 'sucesso');
      inputEmail.value = '';
      await carregarContador();
      return;
    }

    if (resposta.status === 409) {
      exibirMensagem('Este email já está cadastrado.', 'aviso');
      return;
    }

    exibirMensagem('Algo deu errado. Tente novamente.', 'erro');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    limparMensagem();

    const email = inputEmail.value.trim();
    if (!email) {
      exibirMensagem('Digite um email válido.', 'erro');
      inputEmail.focus();
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Aguarde...';

    try {
      await registrarNaWaitlist(email);
    } catch (_) {
      exibirMensagem('Algo deu errado. Tente novamente.', 'erro');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Entrar na waitlist';
    }
  });

  carregarContador();
})();
