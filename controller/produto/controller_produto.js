/*
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 17/04/2026
* Autor : João Pedro
* Versão : 1.0
 */

const configMessage = require('../modulo/configMessage.js')

const produtoDAO = require('../../model/DAO/produto/produto.js')

const inserirNovoProduto = async function (produto, contentType) {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a original
    let message = JSON.parse(JSON.stringify(configMessage))
    try {

        //validação para o tipo de dados da requisição (somente JSON)
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //validação para os atributos do produto ( Status 400)
            let validar = await validarDados(produto)

            //se a função validar retornar um Json de erro, iremos devolver ao app o ERRO
            if (validar) {
                return validar //400
            } else {
                //Encaminha os dados do produto para o DAO
                let result = await produtoDAO.insertProduto(produto)
                if (result) { //201
                    //Criando o atributo ID no JSON do produto e colocando o ID gerado após o insert
                    produto.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = produto

                    return message.DEFAULT_MESSAGE
                } else { //500
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para atualizar um produto
const atualizarProduto = async function (produto, id, contentType) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        //validação do contenty type para receber apenas JSON
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //validação para o ID incorreto
            let resultBuscarID = await buscarProduto(id)

            //se a função encontrar o produto o atributo do json será verdadeiro
            //isso significa que o produto existe na base, caso não retorne true,
            //o retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if (resultBuscarID.status) {
                let validar = await validarDados(produto)

                //validação de campos obrigatórios para a atualização (body)
                if (!validar) {
                    //Adiciono o atributo ID do produto no JSON para ser enviado ao DAO
                    produto.id = id

                    //chama a função do DAO para atualizar o produto ( dados e ID)
                    let result = await produtoDAO.updateProduto(produto)

                    if (result) {
                        message.DEFAULT_MESSAGE.status =
                            message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code =
                            message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message =
                            message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response = produto

                        return message.DEFAULT_MESSAGE //200 (atualizado)
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL //500

                    }
                } else {
                    return validar //400
                }
            } else {
                return resultBuscarID //400, 404 ou 500
            }

        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 ( controller)
    }
}

//Função para retornar todos os produtos
const listarProduto = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        //Chama a função do DAO para retornar a lista de todos os produtos
        let result = await produtoDAO.selectAllProduto()
        //Validação para verificar se o DAO conseguiu processar os dados
        if (result) {
            //validação para verificar se existe conteúdo no array
            if (result.length > 0) {
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code =
                    message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.produto = result

                return message.DEFAULT_MESSAGE //200 (dados do produto)
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }

}

//Função para buscar um produto pelo ID
const buscarProduto = async function (id) {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a original
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        //Validação para garantir que o ID seja válido
        if (id == undefined || id == '' || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
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

                    return message.DEFAULT_MESSAGE //200
                } else {
                    return message.ERROR_NOT_FOUND //400
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para excluir um produto
const excluirProduto = async function (id) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        //Validação do erro 400 e 404
        let resultBuscarID = await buscarProduto(id)

        //Validação para verificar se o status é verdadeiro ( se existe produto)
        if (resultBuscarID.status) {
            //Chamar a função do DAO para excluir o produto
            let result = await produtoDAO.deleteProduto(id)

            if (result) {
                return message.SUCCESS_DELETED_ITEM //200 (registro excluído)
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        } else {
            return resultBuscarID //400 ou 404
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 controler
    }

}


//função para validar todos os dados de produto
//(obrigatório, qntde de caracteres, etc)
const validarDados = async function (produto) {
    //Cria um clone da const de mensagens
    let message = JSON.parse(JSON.stringify(configMessage))

    if (produto.nome == undefined || produto.nome == '' || produto.nome == null || produto.nome.length > 80) {
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
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