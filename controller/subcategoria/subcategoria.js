/*************************************************************************
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 12/06/2026
* Autor : Pyetro Ferreira
* Versão : 1.0
 *************************************************************************/


const configMessage = require("../modulo/configMessage")

const subcategoriaDAO = require('../../model/DAO/subcategoria/subcategoria.js')

const controllerCategoria = require('../categoria/controller_categoria.js')
const res = require("express/lib/response.js")

const inserirNovaSubcategoria = async function (subcategoria, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let validar = await validarDados(subcategoria)
            if (validar) {
                return validar
            } else {
                let result = await subcategoriaDAO.insertSubcategoria(subcategoria)
                if (result) {
                    subcategoria.id = result

                    subcategoria.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = subcategoria
                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const updateSubtegoria = async function (subcategoria, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            let resultBuscarSubcategoria = await buscarSubcategoria(id)
            if (resultBuscarSubcategoria.status) {
                let validar = await validarDados(subcategoria)
                if (!validar) {
                    subcategoria.id = Number(id)
                    let result = await subcategoriaDAO.updateSubCategoria(subcategoria)

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = subcategoria

                        return customMessage.DEFAULT_MESSAGE
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar
                }
            } return resultBuscarSubcategoria
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const listarSubcategoria = async function () {
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        let result = await subcategoriaDAO.selectAllSubcategoria()
        if (result) {
            if (result.lenght > 0) {
                for (let subcategoria of result) {
                    let resultCategoria = await controllerCategoria.buscarCategoria(subcategoria.id_categoria)
                    if (resultCategoria.status) {
                        subcategoria.categoria = resultCategoria.response.categoria
                        delete subcategoria.id_categoria
                    }
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.subcategoria = result

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

const buscarSubcategoria = async function () {
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if (id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'

            return customMessage.ERROR_BAD_REQUEST //400

        } else {
            let result = await subcategoriaDAO.selectByIdSubcategoria(id)

            if (result) {
                if (result.length > 0) {
                    for (let subcategoria of result) {
                        let resultCategoria = await controllerCategoria.buscarCategoria(subcategoria.id_categoria)
                        if (resultCategoria.status) {
                            subcategoria.id_categoria = resultCategoria.response.categoria
                            delete subcategoria.id_categoria
                        }
                    }
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.subcategoria = result

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

const deleteSubCategoria = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))
    try {
        let buscarSubcategoriaResult = await buscarSubcategoria(id)

        if (buscarSubcategoriaResult.status) {
            let result = await subcategoriaDAO.deleteSubategoria(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return buscarSubcategoriaResult
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (subcategoria) {
    let customMessage = JSON.parse(JSON.stringify(configMessage))
    if (subcategoria.nome == undefined || subcategoria.nome == "" || subcategoria.nome == null || subcategoria.nome.lenght > 100 || subcategoria.nome.lenght < 3) {
        customMessage.ERROR_BAD_REQUESET.field = "[NOME] INVÁLIDO"
    } else if (subcategoria.id_categoria == undefined || subcategoria.id_categoria == "" || subcategoria.id_categoria == null || isNaN(subcategoria.id_categoria) || subcategoria.id_categoria <= 0) {
        customMessage.ERROR_BAD_REQUESET.field = "[ID CATEGORIA] INVÁLIDO"
    } else {
        return false
    }
} 