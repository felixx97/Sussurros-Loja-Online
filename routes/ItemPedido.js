const Joi = require('joi');
const ItemPedido = require('../models/ItemPedido');

module.exports = [
    {
        method: 'GET',
        path: '/itens-pedido',
        handler: async (request, h) => {
            try {
                const itensPedido = await ItemPedido.query().withGraphFetched('[pedido, produto]');
                return itensPedido;
            } catch (error) {
                console.error('Erro ao obter itens do pedido do banco de dados:', error);
                return h.response({ message: 'Erro ao obter itens do pedido do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'GET',
        path: '/itens-pedido/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const itemPedido = await ItemPedido.query().findById(id).withGraphFetched('[pedido, produto]');
                if (itemPedido) {
                    return itemPedido;
                } else {
                    return h.response({ message: 'Item do pedido não encontrado' }).code(404);
                }
            } catch (error) {
                console.error('Erro ao obter item do pedido do banco de dados:', error);
                return h.response({ message: 'Erro ao obter item do pedido do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'POST',
        path: '/itens-pedido',
        handler: async (request, h) => {
            const { pedido_id, produto_id, quantidade, preco } = request.payload;
            try {
                const novoItemPedido = await ItemPedido.query().insert({
                    pedido_id,
                    produto_id,
                    quantidade,
                    preco
                });
                return h.response(novoItemPedido).code(201);
            } catch (error) {
                console.error('Erro ao criar novo item do pedido:', error);
                return h.response({ message: 'Erro ao criar novo item do pedido' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    pedido_id: Joi.number().required(),
                    produto_id: Joi.number().required(),
                    quantidade: Joi.number().required(),
                    preco: Joi.number().precision(2).required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/itens-pedido/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { pedido_id, produto_id, quantidade, preco } = request.payload;
            try {
                const itemPedidoAtualizado = await ItemPedido.query().patchAndFetchById(id, {
                    pedido_id,
                    produto_id,
                    quantidade,
                    preco
                });
                return h.response(itemPedidoAtualizado).code(200);
            } catch (error) {
                console.error('Erro ao atualizar item do pedido:', error);
                return h.response({ message: 'Erro ao atualizar item do pedido' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    pedido_id: Joi.number().required(),
                    produto_id: Joi.number().required(),
                    quantidade: Joi.number().required(),
                    preco: Joi.number().precision(2).required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/itens-pedido/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                await ItemPedido.query().deleteById(id);
                return h.response().code(204);
            } catch (error) {
                console.error('Erro ao deletar item do pedido:', error);
                return h.response({ message: 'Erro ao deletar item do pedido' }).code(500);
            }
        }
    }
];
