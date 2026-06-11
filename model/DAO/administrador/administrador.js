/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados do administrador no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

const knex = require("knex")

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertAdministrador = async function (administrador) {
    try {
        let sql = `insert into tbl_administrador(
        nome,
        email,
        senha
        ) values (
        replace("${administrador.nome}", "'", ""),
        replace("${administrador.email}", "'", ""),
        replace("${administrador.senha}", "'", ""),
        )`

        let result = await knexConection.raw(sql)
        if (result) {
            return result[0].insertId
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateAdministrador = async function (administrador) {
    try {
        let sql = `update tbl_administrador set 
    nome        =   ${administrador.nome},
    email       =   ${administrador.email},
    senha       =   ${administrador.senha}
    where id = ${administrador.id}`

        let result = await knexConection.raw(sql)
        if (result) {
            return result[0].insertId
        }
    } catch (error) {

    }
}

const selectAllAdministrador = async function () {
    try {
        let sql = 'select * from tbl_administrador order by id desc'
        let result = await knexConection.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdAdministrador = async function (id) {
    try {
        let sql = `select * from tbl_administrador where id = ${id}`
        let result = await knexConection.raw(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const deleteAdministrador = async function (id) {
    try {
        let sql = `delete from tbl_administrador where id = ${id}`
        let result = await knexConection.raw(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertAdministrador,
    updateAdministrador,
    selectAllAdministrador,
    selectByIdAdministrador,
    deleteAdministrador
}