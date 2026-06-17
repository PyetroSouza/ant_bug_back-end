/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados da subcategoria no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertSubcategoria = async function (subcategoria) {
    try {
        let sql = `insert into tbl_subcategoria(
        nome,
        id_categoria
    ) values (
     replace("${subcategoria.nome}", "'", ""),
     ${subcategoria.id_categoria}
        );`
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

const updateSubCategoria = async function (subcategoria) {
    try {
        let sql = `update tbl_subcategoria set 
    nome = '${subcategoria.nome}',
    id_categoria = '${subcategoria.id_categoria}'
    where id = ${subcategoria.id}`
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

const selectAllSubcategoria = async function () {
    try {
        let sql = `select * from tbl_subcategoria order by id desc`
        let resut = await knexConection.raw(sql)
        if (Array.isArray(resut)) {
            return resut[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdSubcategoria = async function (id) {
    try {
        let sql = `select * from tbl_subcategoria where id = ${id}`
        let result = await knexConection.raw(sql)
        if (result) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const deleteSubategoria = async function (id) {
    try {
        let sql = `delete from tbl_subcategoria where id = ${id}`
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
    insertSubcategoria,
    updateSubCategoria,
    selectAllSubcategoria,
    selectByIdSubcategoria,
    deleteSubategoria
}
