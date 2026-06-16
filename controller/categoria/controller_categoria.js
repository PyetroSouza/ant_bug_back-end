/*
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 12/06/2026
* Autor : João Pedro
* Versão : 1.0
 */

//Import do arquivo de padronizacao de mensagens
const config_message = require('../modulo/configMessage.js')

//Import do arquivo DAO para fazer o CRUDO do categoria no banco de dados
const categoriaDAO = require('../../model/DAO/categoria/categoria.js')

//funcao para inserir uma nova categoria
const inserirNovaCategoria = async function (categoria, contentType) {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //validação para o tipo de dados da requisição (somente JSON)
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {
            //validação de dados para os atributos da categoria ( Status 400 )
            let validar = await validarDados(categoria)

            //se a função validar retornar um JSON de erro, iremos devolver ao app o erro
            if (validar) {
                return validar //400
            } else {
                //Encaminha os dados da categoria para o DAO
                let result = await categoriaDAO.insertCategoria(categoria)
                console.log(result)

                if (result) { //201
                    //Criando o atributo ID no JSON do categoria e colocando o ID gerado após o insert
                    categoria.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = categoria

                    return message.DEFAULT_MESSAGE
                } else { //500
                    return message.ERROR_INTERNAL_SERVER_MODEL //500(model)
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para atualizar uma categoria
const atualizarCategoria = async function (categoria, id, contentType) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validação do Contenty type para receber apenas JSON
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //Validação para o ID incorreto
            let resultBuscarID = await buscarCategoria(id)

            //Se a função buscar encontrar o categoria o atributo status do JSON será verdadeiro
            //Isso significa que o categoria existe na base, caso não retorne true, então o retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if (resultBuscarID.status) {
                let validar = await validarDados(categoria)

                //Validação de campos obrigatórios para a atualização (Body)
                if (!validar) {
                    //Adiciono o atributo ID do genero no JSON para ser enviado ao DAO
                    categoria.id = categoria

                    //Chama a função do DAO para atualizar o categoria (dados e o ID)
                    let result = await categoriaDAO.updateCategoria(categoria)

                    if (result) {
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response = categoria

                        return message.DEFAULT_MESSAGE //200 (Atualizado)
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validar
                }
            } else {
                return resultBuscarID //400, 404 ou 500 
            }

        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para retornar todos as categorias
const listarCategoria = async function () {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await categoriaDAO.selectAllCategorias()

        if (result) {
            if (result.length > 0) {
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.categoria = result

                return message.DEFAULT_MESSAGE //200
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 ( controller)
    }
}


//Função para buscar um genero pelo ID
const buscarCategoria = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validaçção para garantir que o ID seja válido
        if (id == undefined || id == '' || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        } else {
            let result = await categoriaDAO.selectByIdCategoria(id)

            if (result) {
                if (result.length > 0) {
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.categoria = result

                    return message.DEFAULT_MESSAGE //200
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


//Função para excluir uma categoria
const excluirCategoria = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validação do erro 400 e 404
        let resultBuscarID = await buscarCategoria(id)

        //Validação para verificar se o status é verdadeiro(se existe o Categoria)
        if (resultBuscarID.status) {
            //Chamar a função do DAO para excluir o Categoria
            let result = await categoriaDAO.deleteCategoria(id)

            if (result) {
                return message.SUCCESS_DELETED_ITEM //200 (Registro excluído)
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        } else {
            return resultBuscarID //400 ou 404
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para validar todos os dados de categoria
const validarDados = async function (categoria) {
    let message = JSON.parse(JSON.stringify(config_message))

    if (categoria.nome == undefined || categoria.nome == '' || categoria.nome == null ||
        categoria.nome.length > 80) {
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
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