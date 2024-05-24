/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('itens_pedido', function(table) {
        table.increments('id').primary();
        table.integer('pedido_id').unsigned().notNullable();
        table.foreign('pedido_id').references('id').inTable('pedidos').onDelete('CASCADE');
        table.integer('produto_id').unsigned().notNullable();
        table.foreign('produto_id').references('id').inTable('produtos').onDelete('CASCADE');
        table.integer('quantidade').notNullable();
        table.decimal('preco', 10, 2).notNullable();
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('itens_pedido');
  
};
