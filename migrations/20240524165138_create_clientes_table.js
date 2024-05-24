/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('clientes', function(table){
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('email').unique().notNullable();
        table.string('senha').notNullable();
        table.string('endereco').notNullable();
        table.string('telefone').notNullable();
        table.timestamps(true, true);
    });
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cliente')
  
};
