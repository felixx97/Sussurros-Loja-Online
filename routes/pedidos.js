const Joi = require('joi');
const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');

module.exports = [
    {
        method: 'GET',
        path: '/pedidos',
        handler: async (request, h) => {
            try {
                const pedidos = await Pedido.query().withGraphFetched('[cliente, itensPedido]');
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
                const pedido = await Pedido.query().findById(id).withGraphFetched('[cliente, itensPedido]');
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
                // Verifica se o cliente existe
                const cliente = await Cliente.query().findById(cliente_id);
                if (!cliente) {
                    return h.response({ message: 'Cliente não encontrado' }).code(404);
                }

                // Cria o pedido
                const pedido = await Pedido.query().insert({
                    cliente_id,
                    total,
                    status
                });

                // Adiciona os itens ao pedido
                const itensPedidoPromises = itens.map(async (item) => {
                    const produto = await Produto.query().findById(item.produto_id);
                    if (!produto) {
                        return h.response({ message: `Produto com ID ${item.produto_id} não encontrado` }).code(404);
                    }

                    return ItemPedido.query().insert({
                        pedido_id: pedido.id,
                        produto_id: item.produto_id,
                        quantidade: item.quantidade,
                        preco: item.preco
                    });
                });

                await Promise.all(itensPedidoPromises);

                return h.response(pedido).code(201);
            } catch (error) {
                console.error('Erro ao criar pedido:', error);
                return h.response({ message: 'Erro ao criar pedido' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    cliente_id: Joi.number().integer().required(),
                    total: Joi.number().precision(2).required(),
                    status: Joi.string().required(),
                    itens: Joi.array().items(
                        Joi.object({
                            produto_id: Joi.number().integer().required(),
                            quantidade: Joi.number().integer().required(),
                            preco: Joi.number().precision(2).required()
                        })
                    ).required()
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
