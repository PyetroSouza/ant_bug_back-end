/*******************************************************************
 * Objetivo: Arquivo responsável pela organização de rotas do administrador.
 * Autor: Pyetro Ferreira de Souza
 * Data: 15/06/2026 
 * Versão: 1.0
*******************************************************************/

const express = require('express')
const router = express.Router()

const controllerAdmin = require('../controller/administrador/controller_administrador')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerAdmin.inserirNovoAdministrador(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerAdmin.listarAdministrador()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id
    let result = await controllerAdmin.buscarAdministrador(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body
    let result = await controllerAdmin.atualizarAdministrador(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id
    let result = await controllerAdmin.excluirAdministrador(id)
    response.status(result.status_code)
    response.json(result)
})

router.post('/login', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerAdmin.logarAdministrador(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router