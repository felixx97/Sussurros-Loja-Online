const { Model } = require('objection');

class ItemPedido extends Model {
    static get tableName() {
        return 'itens_pedido';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        const Produto = require('./Produto');
        const Pedido = require('./Pedido');

        return {
            produto: {
                relation: Model.BelongsToOneRelation,
                modelClass: Produto,
                join: {
                    from: 'itens_pedido.produto_id',
                    to: 'produtos.id'
                }
            },
            pedido: {
                relation: Model.BelongsToOneRelation,
                modelClass: Pedido,
                join: {
                    from: 'itens_pedido.pedido_id',
                    to: 'pedidos.id'
                }
            }
        };
    }
}

module.exports = ItemPedido;
