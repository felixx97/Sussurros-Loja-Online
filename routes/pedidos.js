const Joi = require('joi');
const Pedido = require('../models/Pedido');

module.exports = [
    {
        method: 'GET',
        path: '/pedidos',
        handler: async (request, h) => {
            try {
                const pedidos = await Pedido.query().withGraphFetched('[cliente, itens]');
                return pedidos;
            } catch (error) {
                console.error('Erro ao obter pedidos do banco de dados:', error);
                return h.response({ message: 'Erro ao obter pedidos do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'GET',
        path: '/pedidos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const pedido = await Pedido.query().findById(id).withGraphFetched('[cliente, itens]');
                if (pedido) {
                    return pedido;
                } else {
                    return h.response({ message: 'Pedido não encontrado' }).code(404);
                }
            } catch (error) {
                console.error('Erro ao obter pedido do banco de dados:', error);
                return h.response({ message: 'Erro ao obter pedido do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'POST',
        path: '/pedidos',
        handler: async (request, h) => {
            const { cliente_id, total, status, itens } = request.payload;
            try {
                const novoPedido = await Pedido.query().insertGraph({
                    cliente_id,
                    total,
                    status,
                    itens
                });
                return h.response(novoPedido).code(201);
            } catch (error) {
                console.error('Erro ao criar novo pedido:', error);
                return h.response({ message: 'Erro ao criar novo pedido' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    cliente_id: Joi.number().required(),
                    total: Joi.number().precision(2).required(),
                    status: Joi.string().required(),
                    itens: Joi.array().items(Joi.object({
                        produto_id: Joi.number().required(),
                        quantidade: Joi.number().required(),
                        preco: Joi.number().precision(2).required()
                    })).required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/pedidos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { cliente_id, total, status, itens } = request.payload;
            try {
                const pedidoAtualizado = await Pedido.query().upsertGraph({
                    id,
                    cliente_id,
                    total,
                    status,
                    itens
                });
                return h.response(pedidoAtualizado).code(200);
            } catch (error) {
                console.error('Erro ao atualizar pedido:', error);
                return h.response({ message: 'Erro ao atualizar pedido' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    cliente_id: Joi.number().required(),
                    total: Joi.number().precision(2).required(),
                    status: Joi.string().required(),
                    itens: Joi.array().items(Joi.object({
                        produto_id: Joi.number().required(),
                        quantidade: Joi.number().required(),
                        preco: Joi.number().precision(2).required()
                    })).required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/pedidos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                await Pedido.query().deleteById(id);
                return h.response().code(204);
            } catch (error) {
                console.error('Erro ao deletar pedido:', error);
                return h.response({ message: 'Erro ao deletar pedido' }).code(500);
            }
        }
    }
];
