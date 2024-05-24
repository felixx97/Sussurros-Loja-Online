const { Model } = require('objection');

class Produto extends Model {
    static get tableName() {
        return 'produtos';
    }

    static get idColumn() {
        return 'id';
    }
}

module.exports = Produto;
