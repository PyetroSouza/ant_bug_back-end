/*
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 12/06/2026
* Autor : João Pedro
* Versão : 1.0
 */

//Import do arquivo de padronizacao de mensagens
const configMessage = require('../modulo/configMessage.js')

//Import do arquivo DAO para fazer o CRUDO do categoria no banco de dados
const categoriaDAO = require('../../model/DAO/categoria/categoria.js')

const controllerProduto = require('../produto/controller_produto.js')
const controllerCategoriaProduto = require('./controller_categoria_produto.js')

//funcao para inserir uma nova categoria
const inserirNovaCategoria = async function (categoria, contentType) {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a original
    let message = JSON.parse(JSON.stringify(configMessage))

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


                if (result) { //201
                    //Criando o atributo ID no JSON do categoria e colocando o ID gerado após o insert
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
                        // Se vier produtos no body, atualiza os vínculos
                        if (categoria.produto && categoria.produto.length > 0) {
                            // Deleta os vínculos antigos da categoria
                            await controllerCategoriaProduto.excluirProdutoIdCategoria(categoria.id)

                            // Insere os novos vínculos
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

                        return message.DEFAULT_MESSAGE // 200
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return validar // 400
                }
            } else {
                return resultBuscarID // 400, 404 ou 500
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Função para retornar todos as categorias
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

                return message.DEFAULT_MESSAGE //200
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar um genero pelo ID
const buscarCategoria = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        //Validaçção para garantir que o ID seja válido
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
    let message = JSON.parse(JSON.stringify(configMessage))

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
    let message = JSON.parse(JSON.stringify(configMessage))

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