/**************************************************************************
* Objetivo : Arquivo responsável pela validação, tratamento e manipulação
* de dados para o CRUD de Administrador
* Data: 15/06/2026
* Autor : Pyetro Ferreira
* Versão : 1.0
 **************************************************************************/

const configMessage = require('../modulo/configMessage.js')
const administradorDAO = require('../../model/DAO/administrador/administrador.js')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10

const inserirNovoAdministrador = async function (administrador, contentType) {

    let message = JSON.parse(JSON.stringify(configMessage))
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
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarAdministrador(id)
            if (resultBuscarID.status) {
                let validar = await validarDados(administrador)

                if (!validar) {
              
                    administrador.id = Number(id)

                 
                    let result = await administradorDAO.updateAdministrador(administrador)

                    if (result) {
                        message.DEFAULT_MESSAGE.status =
                            message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code =
                            message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message =
                            message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response = administrador

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

const listarAdministrador = async function () {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let result = await administradorDAO.selectAllAdministrador()
        if (result) {
            if (result.length > 0) {
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code =
                    message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.administrador = result

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

const buscarAdministrador = async function (id) {

    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (id == undefined || id == '' || id == null || isNaN(id) || id <= 0) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
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

const excluirAdministrador = async function (id) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        let resultBuscarID = await buscarAdministrador(id)

        if (resultBuscarID.status) {
            let result = await administradorDAO.deleteAdministrador(id)

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


const logarAdministrador = async function (administrador, contentType) {
    let message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!administrador.email || !administrador.senha) {
                message.ERROR_BAD_REQUEST.field = '[EMAIL] ou [SENHA] não informados'
                return message.ERROR_BAD_REQUEST 
            }

            let result = await administradorDAO.selectLoginAdministrador(administrador.email)

            if (result) {
                let admin = result[0]

                let senhaValida = await bcrypt.compare(administrador.senha, admin.senha)

                if (senhaValida) {
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

                    return message.DEFAULT_MESSAGE

                } else {
                    return message.ERROR_UNAUTHORIZED 
                }

            } else {
                return message.ERROR_NOT_FOUND 
            }

        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const verificarToken = function (req, res, next) {
    let token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token não fornecido.' })
    }

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
    let message = JSON.parse(JSON.stringify(configMessage))

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