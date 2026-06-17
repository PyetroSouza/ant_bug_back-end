/***************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de Filme Gênero
 * Data: 22/05/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 ***************************************************************************************************************/

const configMessage = require("../modulo/configMessage.js")

const categoriaProdutoDAO = require('../../model/DAO/categoria_produto/categoria_produto.js')

const inserirNovoCategoriaProduto = async function (categoriaProduto) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        let validar = await validarDados(categoriaProduto)

        if (validar) {
            return validar
        } else {
            let result = await categoriaProdutoDAO.insertCategoriaProduto(categoriaProduto)


            if (result) {
                categoriaProduto.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = categoriaProduto
                return customMessage.DEFAULT_MESSAGE
            }
            else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarCategoriaProduto = async function (categoriaProduto, id) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {

        let resultBuscarCategoriaProduto = await buscarCategoriaProduto(id)

        if (resultBuscarCategoriaProduto.status) {
            let validar = await validarDados(categoriaProduto)
            if (!validar) {
                categoriaProduto.id = Number(id)

                let result = await categoriaProdutoDAO.updateCategoriaProduto((categoriaProduto))

                if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = categoriaProduto

                    return customMessage.DEFAULT_MESSAGE //200
                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validar
            }
        } else {
            return resultBuscarCategoriaProduto
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
//Função para lista CategoriaProduto
const listarCategoriaProduto = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessage))


    try {
        let result = await categoriaProdutoDAO.selectAllCategoriaProduto()

        if (result) {
            if (result.length > 0) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.categoria_produto = result

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_NOT_FOUND
            }
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const buscarCategoriaProduto = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'

            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await categoriaProdutoDAO.selectByIdCategoriaProduto(id)
            if (result) {
                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.categoria_produto = result

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const buscarProdutoIdCategoria = async function (idCategoria) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (idCategoria == undefined || String(idCategoria).replaceAll(' ', '') == '' || idCategoria == null || isNaN(idCategoria) || idCategoria <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'

            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await categoriaProdutoDAO.selectProdutoByIdCategoria(idCategoria)
            if (result) {
                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.categoria_produto = result

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const buscarCategoriasIdProduto = async function (idProduto) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (idProduto == undefined || String(idProduto).replaceAll(' ', '') == '' || idProduto == null || isNaN(idProduto) || idProduto <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_PRODUTO] INVÁLIDO'

            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await categoriaProdutoDAO.selectCategoriaByIdProduto(idProduto)
            if (result) {
                if (result.length > 0) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.categoria_produto = result

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const excluirCategoriaProduto = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))
    try {
        let buscarCategoriaProdutoResult = await buscarCategoriaProduto(id)

        if (buscarCategoriaProdutoResult.status) {
            let result = await categoriaProdutoDAO.deleteCategoriaProduto(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            return buscarCategoriaProdutoResult
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirProdutoIdCategoria = async function (idCategoria) {

    let customMessage = JSON.parse(JSON.stringify(configMessage))
    try {
        let result = await categoriaProdutoDAO.deleteProdutoByIdCategoria(idCategoria)

        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (categoriaProduto) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    if (categoriaProduto.id_categoria == undefined || categoriaProduto.id_categoria == '' || categoriaProduto.id_categoria == null || isNaN(categoriaProduto.id_categoria) || categoriaProduto.id_categoria <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'
    } else if (categoriaProduto.id_produto == undefined || categoriaProduto.id_produto == '' || categoriaProduto.id_produto == null || isNaN(categoriaProduto.id_produto) || categoriaProduto.id_produto <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_PRODUTO] INVÁLIDO'
    } else {
        return false
    }
    return customMessage.ERROR_BAD_REQUEST
}



module.exports = {
    inserirNovoCategoriaProduto,
    atualizarCategoriaProduto,
    listarCategoriaProduto,
    buscarCategoriaProduto,
    buscarProdutoIdCategoria,
    buscarCategoriasIdProduto,
    excluirCategoriaProduto,
    excluirProdutoIdCategoria
}