const apiUrl = '/api/predios';
let plantaData = null;
let currentPredio = 1;
let editingItemId = null;

const typeColor = {
  'Sala Comercial': 'sala',
  'Loja': 'loja',
  'Vaga de Estacionamento': 'vaga',
  'Praça de Alimentação': 'foodcourt',
  'Hall de Entrada': 'hall',
  'Suporte de Usuário': 'suporte',
  'Brigada de Segurança': 'brigada'
};

const loadData = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do servidor');
    }
    plantaData = await response.json();
    renderPredio(currentPredio);
  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar a planta do servidor. Verifique se o app Python está em execução.');
  }
};

const getPredio = (id) => plantaData.predios.find((item) => item.id === Number(id));

const setPredio = (value) => {
  currentPredio = Number(value);
  editingItemId = null;
  closeModal();
  renderPredio(currentPredio);
};

const renderPredio = (predioId) => {
  const predio = getPredio(predioId);
  if (!predio) return;

  document.getElementById('planTitle').textContent = `Planta do ${predio.nome}`;
  document.getElementById('planDescription').textContent = `Visualização da planta atual do ${predio.nome}.`;

  const salaCount = predio.itens.filter((item) => item.tipo === 'Sala Comercial').length;
  const lojaCount = predio.itens.filter((item) => item.tipo === 'Loja').length;
  const vagaCount = predio.itens.filter((item) => item.tipo === 'Vaga de Estacionamento').length;
  const foodCount = predio.itens.filter((item) => item.tipo === 'Praça de Alimentação').length;
  const hallCount = predio.itens.filter((item) => item.tipo === 'Hall de Entrada').length;
  const suporteCount = predio.itens.filter((item) => item.tipo === 'Suporte de Usuário').length;
  const brigadaCount = predio.itens.filter((item) => item.tipo === 'Brigada de Segurança').length;

  document.getElementById('countSala').textContent = salaCount;
  document.getElementById('countLoja').textContent = lojaCount;
  document.getElementById('countVagas').textContent = vagaCount;
  document.getElementById('countPraça').textContent = foodCount;
  document.getElementById('countHall').textContent = hallCount;
  document.getElementById('countSuporte').textContent = suporteCount;
  document.getElementById('countBrigada').textContent = brigadaCount;

  renderPlanta(predio);
};

const renderPlanta = (predio) => {
  const layoutMap = document.getElementById('layoutMap');
  layoutMap.innerHTML = '';

  const plantaContainer = document.createElement('div');
  plantaContainer.className = 'planta-container';

  const background = document.createElement('div');
  background.className = 'planta-background';
  plantaContainer.appendChild(background);

  // Criar blocos para cada tipo de espaço
  const blocos = [
    {
      tipo: 'Suporte de Usuário',
      titulo: 'SUPORTE DE USUÁRIO',
      pos: { top: 20, left: 20, width: 200, height: 100 },
      grid: { cols: 2, rows: 1, spacing: 10 }
    },
    {
      tipo: 'Hall de Entrada',
      titulo: 'HALL DE ENTRADA',
      pos: { top: 20, left: 250, width: 300, height: 100 },
      grid: { cols: 1, rows: 1, spacing: 10 }
    },
    {
      tipo: 'Brigada de Segurança',
      titulo: 'BRIGADA DE SEGURANÇA',
      pos: { top: 20, left: 580, width: 200, height: 100 },
      grid: { cols: 2, rows: 1, spacing: 10 }
    },
    {
      tipo: 'Sala Comercial',
      titulo: 'SALAS COMERCIAIS',
      pos: { top: 140, left: 20, width: 380, height: 300 },
      grid: { cols: 5, rows: 10, spacing: 8 }
    },
    {
      tipo: 'Praça de Alimentação',
      titulo: 'PRAÇA DE ALIMENTAÇÃO',
      pos: { top: 140, left: 420, width: 360, height: 150 },
      grid: { cols: 2, rows: 1, spacing: 10 }
    },
    {
      tipo: 'Loja',
      titulo: 'LOJAS',
      pos: { top: 310, left: 420, width: 360, height: 300 },
      grid: { cols: 5, rows: 10, spacing: 8 }
    },
    {
      tipo: 'Vaga de Estacionamento',
      titulo: 'VAGAS DE ESTACIONAMENTO',
      pos: { top: 630, left: 20, width: 760, height: 400 },
      grid: { cols: 10, rows: 20, spacing: 6 }
    }
  ];

  // Renderizar cada bloco
  blocos.forEach(bloco => {
    const blocoElement = document.createElement('div');
    blocoElement.className = 'bloco-container';
    blocoElement.style.position = 'absolute';
    blocoElement.style.top = `${bloco.pos.top}px`;
    blocoElement.style.left = `${bloco.pos.left}px`;
    blocoElement.style.width = `${bloco.pos.width}px`;
    blocoElement.style.height = `${bloco.pos.height}px`;

    // Título do bloco
    const tituloElement = document.createElement('div');
    tituloElement.className = 'bloco-titulo';
    tituloElement.textContent = bloco.titulo;
    blocoElement.appendChild(tituloElement);

    // Container dos elementos
    const elementosContainer = document.createElement('div');
    elementosContainer.className = 'elementos-container';
    elementosContainer.style.width = '100%';
    elementosContainer.style.height = 'calc(100% - 30px)';
    elementosContainer.style.padding = '5px';
    elementosContainer.style.boxSizing = 'border-box';

    // Filtrar itens do tipo atual
    const itens = predio.itens.filter(item => item.tipo === bloco.tipo);

    // Calcular dimensões dos elementos no grid
    const gridWidth = bloco.pos.width - 10; // padding
    const gridHeight = bloco.pos.height - 35; // título + padding
    const elementWidth = (gridWidth - (bloco.grid.cols - 1) * bloco.grid.spacing) / bloco.grid.cols;
    const elementHeight = (gridHeight - (bloco.grid.rows - 1) * bloco.grid.spacing) / bloco.grid.rows;

    // Renderizar elementos no grid
    itens.forEach((item, index) => {
      if (index >= bloco.grid.cols * bloco.grid.rows) return; // Limite do grid

      const col = index % bloco.grid.cols;
      const row = Math.floor(index / bloco.grid.cols);

      const pos = {
        top: row * (elementHeight + bloco.grid.spacing),
        left: col * (elementWidth + bloco.grid.spacing),
        width: elementWidth,
        height: elementHeight
      };

      const element = createElement(item, pos);
      elementosContainer.appendChild(element);
    });

    blocoElement.appendChild(elementosContainer);
    plantaContainer.appendChild(blocoElement);
  });

  layoutMap.appendChild(plantaContainer);
};

const createElement = (item, pos) => {
  const element = document.createElement('div');
  element.className = `planta-element ${typeColor[item.tipo]}`;
  element.textContent = item.id;
  element.title = `${item.tipo} — ${item.nome}`;
  element.onclick = () => openModal(item);

  element.style.position = 'absolute';
  element.style.top = `${pos.top}px`;
  element.style.left = `${pos.left}px`;
  element.style.width = `${pos.width}px`;
  element.style.height = `${pos.height}px`;

  return element;
};

const openModal = (item) => {
  editingItemId = item.id;
  document.getElementById('modalTitle').textContent = `Editar ${item.tipo}`;
  document.getElementById('itemType').value = item.tipo;
  document.getElementById('itemName').value = item.nome;
  document.getElementById('itemId').value = item.id;
  document.getElementById('crudModal').style.display = 'block';
};

const closeModal = () => {
  document.getElementById('crudModal').style.display = 'none';
  editingItemId = null;
};

const saveItem = async (event) => {
  event.preventDefault();
  const predio = getPredio(currentPredio);
  const type = document.getElementById('itemType').value;
  const nome = document.getElementById('itemName').value.trim();
  const id = document.getElementById('itemId').value.trim();

  if (!nome || !id) return;

  const payload = {
    predio_id: currentPredio,
    id,
    tipo: type,
    nome
  };

  if (editingItemId) {
    payload.original_id = editingItemId;
  }

  try {
    const response = await fetch('/api/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Falha ao salvar item');
    }

    plantaData = await fetch(apiUrl).then((res) => res.json());
    closeModal();
    renderPredio(currentPredio);
  } catch (error) {
    alert(error.message);
  }
};

const deleteCurrentItem = async () => {
  if (!editingItemId) return;

  try {
    const response = await fetch(`/api/item?predio_id=${currentPredio}&id=${encodeURIComponent(editingItemId)}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Falha ao excluir item');
    }

    plantaData = await fetch(apiUrl).then((res) => res.json());
    closeModal();
    renderPredio(currentPredio);
  } catch (error) {
    alert(error.message);
  }
};

const exportJson = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Planta_CNAK.json';
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Falha ao exportar JSON.');
  }
};

window.addEventListener('DOMContentLoaded', loadData);
