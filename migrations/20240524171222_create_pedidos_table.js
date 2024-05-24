/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('pedidos', function(table) {
        table.increments('id').primary();
        table.integer('cliente_id').unsigned().notNullable();
        table.foreign('cliente_id').references('id').inTable('clientes').onDelete('CASCADE');
        table.timestamp('data_pedido').defaultTo(knex.fn.now());
        table.decimal('total', 10, 2).notNullable();
        table.string('status').notNullable(); // Adicionando a coluna status
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('pedidos');
  
};
