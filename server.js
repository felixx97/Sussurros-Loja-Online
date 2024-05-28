require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Knex = require('knex');
const { Model } = require('objection');
const clienteRoutes = require('./routes/clientes');
const produtoRoutes = require('./routes/produtos');
const pedidoRoutes = require('./routes/pedidos');

// Inicializando o Knex e Objection
const knex = Knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

Model.knex(knex);

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Registrando as rotas para clientes
    server.route(clienteRoutes);

    // Registrando as rotas para produtos
    server.route(produtoRoutes);

    // Registrando as rotas para pedidos
    server.route(pedidoRoutes);

    // Iniciando o servidor
    await server.start();
    console.log('Servidor rodando em', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
