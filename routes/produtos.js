const Joi = require('joi');
const Produto = require('../models/Produto');

module.exports = [
    {
        method: 'GET',
        path: '/produtos',
        handler: async (request, h) => {
            try {
                const produtos = await Produto.query();
                return produtos;
            } catch (error) {
                console.error('Erro ao obter produtos do banco de dados:', error);
                return h.response({ message: 'Erro ao obter produtos do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'GET',
        path: '/produtos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const produto = await Produto.query().findById(id);
                if (produto) {
                    return produto;
                } else {
                    return h.response({ message: 'Produto não encontrado' }).code(404);
                }
            } catch (error) {
                console.error('Erro ao obter produto do banco de dados:', error);
                return h.response({ message: 'Erro ao obter produto do banco de dados' }).code(500);
            }
        }
    },
    {
        method: 'POST',
        path: '/produtos',
        handler: async (request, h) => {
            const { nome, descricao, preco, estoque, cover_url } = request.payload;
            try {
                const novoProduto = await Produto.query().insert({
                    nome,
                    descricao,
                    preco,
                    estoque,
                    cover_url
                });
                return h.response(novoProduto).code(201);
            } catch (error) {
                console.error('Erro ao criar novo produto:', error);
                return h.response({ message: 'Erro ao criar novo produto' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    nome: Joi.string().required(),
                    descricao: Joi.string(),
                    preco: Joi.number().precision(2).required(),
                    estoque: Joi.number().required(),
                    cover_url: Joi.string().uri()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/produtos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { nome, descricao, preco, estoque, cover_url } = request.payload;
            try {
                const produtoAtualizado = await Produto.query().patchAndFetchById(id, {
                    nome,
                    descricao,
                    preco,
                    estoque,
                    cover_url
                });
                return h.response(produtoAtualizado).code(200);
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                return h.response({ message: 'Erro ao atualizar produto' }).code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    nome: Joi.string().required(),
                    descricao: Joi.string(),
                    preco: Joi.number().precision(2).required(),
                    estoque: Joi.number().required(),
                    cover_url: Joi.string().uri().optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/produtos/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                await Produto.query().deleteById(id);
                return h.response().code(204);
            } catch (error) {
                console.error('Erro ao deletar produto:', error);
                return h.response({ message: 'Erro ao deletar produto' }).code(500);
            }
        }
    }
];
