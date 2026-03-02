// Elementos do DOM
const inputNovoItem = document.getElementById('novoItemInput');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaCompras = document.getElementById('listaCompras');
const contadorItens = document.getElementById('contadorItens');
const mensagemAlerta = document.getElementById('mensagemAlerta');

// Array para armazenar os itens
let itens = [];

// Itens pré-cadastrados
const itensIniciais = [
    { id: Date.now() + 1, nome: 'Arroz', concluido: false },
    { id: Date.now() + 2, nome: 'Feijão', concluido: false },
    { id: Date.now() + 3, nome: 'Macarrão', concluido: true },
    { id: Date.now() + 4, nome: 'Leite', concluido: false },
    { id: Date.now() + 5, nome: 'Ovos', concluido: false }
];

// Carregar itens iniciais
itens = [...itensIniciais];

// Função para mostrar mensagem
function mostrarMensagem(texto, tipo = 'sucesso') {
    mensagemAlerta.textContent = texto;
    mensagemAlerta.className = `mensagem-alerta mostrar ${tipo}`;
    
    // Esconder mensagem após 3 segundos
    setTimeout(() => {
        mensagemAlerta.classList.remove('mostrar');
    }, 3000);
}

// Função para atualizar contador
function atualizarContador() {
    const totalItens = itens.length;
    const itensConcluidos = itens.filter(item => item.concluido).length;
    contadorItens.textContent = `${totalItens} itens (${itensConcluidos} concluídos)`;
}

// Função para renderizar lista
function renderizarLista() {
    listaCompras.innerHTML = '';
    
    itens.forEach(item => {
        const li = document.createElement('li');
        li.className = `item-lista ${item.concluido ? 'item-concluido' : ''}`;
        li.dataset.id = item.id;
        
        li.innerHTML = `
            <input type="checkbox" ${item.concluido ? 'checked' : ''}>
            <span class="item-nome">${item.nome}</span>
            <button class="btn-remover" title="Remover item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Evento do checkbox
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            item.concluido = checkbox.checked;
            li.classList.toggle('item-concluido', item.concluido);
            atualizarContador();
            mostrarMensagem(`Item "${item.nome}" marcado como ${item.concluido ? 'concluído' : 'pendente'}`);
        });
        
        // Evento do botão remover
        const btnRemover = li.querySelector('.btn-remover');
        btnRemover.addEventListener('click', (e) => {
            e.stopPropagation();
            removerItem(item.id, li);
        });
        
        listaCompras.appendChild(li);
    });
    
    atualizarContador();
}

// Função para adicionar novo item
function adicionarItem() {
    const nomeItem = inputNovoItem.value.trim();
    
    if (!nomeItem) {
        mostrarMensagem('Por favor, digite um nome para o item!', 'erro');
        inputNovoItem.style.borderColor = '#dc3545';
        setTimeout(() => {
            inputNovoItem.style.borderColor = '#e0e0e0';
        }, 1000);
        return;
    }
    
    const novoItem = {
        id: Date.now(),
        nome: nomeItem,
        concluido: false
    };
    
    itens.push(novoItem);
    renderizarLista();
    
    // Limpar input
    inputNovoItem.value = '';
    inputNovoItem.focus();
    
    mostrarMensagem(`Item "${nomeItem}" adicionado com sucesso!`);
}

// Função para remover item com animação
function removerItem(id, elemento) {
    const item = itens.find(i => i.id === id);
    const nomeItem = item.nome;
    
    // Adicionar classe de animação de remoção
    elemento.classList.add('item-removendo');
    
    // Remover após animação
    setTimeout(() => {
        itens = itens.filter(item => item.id !== id);
        renderizarLista();
        mostrarMensagem(`Item "${nomeItem}" removido da lista!`);
    }, 300);
}

// Evento do botão adicionar
btnAdicionar.addEventListener('click', adicionarItem);

// Evento do input (tecla Enter)
inputNovoItem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarItem();
    }
});

// Evento para limpar estilo de erro ao digitar
inputNovoItem.addEventListener('input', () => {
    inputNovoItem.style.borderColor = '#e0e0e0';
});

// Renderizar lista inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarLista();
    mostrarMensagem('Bem-vindo ao Quicklist!', 'sucesso');
});

// Opcional: Função para limpar todos os itens concluídos
function limparConcluidos() {
    const concluidos = itens.filter(item => item.concluido);
    
    if (concluidos.length === 0) {
        mostrarMensagem('Não há itens concluídos para remover!', 'erro');
        return;
    }
    
    itens = itens.filter(item => !item.concluido);
    renderizarLista();
    mostrarMensagem(`${concluidos.length} itens concluídos foram removidos!`);
}

// Opcional: Tecla de atalho (Ctrl+Shift+C) para limpar concluídos
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        limparConcluidos();
    }
});