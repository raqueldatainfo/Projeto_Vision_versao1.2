const dataFile = 'Planta_CNAK.json';
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
    const response = await fetch(dataFile);
    if (!response.ok) {
      throw new Error('Falha ao carregar o arquivo JSON.');
    }
    plantaData = await response.json();
  } catch (error) {
    console.warn('Não foi possível carregar o JSON local. Usando dados internos.', error);
    plantaData = getInitialData();
  }
  ensurePrediosWithData();
  renderPredio(currentPredio);
};

const getInitialData = () => ({
  predios: [
    {
      id: 1,
      nome: 'Prédio 1',
      itens: []
    },
    {
      id: 2,
      nome: 'Prédio 2',
      itens: []
    },
    {
      id: 3,
      nome: 'Prédio 3',
      itens: []
    },
    {
      id: 4,
      nome: 'Prédio 4',
      itens: []
    }
  ]
});

const ensurePrediosWithData = () => {
  const base = plantaData.predios.find((item) => item.itens && item.itens.length > 0);
  if (!base) {
    plantaData = generateDefaultPlanta();
    return;
  }

  plantaData.predios = plantaData.predios.map((predio) => {
    if (predio.itens && predio.itens.length > 0) {
      return predio;
    }
    return {
      ...predio,
      itens: base.itens.map((item) => ({ ...item }))
    };
  });
};

const generateDefaultPlanta = () => {
  const itensBase = [];
  itensBase.push({ id: 'H1', tipo: 'Hall de Entrada', nome: 'Hall de Entrada' });
  itensBase.push({ id: 'S1', tipo: 'Suporte de Usuário', nome: 'Suporte de Usuário' });
  itensBase.push({ id: 'B1', tipo: 'Brigada de Segurança', nome: 'Brigada de Segurança' });
  itensBase.push({ id: 'F1', tipo: 'Praça de Alimentação', nome: 'Praça de Alimentação' });

  for (let i = 1; i <= 50; i++) {
    itensBase.push({ id: `C${i}`, tipo: 'Sala Comercial', nome: `Sala Comercial ${i}` });
  }
  for (let i = 1; i <= 50; i++) {
    itensBase.push({ id: `L${i}`, tipo: 'Loja', nome: `Loja ${i}` });
  }
  for (let i = 1; i <= 200; i++) {
    itensBase.push({ id: `P${i}`, tipo: 'Vaga de Estacionamento', nome: `Vaga ${i}` });
  }

  return {
    predios: [
      { id: 1, nome: 'Prédio 1', itens: itensBase.map((item) => ({ ...item })) },
      { id: 2, nome: 'Prédio 2', itens: itensBase.map((item) => ({ ...item })) },
      { id: 3, nome: 'Prédio 3', itens: itensBase.map((item) => ({ ...item })) },
      { id: 4, nome: 'Prédio 4', itens: itensBase.map((item) => ({ ...item })) }
    ]
  };
};

const getPredio = (id) => plantaData.predios.find((item) => item.id === Number(id));

const setPredio = (value) => {
  currentPredio = Number(value);
  editingItemId = null;
  resetForm();
  renderPredio(currentPredio);
};

const renderPredio = (predioId) => {
  const predio = getPredio(predioId);
  if (!predio) return;

  document.getElementById('planTitle').textContent = `Planta do ${predio.nome}`;
  document.getElementById('planDescription').textContent = `Visualização e gerenciamento da planta do ${predio.nome}.`;

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

  renderLayout(predio);
  renderItemList(predio);
};

const renderLayout = (predio) => {
  const layoutMap = document.getElementById('layoutMap');
  layoutMap.innerHTML = '';

  const fixedAreas = ['Hall de Entrada', 'Suporte de Usuário', 'Brigada de Segurança', 'Praça de Alimentação'];
  const fixedItems = predio.itens.filter((item) => fixedAreas.includes(item.tipo));
  const salas = predio.itens.filter((item) => item.tipo === 'Sala Comercial');
  const lojas = predio.itens.filter((item) => item.tipo === 'Loja');
  const vagas = predio.itens.filter((item) => item.tipo === 'Vaga de Estacionamento');

  const leftSector = document.createElement('div');
  leftSector.className = 'layout-sector';
  leftSector.innerHTML = `<h3>Áreas de Acesso</h3><p>Hall, suporte e brigada posicionados junto ao acesso principal para monitoramento.</p>`;
  const leftGrid = document.createElement('div');
  leftGrid.className = 'area-grid';
  fixedItems.forEach((item) => {
    const itemCard = document.createElement('div');
    itemCard.className = `icon-card ${typeColor[item.tipo] || 'hall'}`;
    itemCard.textContent = item.id;
    itemCard.title = `${item.tipo} — ${item.nome}`;
    leftGrid.appendChild(itemCard);
  });
  leftSector.appendChild(leftGrid);

  const rightSector = document.createElement('div');
  rightSector.className = 'layout-sector';
  rightSector.innerHTML = '<h3>Estacionamento</h3><p>Visualização das 200 vagas de estacionamento do prédio.</p>';
  const parkingGrid = document.createElement('div');
  parkingGrid.className = 'icon-grid';
  vagas.slice(0, 200).forEach((item) => {
    const icon = document.createElement('div');
    icon.className = `icon-card vaga`;
    icon.textContent = item.id.replace(/^P/, '');
    icon.title = `${item.tipo} — ${item.nome}`;
    parkingGrid.appendChild(icon);
  });
  rightSector.appendChild(parkingGrid);

  const centerSector = document.createElement('div');
  centerSector.className = 'layout-sector';
  centerSector.innerHTML = '<h3>Venda e Serviços</h3><p>Blocos de salas comerciais e lojas para fácil navegação da planta.</p>';
  const centerGrid = document.createElement('div');
  centerGrid.className = 'icon-grid';
  salas.concat(lojas).forEach((item) => {
    const icon = document.createElement('div');
    icon.className = `icon-card ${typeColor[item.tipo] || 'loja'}`;
    icon.textContent = item.id.replace(/^(C|L)/, '');
    icon.title = `${item.tipo} — ${item.nome}`;
    centerGrid.appendChild(icon);
  });
  centerSector.appendChild(centerGrid);

  layoutMap.appendChild(leftSector);
  layoutMap.appendChild(centerSector);
  layoutMap.appendChild(rightSector);
};

const renderItemList = (predio) => {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';
  document.getElementById('itemsCount').textContent = `${predio.itens.length} itens`;

  predio.itens.slice(0, 120).forEach((item) => {
    const row = document.createElement('div');
    row.className = 'item-row';

    const info = document.createElement('div');
    info.className = 'item-info';
    info.innerHTML = `<strong>${item.nome}</strong><span>${item.id} • ${item.tipo}</span>`;

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = () => editItem(item.id);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteItem(item.id);

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    row.appendChild(info);
    row.appendChild(actions);
    itemList.appendChild(row);
  });

  if (predio.itens.length > 120) {
    const more = document.createElement('p');
    more.style.color = 'var(--muted)';
    more.style.marginTop = '12px';
    more.textContent = `Apenas os primeiros 120 itens são mostrados na lista. Use a exportação para visualizar todos os ${predio.itens.length} registros.`;
    itemList.appendChild(more);
  }
};

const saveItem = (event) => {
  event.preventDefault();
  const predio = getPredio(currentPredio);
  const type = document.getElementById('itemType').value;
  const nome = document.getElementById('itemName').value.trim();
  const id = document.getElementById('itemId').value.trim();

  if (!nome || !id) return;

  const existing = predio.itens.find((item) => item.id === id);
  if (editingItemId && editingItemId !== id && existing) {
    alert('Já existe um item com este ID no prédio. Escolha outro ID.');
    return;
  }

  if (editingItemId) {
    const item = predio.itens.find((item) => item.id === editingItemId);
    if (item) {
      item.id = id;
      item.tipo = type;
      item.nome = nome;
    }
    editingItemId = null;
  } else {
    if (existing) {
      alert('Já existe um item com este ID no prédio. Escolha outro ID.');
      return;
    }
    predio.itens.push({ id, tipo: type, nome });
  }

  resetForm();
  renderPredio(currentPredio);
};

const editItem = (itemId) => {
  const predio = getPredio(currentPredio);
  const item = predio.itens.find((entry) => entry.id === itemId);
  if (!item) return;
  editingItemId = item.id;
  document.getElementById('itemType').value = item.tipo;
  document.getElementById('itemName').value = item.nome;
  document.getElementById('itemId').value = item.id;
};

const deleteItem = (itemId) => {
  const predio = getPredio(currentPredio);
  predio.itens = predio.itens.filter((item) => item.id !== itemId);
  if (editingItemId === itemId) {
    editingItemId = null;
    resetForm();
  }
  renderPredio(currentPredio);
};

const resetForm = () => {
  editingItemId = null;
  document.getElementById('itemForm').reset();
};

const exportJson = () => {
  const blob = new Blob([JSON.stringify(plantaData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Planta_CNAK.json';
  link.click();
  URL.revokeObjectURL(url);
};

window.addEventListener('DOMContentLoaded', loadData);
