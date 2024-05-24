/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('produtos', function(table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('descricao');
        table.decimal('preco', 10, 2).notNullable();
        table.integer('estoque').notNullable();
        table.string('cover_url');
        table.timestamps(true, true);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('produtos')
  
};
