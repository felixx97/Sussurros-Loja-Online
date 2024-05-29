const { Model } = require('objection');

class ItemPedido extends Model {
    static get tableName() {
        return 'itens_pedido';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        const Pedido = require('./Pedido');
        const Produto = require('./Produto');

        return {
            pedido: {
                relation: Model.BelongsToOneRelation,
                modelClass: Pedido,
                join: {
                    from: 'itens_pedido.pedido_id',
                    to: 'pedidos.id'
                }
            },
            produto: {
                relation: Model.BelongsToOneRelation,
                modelClass: Produto,
                join: {
                    from: 'itens_pedido.produto_id',
                    to: 'produtos.id'
                }
            }
        };
    }
}

module.exports = ItemPedido;
