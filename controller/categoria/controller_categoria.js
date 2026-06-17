/**************************************************************************
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de Categoria
* Data: 12/06/2026
* Autor : João Pedro
* Versão : 1.0
 **************************************************************************/

const configMessage = require('../modulo/configMessage.js')

const categoriaDAO = require('../../model/DAO/categoria/categoria.js')

const controllerCategoriaProduto = require('./controller_categoria_produto.js')

const inserirNovaCategoria = async function (categoria, contentType) {

    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(categoria)

            if (validar) {
                return validar
            } else {

                let result = await categoriaDAO.insertCategoria(categoria)


                if (result) { 
                    categoria.id = result

                    for (let produto of categoria.produto) {
                        let categoriaProduto = {
                            "id_categoria": categoria.id,
                            "id_produto": produto.id
                        }
                        let resultCategoriaProduto = await controllerCategoriaProduto.inserirNovoCategoriaProduto(categoriaProduto)
                        if (!resultCategoriaProduto.status) {
                            return message.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = categoria

                    return message.DEFAULT_MESSAGE
                } else { 
                    return message.ERROR_INTERNAL_SERVER_MODEL 
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 

    }
}

const atualizarCategoria = async function (categoria, id, contentType) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarCategoria(id)

            if (resultBuscarID.status) {
                let validar = await validarDados(categoria)

                if (!validar) {
                    categoria.id = Number(id)

                    let result = await categoriaDAO.updateCategoria(categoria)

                    if (result) {
                        if (categoria.produto && categoria.produto.length > 0) {
                            await controllerCategoriaProduto.excluirProdutoIdCategoria(categoria.id)

                            for (let produto of categoria.produto) {
                                let categoriaProduto = {
                                    id_categoria: categoria.id,
                                    id_produto: produto.id
                                }
                                let resultCategoriaProduto = await controllerCategoriaProduto.inserirNovoCategoriaProduto(categoriaProduto)
                                if (!resultCategoriaProduto.status) {
                                    return message.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }
                        }

                        message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response = categoria

                        return message.DEFAULT_MESSAGE 
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar 
                }
            } else {
                return resultBuscarID 
            }
        } else {
            return message.ERROR_CONTENT_TYPE 
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarCategoria = async function () {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let result = await categoriaDAO.selectAllCategorias()

        if (result) {
            if (result.length > 0) {

                for (let categoria of result) {
                    let resultProduto = await controllerCategoriaProduto.buscarProdutoIdCategoria(categoria.id)
                    if (resultProduto.status) {
                        categoria.produtos = resultProduto.response.categoria_produto
                    }
                }

                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.categoria = result

                return message.DEFAULT_MESSAGE
            } else {
                return message.ERROR_NOT_FOUND 
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const buscarCategoria = async function (id) {
      let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (id == undefined || id == '' || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        } else {
            let result = await categoriaDAO.selectByIdCategoria(id)

            if (result) {
                if (result.length > 0) {

                    for (let categoria of result) {
                        let resultProduto = await controllerCategoriaProduto.buscarProdutoIdCategoria(categoria.id)
                        if (resultProduto.status) {
                            categoria.produtos = resultProduto.response.categoria_produto
                        }
                    }

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.categoria = result

                    return message.DEFAULT_MESSAGE 
                } else {
                    return message.ERROR_NOT_FOUND 
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirCategoria = async function (id) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let resultBuscarID = await buscarCategoria(id)

        if (resultBuscarID.status) {
            let result = await categoriaDAO.deleteCategoria(id)

            if (result) {
                return message.SUCCESS_DELETED_ITEM 
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarID 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const validarDados = async function (categoria) {
    let message = JSON.parse(JSON.stringify(configMessage))

    if (categoria.nome == undefined || categoria.nome == '' || categoria.nome == null ||
        categoria.nome.length > 80) {
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

module.exports = {
    inserirNovaCategoria,
    atualizarCategoria,
    listarCategoria,
    buscarCategoria,
    excluirCategoria
}