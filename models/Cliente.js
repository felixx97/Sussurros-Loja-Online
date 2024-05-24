const { Model } = require('objection');

class Cliente extends Model {
    static get tableName() {
        return 'clientes';
    }

    static get idColumn() {
        return 'id';
    }
}

module.exports = Cliente;
