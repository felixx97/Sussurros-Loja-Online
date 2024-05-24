const { Model } = require('objection');

class Pedido extends Model {
    static get tableName() {
        return 'pedidos';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        const Cliente = require('./Cliente');
        const ItemPedido = require('./ItemPedido');
        
        return {
            cliente: {
                relation: Model.BelongsToOneRelation,
                modelClass: Cliente,
                join: {
                    from: 'pedidos.cliente_id',
                    to: 'clientes.id'
                }
            },
            itensPedido: {
                relation: Model.HasManyRelation,
                modelClass: ItemPedido,
                join: {
                    from: 'pedidos.id',
                    to: 'itens_pedido.pedido_id'
                }
            }
        };
    }
}

module.exports = Pedido;
