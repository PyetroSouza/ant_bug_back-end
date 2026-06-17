/**************************************************************************
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 12/06/2026
* Autor : João Pedro
* Versão : 1.0
 **************************************************************************/

const configMessage = require('../modulo/configMessage.js')

const produtoDAO = require('../../model/DAO/produto/produto.js')

const inserirNovoProduto = async function (produto, contentType) {

    let message = JSON.parse(JSON.stringify(configMessage))
    try {

        if (String(contentType).toUpperCase().includes('MULTIPART/FORM-DATA')) {
            let validar = await validarDados(produto)

            if (validar) {
                return validar 
            } else {
                let result = await produtoDAO.insertProduto(produto)
                if (result) { 
                    produto.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = produto

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

const atualizarProduto = async function (produto, id, contentType) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase().includes('MULTIPART/FORM-DATA')) {
            let resultBuscarID = await buscarProduto(id)


            if (resultBuscarID.status) {
                let validar = await validarDados(produto)

                if (!validar) {
                    produto.id = id

                    let result = await produtoDAO.updateProduto(produto)

                    if (result) {
                        message.DEFAULT_MESSAGE.status =
                            message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code =
                            message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message =
                            message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response = produto

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
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const listarProduto = async function () {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let result = await produtoDAO.selectAllProduto()
        if (result) {
            if (result.length > 0) {
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code =
                    message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.produto = result

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

const buscarProduto = async function (id) {

    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (id == undefined || id == '' || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST 
        } else {
            let result = await produtoDAO.selectByIdProduto(id)

            if (result) {
                if (result.length > 0) {
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code =
                        message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.status_code =
                        message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.produto = result

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

const excluirProduto = async function (id) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let resultBuscarID = await buscarProduto(id)

        if (resultBuscarID.status) {
            let result = await produtoDAO.deleteProduto(id)

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

const validarDados = async function (produto) {
    let message = JSON.parse(JSON.stringify(configMessage))

    if (produto.nome == undefined || produto.nome == '' || produto.nome == null || produto.nome.length > 80) {
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST 
    } else {
        return false
    }

}

module.exports = {
    inserirNovoProduto,
    listarProduto,
    buscarProduto,
    atualizarProduto,
    excluirProduto
}