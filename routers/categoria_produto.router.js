/*******************************************************************
 * Objetivo: Arquivo responsável pela organização de rotas da intermediária categoria_produto.
 * Data: 18/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
*******************************************************************/

const express = require('express')
const router = express.Router()

const controllerCategoriaProduto = require('../controller/categoria/controller_categoria_produto')
const multer = require('multer')
const upload = multer()

router.post('/', upload.none(), async function (request, response) {
    let dados = request.body
    let result = await controllerCategoriaProduto.inserirNovoCategoriaProduto(dados)

    response.status(result.status_code).json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerCategoriaProduto.listarCategoriaProduto()

    response.status(result.status_code).json(result)
})

router.delete('/produto/:idProduto', async function (request, response) {
    let idProduto = request.params.idProduto
    let result = await controllerCategoriaProduto.excluirCategoriaIdProduto(idProduto)

    response.status(result.status_code).json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id
    let result = await controllerCategoriaProduto.excluirCategoriaProduto(id)

    response.status(result.status_code).json(result)
})

module.exports = router