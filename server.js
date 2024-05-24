require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Knex = require('knex');
const { Model } = require('objection');

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

const Cliente = require('./models/Cliente');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Rota para obter todos os clientes
    server.route({
        method: 'GET',
        path: '/clientes',
        handler: async (request, h) => {
            try {
                const clientes = await Cliente.query();
                return h.response(clientes).code(200);
            } catch (err) {
                return h.response(err).code(500);
            }
        }
    });

    // Rota para criar um novo cliente
    server.route({
        method: 'POST',
        path: '/clientes',
        handler: async (request, h) => {
            const { nome, email, senha, endereco, telefone } = request.payload;
            try {
                const novoCliente = await Cliente.query().insert({
                    nome,
                    email,
                    senha,
                    endereco,
                    telefone
                });
                return h.response(novoCliente).code(201);
            } catch (err) {
                return h.response(err).code(500);
            }
        }
    });

    // Rota para obter um cliente pelo ID
    server.route({
        method: 'GET',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            try {
                const cliente = await Cliente.query().findById(request.params.id);
                if (cliente) {
                    return h.response(cliente).code(200);
                } else {
                    return h.response({ message: 'Cliente não encontrado' }).code(404);
                }
            } catch (err) {
                return h.response(err).code(500);
            }
        }
    });

    // Rota para atualizar um cliente pelo ID
    server.route({
        method: 'PUT',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            const { nome, email, senha, endereco, telefone } = request.payload;
            try {
                const clienteAtualizado = await Cliente.query().patchAndFetchById(request.params.id, {
                    nome,
                    email,
                    senha,
                    endereco,
                    telefone
                });
                return h.response(clienteAtualizado).code(200);
            } catch (err) {
                return h.response(err).code(500);
            }
        }
    });

    // Rota para deletar um cliente pelo ID
    server.route({
        method: 'DELETE',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            try {
                await Cliente.query().deleteById(request.params.id);
                return h.response({ message: 'Cliente deletado com sucesso' }).code(200);
            } catch (err) {
                return h.response(err).code(500);
            }
        }
    });

    // Iniciando o servidor
    await server.start();
    console.log('Servidor rodando em %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
