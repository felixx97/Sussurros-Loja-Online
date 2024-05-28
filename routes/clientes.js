const Joi = require('joi');
const Cliente = require('../models/Cliente');

module.exports = [
    {
        method: 'GET',
        path: '/clientes',
        handler: async (request, h) => {
            try {
                const clientes = await Cliente.query();
                return clientes;
            } catch (error) {
                console.error('Erro ao obter clientes do banco de dados:', error);
                return h.response({ message: 'Erro ao obter clientes do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'GET',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const cliente = await Cliente.query().findById(id);
                if (cliente) {
                    return cliente;
                } else {
                    return h.response({ message: 'Cliente não encontrado' }).code(404);
                }
            } catch (error) {
                console.error('Erro ao obter cliente do banco de dados:', error);
                return h.response({ message: 'Erro ao obter cliente do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'POST',
        path: '/clientes',
        handler: async (request, h) => {
            const { nome, email, endereco, senha, telefone } = request.payload;
            try {
                const novoCliente = await Cliente.query().insert({
                    nome,
                    email,
                    endereco,
                    senha,
                    telefone
                });
                return h.response(novoCliente).code(201);
            } catch (error) {
                console.error('Erro ao criar novo cliente:', error);
                return h.response({ message: 'Erro ao criar novo cliente' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    nome: Joi.string().required(),
                    email: Joi.string().email().required(),
                    endereco: Joi.string().required(),
                    senha: Joi.string().required(),
                    telefone: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { nome, email, endereco, senha, telefone } = request.payload;
            try {
                const clienteAtualizado = await Cliente.query().findById(id).patch({
                    nome,
                    email,
                    endereco,
                    senha,
                    telefone
                });
                return h.response(clienteAtualizado).code(200);
            } catch (error) {
                console.error('Erro ao atualizar cliente:', error);
                return h.response({ message: 'Erro ao atualizar cliente' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    nome: Joi.string().required(),
                    email: Joi.string().email().required(),
                    endereco: Joi.string().required(),
                    senha: Joi.string().required(),
                    telefone: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/clientes/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                await Cliente.query().deleteById(id);
                return h.response({ message: 'Cliente excluído com sucesso' }).code(200);
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                return h.response({ message: 'Erro ao excluir cliente' }).code(500);
            }
        }
    }
];
