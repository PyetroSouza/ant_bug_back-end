/***************************************************************
 * Objetivo: Arquivo responsável pela padronização das mensagens e status code do projeto Planete Verde
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
  * Versão: 1.0
 ***************************************************************/

const { response } = require("express");

const DEFAULT_MESSAGE = {
    api_description: "API para controlar projeto Planeta Verde",
    development: "Pyetro Ferreira",
    version: "1.0.6.26",
    status: Boolean,
    status_code: Number,
    response: {}
}

const ERROR_BAD_REQUEST = {
    status: false,
    status_code: 400,
    message: "Não foi possível processar a requisição devido a erros de entrada de dados"
}

const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: "Não foram encontrados dados para retorno"
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: "Não foi possível processar a requisição, pois o formato de dados encaminhado não é suportado pelo servidor, apenas deve ser utilizado em formato JSON"
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido ao um erro interno no servidor [MODEL]"
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido ao um erro interno no servidor [CONTROLLER]"
}

const ERROR_UNAUTHORIZED = {
    status: false,
    status_code: 401,
    message: 'Não autorizado'
}

const SUCCESS_RESPONSE = {
    status: true,
    status_code: 200
}

const SUCCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'Item atualizado com sucesso'
}

const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: "Item inserido com sucesso!"
}

const SUCCESS_DELETED_ITEM = {
    status: true,
    status_code: 200,
    message: "Item excluído com sucesso!"
}

const SUCCESS_CREATED_ITEM_WARNING = {
    status: true,
    status_code: 201,
    message: "Item insesrido com sucesso, porém alguns dados tiveram problemas no cadastro [DADOS DE RELACIONAMENTO]"
}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    ERROR_NOT_FOUND,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_UNAUTHORIZED,
    SUCCESS_RESPONSE,
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATE_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_CREATED_ITEM_WARNING
}