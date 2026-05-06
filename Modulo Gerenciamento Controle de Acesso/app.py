from pathlib import Path
import json
from threading import Lock
from flask import Flask, jsonify, request, render_template

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / 'Planta_CNAK.json'
DATA_LOCK = Lock()

app = Flask(__name__, template_folder='templates', static_folder='static')

DEFAULT_TYPES = [
    'Sala Comercial',
    'Loja',
    'Vaga de Estacionamento',
    'Praça de Alimentação',
    'Hall de Entrada',
    'Suporte de Usuário',
    'Brigada de Segurança'
]


def generate_default_planta():
    itens = []
    itens.append({'id': 'H1', 'tipo': 'Hall de Entrada', 'nome': 'Hall de Entrada'})
    itens.append({'id': 'S1', 'tipo': 'Suporte de Usuário', 'nome': 'Suporte de Usuário'})
    itens.append({'id': 'B1', 'tipo': 'Brigada de Segurança', 'nome': 'Brigada de Segurança'})
    itens.append({'id': 'F1', 'tipo': 'Praça de Alimentação', 'nome': 'Praça de Alimentação'})

    for i in range(1, 51):
        itens.append({'id': f'C{i}', 'tipo': 'Sala Comercial', 'nome': f'Sala Comercial {i}'})
    for i in range(1, 51):
        itens.append({'id': f'L{i}', 'tipo': 'Loja', 'nome': f'Loja {i}'})
    for i in range(1, 201):
        itens.append({'id': f'P{i}', 'tipo': 'Vaga de Estacionamento', 'nome': f'Vaga {i}'})

    return {
        'predios': [
            {'id': idx, 'nome': f'Prédio {idx}', 'itens': [item.copy() for item in itens]}
            for idx in range(1, 5)
        ]
    }


def load_data():
    if DATA_FILE.exists():
        try:
            with DATA_FILE.open('r', encoding='utf-8') as file:
                data = json.load(file)
        except (json.JSONDecodeError, IOError):
            data = generate_default_planta()
    else:
        data = generate_default_planta()

    if 'predios' not in data or not isinstance(data['predios'], list):
        data = generate_default_planta()

    existing = {predio.get('id'): predio for predio in data['predios'] if isinstance(predio, dict) and predio.get('id')}
    for idx in range(1, 5):
        predio = existing.get(idx)
        if predio is None:
            data['predios'].append({'id': idx, 'nome': f'Prédio {idx}', 'itens': [item.copy() for item in generate_default_planta()['predios'][0]['itens']]})
        elif not predio.get('itens'):
            predio['itens'] = [item.copy() for item in generate_default_planta()['predios'][0]['itens']]

    data['predios'] = sorted(data['predios'], key=lambda x: x['id'])
    return data


def save_data(data):
    with DATA_LOCK:
        with DATA_FILE.open('w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/predios', methods=['GET'])
def get_predios():
    return jsonify(planta_data)


@app.route('/api/item', methods=['POST'])
def upsert_item():
    payload = request.get_json(force=True)
    if not payload:
        return jsonify({'error': 'Dados inválidos'}), 400

    predio_id = payload.get('predio_id')
    item_id = payload.get('id')
    tipo = payload.get('tipo')
    nome = payload.get('nome')
    original_id = payload.get('original_id')

    if not predio_id or not item_id or not tipo or not nome:
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    predio = next((p for p in planta_data['predios'] if p['id'] == int(predio_id)), None)
    if not predio:
        return jsonify({'error': 'Prédio não encontrado'}), 404

    existing = next((item for item in predio['itens'] if item['id'] == item_id), None)
    if original_id:
        item_to_edit = next((item for item in predio['itens'] if item['id'] == original_id), None)
        if not item_to_edit:
            return jsonify({'error': 'Item original não encontrado'}), 404
        if item_id != original_id and existing:
            return jsonify({'error': 'ID já existe'}), 409
        item_to_edit.update({'id': item_id, 'tipo': tipo, 'nome': nome})
    else:
        if existing:
            return jsonify({'error': 'ID já existe'}), 409
        predio['itens'].append({'id': item_id, 'tipo': tipo, 'nome': nome})

    save_data(planta_data)
    return jsonify({'success': True, 'predio': predio})


@app.route('/api/item', methods=['DELETE'])
def delete_item():
    predio_id = request.args.get('predio_id', type=int)
    item_id = request.args.get('id')
    if not predio_id or not item_id:
        return jsonify({'error': 'Parâmetros obrigatórios faltando'}), 400

    predio = next((p for p in planta_data['predios'] if p['id'] == predio_id), None)
    if not predio:
        return jsonify({'error': 'Prédio não encontrado'}), 404

    predio['itens'] = [item for item in predio['itens'] if item['id'] != item_id]
    save_data(planta_data)
    return jsonify({'success': True, 'predio': predio})


if __name__ == '__main__':
    planta_data = load_data()
    app.run(host='0.0.0.0', port=8000, debug=True)
