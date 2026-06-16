/*
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de produto
* Data: 15/06/2026
* Autor : Pyetro Ferreira
* Versão : 1.0
 */

const configmessage = require('../modulo/configMessage.js')
const administradorDAO = require('../../model/DAO/administrador/administrador.js')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10

const inserirNovoAdministrador = async function (administrador, contentType) {

    let message = JSON.parse(JSON.stringify(configmessage))
    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(administrador)


            if (validar) {
                return validar
            } else {
                administrador.senha = await bcrypt.hash(administrador.senha, SALT_ROUNDS)

                let result = await administradorDAO.insertAdministrador(administrador)
                if (result) {

                    administrador.id = result
                    delete administrador.senha

                    message.DEFAULT_MESSAGE.status =
                        message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code =
                        message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message =
                        message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = administrador

                    return message.DEFAULT_MESSAGE
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarAdministrador = async function (administrador, id, contentType) {
    let message = JSON.parse(JSON.stringify(configmessage))

    try {
        //validação do contenty type para receber apenas JSON
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //validação para o ID incorreto
            let resultBuscarID = await buscarAdministrador(id)

            //se a função encontrar o produto o atributo do json será verdadeiro
            //isso significa que o produto existe na base, caso não retorne true,
            //o retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if (resultBuscarID.status) {
                let validar = await validarDados(administrador)

                //validação de campos obrigatórios para a atualização (body)
                if (!validar) {
                    //Adiciono o atributo ID do produto no JSON para ser enviado ao DAO
                    administrador.id = id

                    //chama a função do DAO para atualizar o produto ( dados e ID)
                    let result = await administradorDAO.updateAdministrador(administrador)

                    if (result) {
                        message.DEFAULT_MESSAGE.status =
                            message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code =
                            message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message =
                            message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response = administrador

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

const listarAdministrador = async function () {
    let message = JSON.parse(JSON.stringify(configmessage))

    try {
        let result = await administradorDAO.selectAllAdministrador()
        if (result) {
            if (result.length > 0) {
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code =
                    message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.administrador = result

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
const buscarAdministrador = async function (id) {

    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a original
    let message = JSON.parse(JSON.stringify(configmessage))

    try {
        //Validação para garantir que o ID seja válido
        if (id == undefined || id == '' || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        } else {
            let result = await administradorDAO.selectByIdAdministrador(id)

            if (result) {
                if (result.length > 0) {
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code =
                        message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.status_code =
                        message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.administrador = result

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
const excluirAdministrador = async function (id) {
    let message = JSON.parse(JSON.stringify(configmessage))

    try {
        //Validação do erro 400 e 404
        let resultBuscarID = await buscarAdministrador(id)

        //Validação para verificar se o status é verdadeiro ( se existe produto)
        if (resultBuscarID.status) {
            //Chamar a função do DAO para excluir o produto
            let result = await administradorDAO.deleteAdministrador(id)

            if (result) {
                return message.SUCESS_DELETED_ITEM //200 (registro excluído)
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


const logarAdministrador = async function (administrador, contentType) {
    let message = JSON.parse(JSON.stringify(configmessage))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!administrador.email || !administrador.senha) {
                message.ERROR_BAD_REQUEST.field = '[EMAIL] ou [SENHA] não informados'
                return message.ERROR_BAD_REQUEST // 400
            }

            // Busca só pelo email no banco
            let result = await administradorDAO.selectLoginAdministrador(administrador.email)

            if (result) {
                let admin = result[0]

                // Compara a senha digitada com o hash do banco
                let senhaValida = await bcrypt.compare(administrador.senha, admin.senha)

                if (senhaValida) {
                    // Gera o token JWT
                    let token = jwt.sign(
                        { id: admin.id, email: admin.email },
                        JWT_SECRET,
                        { expiresIn: '8h' }
                    )

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.message = 'Login realizado com sucesso.'
                    message.DEFAULT_MESSAGE.response = {
                        token,
                        administrador: {
                            id: admin.id,
                            nome: admin.nome,
                            email: admin.email
                        }
                    }

                    return message.DEFAULT_MESSAGE // 200

                } else {
                    return message.ERROR_UNAUTHORIZED // 401
                }

            } else {
                return message.ERROR_NOT_FOUND // 404
            }

        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const verificarToken = function (req, res, next) {
    let token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token não fornecido.' })
    }

    // Remove o "Bearer " se vier no formato padrão
    if (token.startsWith('Bearer ')) {
        token = token.slice(7)
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Token inválido ou expirado.' })
        }
        req.adminId = decoded.id
        next()
    })
}


const validarDados = async function (administrador) {
    let message = JSON.parse(JSON.stringify(configmessage))

    if (
        administrador.nome == undefined || administrador.nome == '' || administrador.nome == null || administrador.nome.length < 3 || administrador.nome.length > 100
    ) {
        message.ERROR_BAD_REQUEST.field = '[NOME DE USUÁRIO] INVÁLIDO'

    } else if (
        administrador.email == undefined || administrador.email == '' || administrador.email == null || administrador.email.length < 5 || administrador.email.length > 256
    ) {
        message.ERROR_BAD_REQUEST.field = '[EMAIL] INVÁLIDO'

    } else if (
        administrador.senha == undefined || administrador.senha == '' || administrador.senha == null || administrador.senha.length < 8 || administrador.senha.length > 256
    ) {
        message.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'

    } else {
        return false
    }

    return message.ERROR_BAD_REQUEST
}


module.exports = {
    inserirNovoAdministrador,
    listarAdministrador,
    buscarAdministrador,
    atualizarAdministrador,
    excluirAdministrador,
    logarAdministrador,
    verificarToken
}