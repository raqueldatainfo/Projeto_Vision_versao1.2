# Sistema de Controle de Acesso CNAK

Sistema web para gerenciamento da planta de prédios do empreendimento CNAK, desenvolvido em Python com Flask.

## Funcionalidades

- **Visualização da Planta**: Interface web que simula uma planta arquitetônica real com elementos posicionados estrategicamente e fundo sofisticado.
- **Distribuição Segregada**: Elementos organizados em áreas específicas (acesso, salas comerciais, lojas, praça de alimentação, estacionamento).
- **CRUD Interativo**: Clique diretamente nos ícones da planta para editar ou excluir itens via modal.
- **Seleção de Prédio**: Navegue entre os 4 prédios do empreendimento.
- **Labels Identificadoras**: Áreas da planta claramente identificadas com labels visuais.
- **Exportação de Dados**: Baixe o arquivo `Planta_CNAK.json` com todas as alterações.

## Estrutura da Planta

### Distribuição Visual
- **Área de Acesso** (superior): Hall de entrada, suporte de usuário e brigada de segurança
- **Salas Comerciais** (esquerda superior): 50 salas organizadas em grid 5x10
- **Lojas** (direita superior): 50 lojas organizadas em grid 5x10
- **Praça de Alimentação** (centro): Área central de alimentação
- **Estacionamento** (inferior): 200 vagas organizadas em grid 10x20

### Elementos
- 50 Salas Comerciais (azul com gradiente)
- 50 Lojas (verde escuro com gradiente)
- 200 Vagas de Estacionamento (laranja com gradiente)
- 1 Praça de Alimentação (roxo com gradiente)
- 1 Hall de Entrada (azul claro com gradiente)
- 1 Suporte de Usuário (verde com gradiente)
- 1 Brigada de Segurança (vermelho com gradiente)

## Visual Arquitetônico

- **Fundo Sofisticado**: Grade quadriculada sutil com elementos arquitetônicos transparentes
- **Gradientes Modernos**: Todos os elementos com gradientes suaves para efeito 3D
- **Labels de Área**: Identificação clara de cada seção da planta
- **Hover Effects**: Animações suaves ao passar o mouse sobre os elementos
- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis

## Como Executar

### 1. Instalar Dependências
```bash
cd "Modulo Gerenciamento Controle de Acesso"
pip install -r requirements.txt
```

### 2. Executar o Servidor
```bash
python app.py
```

### 3. Acessar no Navegador
Abra `http://localhost:8000`

## APIs Disponíveis

- `GET /api/predios`: Retorna todos os prédios e itens
- `POST /api/item`: Cria ou atualiza um item
- `DELETE /api/item`: Remove um item

## Arquivos Principais

- `app.py`: Backend Flask com APIs REST
- `templates/index.html`: Página principal
- `static/styles.css`: Estilos CSS com design arquitetônico
- `static/script.js`: Lógica frontend com posicionamento inteligente
- `Planta_CNAK.json`: Dados da planta

## Melhorias Recentes

- ✅ **Layout em Blocos**: Abandono da simulação de planta arquitetônica
- ✅ **Organização por Seções**: Cada tipo de espaço em seu próprio bloco retangular
- ✅ **Distribuição Lado a Lado**: Blocos organizados horizontalmente na tela
- ✅ **Grid Responsivo**: Elementos dimensionados dinamicamente dentro de cada bloco
- ✅ **Separação Visual Clara**: Bordas e títulos distintos para cada seção
- ✅ **Sem Sobreposições**: Cada elemento em sua posição calculada precisamente
- ✅ **Interface Limpa**: Foco na funcionalidade CRUD sem complexidade visual
- `static/styles.css`: Estilos CSS
- `static/script.js`: Lógica frontend
- `Planta_CNAK.json`: Dados da planta

## APIs Disponíveis

- `GET /api/predios`: Retorna todos os prédios e itens
- `POST /api/item`: Cria ou atualiza um item
- `DELETE /api/item`: Remove um item

## Melhorias Visuais

- Layout simulando planta arquitetônica real
- Ícones clicáveis para acesso direto ao CRUD
- Modal responsivo para edição
- Design responsivo para dispositivos móveis
- Fundo quadriculado para efeito de planta técnica