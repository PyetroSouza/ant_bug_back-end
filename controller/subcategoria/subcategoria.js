/*************************************************************************
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 12/06/2026
* Autor : Pyetro Ferreira
* Versão : 1.0
 *************************************************************************/


const configMessage = require("../modulo/configMessage")

const subcategoriaDAO = require('../../model/DAO/subcategoria/subcategoria.js')

const controllerCategoria = require('../modulo/')

const inserirNovaSubcategoria = async function (subcategoria, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessage))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            let validar = await validarDados(subcategoria)
            if(validar){
                return validar
            } else {
                let result = await subcategoriaDAO.insertSubcategoria(subcategoria)
                if(result){
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










const validarDados = async function (subcategoria) {
    
}