const { Model } = require('objection');

class Produto extends Model {
    static get tableName() {
        return 'produtos';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings(){
        const ItemPedido = require('./ItemPedido');
        return {
            itensPedido: {
                relation: Model.HasManyRelation,
                modelClass: ItemPedido,
                join: {
                    from: 'produtos.id',
                    to: 'itens_pedido.produto_id'
                }
            }
        };
    }
}

module.exports = Produto;
