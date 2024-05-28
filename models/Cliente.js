const { Model } = require('objection');
const pedidos = require('../routes/pedidos');

class Cliente extends Model {
    static get tableName() {
        return 'clientes';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings(){
        const Pedido = require('./Pedido');
        return {
            pedidos: {
                relation: Model.HasManyRelation,
                modelClass: Pedido,
                join: {
                    from: 'clientes.id',
                    to: 'pedidos.cliente_id'
                }
            }
        };
    }
}

module.exports = Cliente;
