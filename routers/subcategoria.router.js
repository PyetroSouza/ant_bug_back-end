/*******************************************************************
 * Objetivo: Arquivo responsável pela organização de rotas do administrador.
 * Autor: João Pedro dos Santos
 * Data: 16/06/2026 
 * Versão: 1.0
*******************************************************************/

const express = require('express')
const router = express.Router()

const controllerSubcategoria = require('../controller/subcategoria/controller_subcategoria')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerSubcategoria.inserirNovaSubcategoria(dados, contentType)

    response.status(result.status_code)
})

router.get('/', async function (request, response) {
    let result = await controllerSubcategoria.listarSubcategoria()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id
    let result = await controllerSubcategoria.buscarSubcategoria(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body
    let result = await controllerSubcategoria.atualizarSubcategoria(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id
    let result = await controllerSubcategoria.excluirSubcategoria(id)
    response.status(result.status_code)
    response.json(result)
})

module.exports = router